export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin" | "moderator";
export type KycStatus = "unverified" | "pending" | "verified" | "rejected";
export type TravelDestination =
  | "makkah"
  | "madinah"
  | "istanbul"
  | "bursa"
  | "saudi_general"
  | "turkey_general"
  | "indonesia";
export type TripStatus = "scheduled" | "active" | "completed" | "cancelled";
export type ListingType = "traveler_offer" | "buyer_request";
export type ListingStatus = "draft" | "published" | "fully_booked" | "closed" | "expired";
export type ItemCategory =
  | "parfum_attar"
  | "sajadah_textiles"
  | "kurma_food"
  | "skincare_beauty"
  | "turkish_delight_tea"
  | "leather_goods"
  | "electronics_accessories"
  | "zamzam_dates"
  | "custom_request";
export type OrderStatus =
  | "inquiry"
  | "offer_sent"
  | "escrow_pending"
  | "escrow_funded"
  | "purchased"
  | "in_transit"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded";
export type PaymentChannel =
  | "qris"
  | "bca_va"
  | "mandiri_va"
  | "bni_va"
  | "bri_va"
  | "ovo"
  | "dana"
  | "credit_card";
export type DisputeStatus =
  | "opened"
  | "under_review"
  | "resolved_buyer_favored"
  | "resolved_traveler_favored"
  | "resolved_split"
  | "closed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          phone_number: string | null;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          system_role: UserRole;
          kyc_status: KycStatus;
          ktp_verified: boolean;
          passport_verified: boolean;
          umrah_badge_active: boolean;
          trust_score: number;
          completed_trips_count: number;
          successful_jastip_count: number;
          response_rate_percent: number;
          avg_response_minutes: number;
          bank_code: string | null;
          bank_account_number: string | null;
          bank_account_holder: string | null;
          xendit_sub_account_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          phone_number?: string | null;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          system_role?: UserRole;
          kyc_status?: KycStatus;
          ktp_verified?: boolean;
          passport_verified?: boolean;
          umrah_badge_active?: boolean;
          trust_score?: number;
          completed_trips_count?: number;
          successful_jastip_count?: number;
          response_rate_percent?: number;
          avg_response_minutes?: number;
          bank_code?: string | null;
          bank_account_number?: string | null;
          bank_account_holder?: string | null;
          xendit_sub_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      kyc_documents: {
        Row: {
          id: string;
          user_id: string;
          doc_type: string;
          document_number: string | null;
          document_image_url: string;
          selfie_image_url: string | null;
          verification_notes: string | null;
          status: KycStatus;
          verified_at: string | null;
          reviewed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          doc_type: string;
          document_number?: string | null;
          document_image_url: string;
          selfie_image_url?: string | null;
          verification_notes?: string | null;
          status?: KycStatus;
          verified_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["kyc_documents"]["Insert"]>;
      };
      trips: {
        Row: {
          id: string;
          traveler_id: string;
          origin_city: string;
          destination: TravelDestination;
          departure_date: string;
          return_date: string;
          order_cutoff_date: string;
          available_luggage_kg: number;
          used_luggage_kg: number;
          max_item_count: number;
          notes: string | null;
          ticket_proof_doc_id: string | null;
          status: TripStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          traveler_id: string;
          origin_city?: string;
          destination: TravelDestination;
          departure_date: string;
          return_date: string;
          order_cutoff_date: string;
          available_luggage_kg?: number;
          used_luggage_kg?: number;
          max_item_count?: number;
          notes?: string | null;
          ticket_proof_doc_id?: string | null;
          status?: TripStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
      };
      listings: {
        Row: {
          id: string;
          creator_id: string;
          trip_id: string | null;
          type: ListingType;
          title: string;
          description: string;
          category: ItemCategory;
          origin_location: TravelDestination;
          estimated_item_price_idr: number;
          estimated_item_price_local: number | null;
          local_currency: string;
          jastip_fee_idr: number;
          weight_estimate_kg: number;
          quantity_available: number;
          images: string[];
          reference_links: string[];
          status: ListingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          trip_id?: string | null;
          type: ListingType;
          title: string;
          description: string;
          category: ItemCategory;
          origin_location: TravelDestination;
          estimated_item_price_idr: number;
          estimated_item_price_local?: number | null;
          local_currency?: string;
          jastip_fee_idr: number;
          weight_estimate_kg?: number;
          quantity_available?: number;
          images?: string[];
          reference_links?: string[];
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          listing_id: string | null;
          trip_id: string | null;
          buyer_id: string;
          traveler_id: string;
          status: OrderStatus;
          item_name: string;
          item_description: string | null;
          quantity: number;
          weight_kg: number;
          item_price_idr: number;
          jastip_fee_idr: number;
          domestic_shipping_idr: number;
          platform_fee_idr: number;
          total_amount_idr: number;
          escrow_funded_at: string | null;
          purchased_at: string | null;
          purchase_receipt_url: string | null;
          purchase_photo_url: string | null;
          shipped_at: string | null;
          domestic_tracking_number: string | null;
          domestic_courier: string | null;
          delivered_at: string | null;
          completed_at: string | null;
          escrow_released_at: string | null;
          recipient_name: string;
          recipient_phone: string;
          delivery_address: string;
          delivery_city: string;
          delivery_postal_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          listing_id?: string | null;
          trip_id?: string | null;
          buyer_id: string;
          traveler_id: string;
          status?: OrderStatus;
          item_name: string;
          item_description?: string | null;
          quantity?: number;
          weight_kg?: number;
          item_price_idr: number;
          jastip_fee_idr: number;
          domestic_shipping_idr?: number;
          platform_fee_idr: number;
          total_amount_idr: number;
          escrow_funded_at?: string | null;
          purchased_at?: string | null;
          purchase_receipt_url?: string | null;
          purchase_photo_url?: string | null;
          shipped_at?: string | null;
          domestic_tracking_number?: string | null;
          domestic_courier?: string | null;
          delivered_at?: string | null;
          completed_at?: string | null;
          escrow_released_at?: string | null;
          recipient_name: string;
          recipient_phone: string;
          delivery_address: string;
          delivery_city: string;
          delivery_postal_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      escrow_ledger: {
        Row: {
          id: string;
          order_id: string;
          xendit_payment_id: string | null;
          xendit_disbursement_id: string | null;
          event_type: string;
          amount_idr: number;
          fee_deducted_idr: number;
          from_entity: string;
          to_entity: string;
          idempotency_key: string;
          audit_metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          xendit_payment_id?: string | null;
          xendit_disbursement_id?: string | null;
          event_type: string;
          amount_idr: number;
          fee_deducted_idr?: number;
          from_entity: string;
          to_entity: string;
          idempotency_key: string;
          audit_metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["escrow_ledger"]["Insert"]>;
      };
      conversations: {
        Row: {
          id: string;
          order_id: string | null;
          listing_id: string | null;
          participant_1: string;
          participant_2: string;
          last_message_text: string | null;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          listing_id?: string | null;
          participant_1: string;
          participant_2: string;
          last_message_text?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type: string;
          attachment_urls: string[];
          offer_data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type?: string;
          attachment_urls?: string[];
          offer_data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      disputes: {
        Row: {
          id: string;
          order_id: string;
          claimant_id: string;
          reason: string;
          description: string;
          evidence_image_urls: string[];
          status: DisputeStatus;
          refund_amount_proposed_idr: number | null;
          final_resolution_notes: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          claimant_id: string;
          reason: string;
          description: string;
          evidence_image_urls?: string[];
          status?: DisputeStatus;
          refund_amount_proposed_idr?: number | null;
          final_resolution_notes?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["disputes"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          reviewer_id: string;
          reviewed_user_id: string;
          role_reviewed: string;
          rating: number;
          tags: string[];
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          reviewer_id: string;
          reviewed_user_id: string;
          role_reviewed: string;
          rating: number;
          tags?: string[];
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      kyc_status: KycStatus;
      travel_destination: TravelDestination;
      trip_status: TripStatus;
      listing_type: ListingType;
      listing_status: ListingStatus;
      item_category: ItemCategory;
      order_status: OrderStatus;
      payment_channel: PaymentChannel;
      dispute_status: DisputeStatus;
    };
  };
}
