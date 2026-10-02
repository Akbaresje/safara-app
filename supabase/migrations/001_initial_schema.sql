-- ============================================================================
-- SAFARA DATABASE SCHEMA
-- Migration: 001_initial_schema
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE kyc_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE travel_destination AS ENUM ('makkah', 'madinah', 'istanbul', 'bursa', 'saudi_general', 'turkey_general', 'indonesia');
CREATE TYPE trip_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE listing_type AS ENUM ('traveler_offer', 'buyer_request');
CREATE TYPE listing_status AS ENUM ('draft', 'published', 'fully_booked', 'closed', 'expired');
CREATE TYPE item_category AS ENUM (
  'parfum_attar',
  'sajadah_textiles',
  'kurma_food',
  'skincare_beauty',
  'turkish_delight_tea',
  'leather_goods',
  'electronics_accessories',
  'zamzam_dates',
  'custom_request'
);
CREATE TYPE order_status AS ENUM (
  'inquiry',
  'offer_sent',
  'escrow_pending',
  'escrow_funded',
  'purchased',
  'in_transit',
  'delivered',
  'completed',
  'disputed',
  'cancelled',
  'refunded'
);
CREATE TYPE payment_channel AS ENUM ('qris', 'bca_va', 'mandiri_va', 'bni_va', 'bri_va', 'ovo', 'dana', 'credit_card');
CREATE TYPE dispute_status AS ENUM ('opened', 'under_review', 'resolved_buyer_favored', 'resolved_traveler_favored', 'resolved_split', 'closed');

-- ============================================================================
-- 1. PROFILES
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email citext UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  system_role user_role DEFAULT 'user',
  kyc_status kyc_status DEFAULT 'unverified',
  ktp_verified BOOLEAN DEFAULT FALSE,
  passport_verified BOOLEAN DEFAULT FALSE,
  umrah_badge_active BOOLEAN DEFAULT FALSE,
  trust_score NUMERIC(3, 2) DEFAULT 5.00,
  completed_trips_count INT DEFAULT 0,
  successful_jastip_count INT DEFAULT 0,
  response_rate_percent INT DEFAULT 100,
  avg_response_minutes INT DEFAULT 15,
  bank_code VARCHAR(20),
  bank_account_number VARCHAR(50),
  bank_account_holder VARCHAR(100),
  xendit_sub_account_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profile visible to all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- 2. KYC DOCUMENTS
-- ============================================================================
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doc_type VARCHAR(30) NOT NULL,
  document_number VARCHAR(100),
  document_image_url TEXT NOT NULL,
  selfie_image_url TEXT,
  verification_notes TEXT,
  status kyc_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own KYC docs" ON kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own KYC docs" ON kyc_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. TRIPS
-- ============================================================================
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  origin_city VARCHAR(50) DEFAULT 'Jakarta (CGK)',
  destination travel_destination NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  order_cutoff_date TIMESTAMPTZ NOT NULL,
  available_luggage_kg NUMERIC(5, 2) DEFAULT 10.00,
  used_luggage_kg NUMERIC(5, 2) DEFAULT 0.00,
  max_item_count INT DEFAULT 20,
  notes TEXT,
  ticket_proof_doc_id UUID REFERENCES kyc_documents(id),
  status trip_status DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public trips visible to all" ON trips
  FOR SELECT USING (status IN ('scheduled', 'active'));

CREATE POLICY "Travelers manage own trips" ON trips
  FOR ALL USING (auth.uid() = traveler_id);

-- ============================================================================
-- 4. LISTINGS
-- ============================================================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  type listing_type NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category item_category NOT NULL,
  origin_location travel_destination NOT NULL,
  estimated_item_price_idr NUMERIC(12, 2) NOT NULL,
  estimated_item_price_local NUMERIC(10, 2),
  local_currency VARCHAR(3) DEFAULT 'SAR',
  jastip_fee_idr NUMERIC(12, 2) NOT NULL,
  weight_estimate_kg NUMERIC(4, 2) DEFAULT 0.50,
  quantity_available INT DEFAULT 1,
  images TEXT[] NOT NULL DEFAULT '{}',
  reference_links TEXT[] DEFAULT '{}',
  status listing_status DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published listings visible to all" ON listings
  FOR SELECT USING (status = 'published' OR auth.uid() = creator_id);

