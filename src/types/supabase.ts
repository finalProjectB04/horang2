export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Comments: {
        Row: {
          avartar_url: string | null
          comment: string | null
          comment_id: string
          content_id: string | null
          content_type_id: string | null
          created_at: string | null
          user_email: string | null
          user_id: string | null
          user_nickname: string | null
          user_profile_url: string | null
        }
        Insert: {
          avartar_url?: string | null
          comment?: string | null
          comment_id?: string
          content_id?: string | null
          content_type_id?: string | null
          created_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_nickname?: string | null
          user_profile_url?: string | null
        }
        Update: {
          avartar_url?: string | null
          comment?: string | null
          comment_id?: string
          content_id?: string | null
          content_type_id?: string | null
          created_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_nickname?: string | null
          user_profile_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Likes: {
        Row: {
          address: string | null
          content_id: string | null
          content_type_id: string | null
          created_at: string
          image_url: string | null
          like_id: string
          tel: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          content_id?: string | null
          content_type_id?: string | null
          created_at?: string
          image_url?: string | null
          like_id?: string
          tel?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          content_id?: string | null
          content_type_id?: string | null
          created_at?: string
          image_url?: string | null
          like_id?: string
          tel?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      message: {
        Row: {
          created_at: string
          id: number
          is_deleteted: boolean
          message: string
          receiver: string
          sender: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleteted?: boolean
          message: string
          receiver: string
          sender: string
        }
        Update: {
          created_at?: string
          id?: number
          is_deleteted?: boolean
          message?: string
          receiver?: string
          sender?: string
        }
        Relationships: []
      }
      Post: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          files: string | null
          id: string
          likes: number | null
          title: string | null
          user_id: string
          user_nickname: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          files?: string | null
          id?: string
          likes?: number | null
          title?: string | null
          user_id?: string
          user_nickname?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          files?: string | null
          id?: string
          likes?: number | null
          title?: string | null
          user_id?: string
          user_nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Post_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Post_commentreplies: {
        Row: {
          content: string | null
          created_at: string
          id: string
          parent_comment_id: string
          post_id: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          parent_comment_id?: string
          post_id?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          parent_comment_id?: string
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Post_commentreplies_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "Post_comments"
            referencedColumns: ["post_comment_id"]
          },
          {
            foreignKeyName: "Post_commentreplies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Post_commentreplies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Post_comments: {
        Row: {
          comments: string | null
          created_at: string
          post_comment_id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          post_comment_id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          post_comment_id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Post_likes: {
        Row: {
          id: number
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          created_at: string
          id: string
          profile_url: string | null
          provider: string | null
          provider_id: string | null
          user_address: string | null
          user_email: string | null
          user_nickname: string | null
        }
        Insert: {
          created_at?: string
          id: string
          profile_url?: string | null
          provider?: string | null
          provider_id?: string | null
          user_address?: string | null
          user_email?: string | null
          user_nickname?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_url?: string | null
          provider?: string | null
          provider_id?: string | null
          user_address?: string | null
          user_email?: string | null
          user_nickname?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
