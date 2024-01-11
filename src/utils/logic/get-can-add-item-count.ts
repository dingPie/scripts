import ItemInfo from "../../models/item-info";
import RefrigeratorSpace from "../../models/refrigerator-space";

export const getCanAddItemCount = (
  myItemInfo: { storageQuantity: number }[],
  itemInfoBySpace: { storageQuantity: number }[],
  refrigeratorSpaceInfo: RefrigeratorSpace
) => {
  const storageItemCountAll = myItemInfo.reduce(
    (acc, cur) => acc + cur.storageQuantity,
    0
  );

  const storageItemCountBySpace = itemInfoBySpace.reduce(
    (acc, cur) => acc + cur.storageQuantity,
    0
  );

  console.log("#### 보관중인 총 아이템 갯수", storageItemCountAll);
  console.log("#### 이 칸에 보관중인 아이템 갯수", storageItemCountBySpace);

  // console.log(
  //   "DDDD 이게없나?",
  //   refrigeratorSpaceInfo,
  //   refrigeratorSpaceInfo.refrigerator
  // );

  const canAddItemCountAll =
    (refrigeratorSpaceInfo.refrigerator?.maxCountStoragePerUser || 0) -
    storageItemCountAll;

  const canAddItemCountBySpace =
    (refrigeratorSpaceInfo.maxCountPerSpace || 0) - storageItemCountBySpace;

  return {
    canAddItemCountAll: canAddItemCountAll < 0 ? 0 : canAddItemCountAll,
    canAddItemCountBySpace:
      canAddItemCountBySpace < 0 ? 0 : canAddItemCountBySpace,
  };
};
