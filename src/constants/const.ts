export const HASH_LEVEL = 12;

export const REFRIGERATOR = {
  STATUS: {
    OPERATION: "operation",
    WAIT_FOR_DELETION: "wait_for_deletion",
  },
};

export const REFRIGERATOR_USER = {
  AUTHORITY: {
    ADMIN: "admin",
    MANAGER: "manager",
    NORMAL: "normal",
    WAITING: "waiting",
  },
};

export const ITEM = {
  STATUS: {
    STORAGE: "storage",
    USED: "used",
    // EXPIRED: "expired", // P_TODO: expired는 그냥 itemInfo의 날짜로 계산하자.
    DISCARDED: "discarded",
  },
};
