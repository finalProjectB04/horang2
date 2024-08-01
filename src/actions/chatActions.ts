"use server";

import { createServerSupabaseAdminClient, createServerSupabaseClient } from "@/utils/supabase/serverAdmin";

export async function getAllUsers() {
  // const supabase = await createServerSupabaseAdminClient();

  // const { data, error } = await supabase.auth.admin.listUsers();

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("Users").select("*");

  if (error) {
    return [];
  }

  // return data.users;
  return data;
}

export async function getUserById(userId) {
  // const supabase = await createServerSupabaseAdminClient();

  // const { data, error } = await supabase.auth.admin.getUserById(userId);

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("Users").select("*").eq("id", userId);

  if (error) {
    return [];
  }

  // return data.user;
  return data;
}

export async function sendMessage({ message, chatUserId }) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error("User is not authentcated");
  }

  const { data, error: sendMessageError } = await supabase.from("message").insert({
    message,
    receiver: chatUserId,
    sender: session.user.id,
  });

  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }
}

export async function getAllMessage({ chatUserId }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const { data, error: getMessageError } = await supabase
    .from("message")
    .select("*")
    .or(`receiver.eq.${chatUserId}, receiver.eq.${session.user.id}`)
    .or(`sender.eq.${chatUserId}, sender.eq.${session.user.id}`)
    .order("created_at", { ascending: true });

  if (getMessageError) {
    return [];
  }
  return data;
}
