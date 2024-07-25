// import { supabase } from "@/utils/supabase/client";

// export interface User {
//   id: string;
//   profile_url: string;
//   user_nickname: string;
//   user_email: string;
// }

// export const fetchUserData = async (userId: string): Promise<User | null> => {
//   try {
//     const { data, error } = await supabase
//       .from("Users") // 제네릭 타입 제거
//       .select("*")
//       .eq("id", userId)
//       .single();

//     if (error) {
//       console.error("Error fetching user data:", error);
//       return null;
//     }

//     // 타입 단언을 통해 반환
//     return data as User | null;
//   } catch (error) {
//     console.error("Error in fetchUserData function:", error);
//     throw error;
//   }
// };

// 유저 정보 불러오기 중 이 부분은 쓸모 없어 보여서 나중에 제거 할 것 같아서 주석 처리 했습니다 필요 하신 분은 얘기해주세요
