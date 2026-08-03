export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_events: {
        Row: {
          action: string
          actor_id: string
          after_state: Json | null
          before_state: Json | null
          created_at: string
          csrf_token_hash: string | null
          id: string
          target_id: string | null
          target_table: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          csrf_token_hash?: string | null
          id?: string
          target_id?: string | null
          target_table: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          csrf_token_hash?: string | null
          id?: string
          target_id?: string | null
          target_table?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      game_memberships: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          price_mxn: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          price_mxn?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          price_mxn?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      merchant_categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          fee_mxn: number
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          fee_mxn: number
          id: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          fee_mxn?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      merchant_payments: {
        Row: {
          amount_mxn: number
          created_at: string
          currency: string
          id: string
          merchant_id: string
          owner_id: string
          provider: string
          provider_payment_id: string | null
          provider_session_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          webhook_payload: Json | null
        }
        Insert: {
          amount_mxn: number
          created_at?: string
          currency?: string
          id?: string
          merchant_id: string
          owner_id: string
          provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          webhook_payload?: Json | null
        }
        Update: {
          amount_mxn?: number
          created_at?: string
          currency?: string
          id?: string
          merchant_id?: string
          owner_id?: string
          provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          webhook_payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_payments_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_registrations: {
        Row: {
          address: string
          category_id: string
          created_at: string
          description: string
          id: string
          latitude: number
          longitude: number
          main_image: string | null
          name: string
          owner_id: string
          paid_at: string | null
          phone: string | null
          published_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["merchant_publication_status"]
          tags: string[]
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          category_id: string
          created_at?: string
          description: string
          id?: string
          latitude: number
          longitude: number
          main_image?: string | null
          name: string
          owner_id: string
          paid_at?: string | null
          phone?: string | null
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["merchant_publication_status"]
          tags?: string[]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          latitude?: number
          longitude?: number
          main_image?: string | null
          name?: string
          owner_id?: string
          paid_at?: string | null
          phone?: string | null
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["merchant_publication_status"]
          tags?: string[]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_registrations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "merchant_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_balances: {
        Row: {
          carbon: number
          created_at: string
          cuarzo: number
          energy: number
          energy_updated_at: string
          id: string
          oro: number
          plata: number
          puntos: number
          total_mined: number
          updated_at: string
          user_id: string
        }
        Insert: {
          carbon?: number
          created_at?: string
          cuarzo?: number
          energy?: number
          energy_updated_at?: string
          id?: string
          oro?: number
          plata?: number
          puntos?: number
          total_mined?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          carbon?: number
          created_at?: string
          cuarzo?: number
          energy?: number
          energy_updated_at?: string
          id?: string
          oro?: number
          plata?: number
          puntos?: number
          total_mined?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mining_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          mineral: string
          points: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          mineral: string
          points?: number
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          mineral?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          cost_points: number
          created_at: string
          id: string
          reward_id: string
          reward_name: string
          status: string
          user_id: string
        }
        Insert: {
          cost_points: number
          created_at?: string
          id?: string
          reward_id: string
          reward_name: string
          status?: string
          user_id: string
        }
        Update: {
          cost_points?: number
          created_at?: string
          id?: string
          reward_id?: string
          reward_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      rewards_catalog: {
        Row: {
          active: boolean
          category: string
          cost_points: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          cost_points: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          cost_points?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "merchant" | "visitor"
      merchant_publication_status:
        | "draft"
        | "awaiting_payment"
        | "paid"
        | "published"
        | "rejected"
      payment_status: "pending" | "succeeded" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "merchant", "visitor"],
      merchant_publication_status: [
        "draft",
        "awaiting_payment",
        "paid",
        "published",
        "rejected",
      ],
      payment_status: ["pending", "succeeded", "failed", "refunded"],
    },
  },
} as const
