export const WsRooms = {
  class: (id: string) => `class:${id}`,
  aiChat: (userId: string) => `ai:chat:${userId}`,
  aiTranslate: (userId: string) => `ai:translate:${userId}`,
};