CREATE POLICY "Users manage own listings" ON listings
  FOR ALL USING (auth.uid() = creator_id);

-- ============================================================================
-- 5. ORDERS
-- ============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  traveler_id UUID NOT NULL REFERENCES profiles(id),
  status order_status DEFAULT 'inquiry',
  item_name VARCHAR(150) NOT NULL,
  item_description TEXT,
  quantity INT DEFAULT 1,
  weight_kg NUMERIC(4, 2) DEFAULT 0.50,
  item_price_idr NUMERIC(12, 2) NOT NULL,
  jastip_fee_idr NUMERIC(12, 2) NOT NULL,
  domestic_shipping_idr NUMERIC(12, 2) DEFAULT 0.00,
  platform_fee_idr NUMERIC(12, 2) NOT NULL,
  total_amount_idr NUMERIC(12, 2) NOT NULL,
  escrow_funded_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ,
  purchase_receipt_url TEXT,
  purchase_photo_url TEXT,
  shipped_at TIMESTAMPTZ,
  domestic_tracking_number VARCHAR(50),
  domestic_courier VARCHAR(30),
  delivered_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  escrow_released_at TIMESTAMPTZ,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_city VARCHAR(50) NOT NULL,
  delivery_postal_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order parties can view" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = traveler_id);

CREATE POLICY "Buyers create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Order parties can update" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = traveler_id);

-- ============================================================================
-- 6. ESCROW LEDGER (Immutable audit trail)
-- ============================================================================
CREATE TABLE escrow_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  xendit_payment_id VARCHAR(100),
  xendit_disbursement_id VARCHAR(100),
  event_type VARCHAR(50) NOT NULL,
  amount_idr NUMERIC(12, 2) NOT NULL,
  fee_deducted_idr NUMERIC(12, 2) DEFAULT 0.00,
  from_entity VARCHAR(50) NOT NULL,
  to_entity VARCHAR(50) NOT NULL,
  idempotency_key VARCHAR(100) UNIQUE NOT NULL,
  audit_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order parties see own ledger" ON escrow_ledger
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR traveler_id = auth.uid())
  );

-- No INSERT/UPDATE/DELETE for users — service_role only

-- ============================================================================
-- 7. CONVERSATIONS
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  participant_1 UUID NOT NULL REFERENCES profiles(id),
  participant_2 UUID NOT NULL REFERENCES profiles(id),
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2, listing_id)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants see own conversations" ON conversations
  FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- ============================================================================
-- 8. MESSAGES
-- ============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type VARCHAR(30) DEFAULT 'text',
  attachment_urls TEXT[] DEFAULT '{}',
  offer_data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants see messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

CREATE POLICY "Participants send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

CREATE POLICY "Participants mark read" ON messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

-- ============================================================================
-- 9. DISPUTES
-- ============================================================================
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  claimant_id UUID NOT NULL REFERENCES profiles(id),
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  evidence_image_urls TEXT[] NOT NULL DEFAULT '{}',
  status dispute_status DEFAULT 'opened',
  refund_amount_proposed_idr NUMERIC(12, 2),
  final_resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dispute parties can view" ON disputes
  FOR SELECT USING (
    claimant_id = auth.uid() OR
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR traveler_id = auth.uid())
  );

CREATE POLICY "Claimants create disputes" ON disputes
  FOR INSERT WITH CHECK (auth.uid() = claimant_id);

-- ============================================================================
-- 10. REVIEWS
-- ============================================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewed_user_id UUID NOT NULL REFERENCES profiles(id),
  role_reviewed VARCHAR(20) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[] DEFAULT '{}',
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reviews visible" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Reviewers create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_listings_search ON listings USING GIN(to_tsvector('indonesian', title || ' ' || description));
CREATE INDEX idx_listings_filter ON listings(origin_location, category, status, type);
CREATE INDEX idx_orders_buyer ON orders(buyer_id, status);
CREATE INDEX idx_orders_traveler ON orders(traveler_id, status);
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_trips_dates ON trips(destination, departure_date, return_date, status);
CREATE INDEX idx_escrow_order ON escrow_ledger(order_id, created_at DESC);

-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- AUTO-UPDATE updated_at COLUMNS (Trigger)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
