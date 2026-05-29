import { supabase } from "../utils/supabase";

export async function createLiveRoom(payload) {
  const { data, error } = await supabase
    .from("live_quiz_rooms")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLiveRoom(roomCode) {
  const { data, error } = await supabase
    .from("live_quiz_rooms")
    .select("*")
    .eq("room_code", roomCode)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLiveRoom(roomCode, patch) {
  const { data, error } = await supabase
    .from("live_quiz_rooms")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("room_code", roomCode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinLiveRoom(payload) {
  const { data, error } = await supabase
    .from("live_quiz_players")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLivePlayers(roomCode) {
  const { data, error } = await supabase
    .from("live_quiz_players")
    .select("*")
    .eq("room_code", roomCode)
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getLivePlayer(roomCode, playerToken) {
  const { data, error } = await supabase
    .from("live_quiz_players")
    .select("*")
    .eq("room_code", roomCode)
    .eq("player_token", playerToken)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLivePlayer(playerId, patch) {
  const { data, error } = await supabase
    .from("live_quiz_players")
    .update({ ...patch, last_seen: new Date().toISOString() })
    .eq("id", playerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeLiveRoom(roomCode, handlers) {
  const channel = supabase
    .channel(`live-room-${roomCode}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_quiz_rooms",
        filter: `room_code=eq.${roomCode}`,
      },
      handlers.onRoomChange,
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_quiz_players",
        filter: `room_code=eq.${roomCode}`,
      },
      handlers.onPlayersChange,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
