import * as XLSX from "xlsx";

export const convertJsonToExcel = ({
  jsonData,
  fileName,
}: {
  jsonData: Record<string, Record<string, string>>;
  fileName: string;
}) => {
  // 모든 유니크한 유저명 추출
  const userNameSet = new Set<string>();
  Object.values(jsonData).forEach((dateData) => {
    Object.keys(dateData).forEach((username) => userNameSet.add(username));
  });
  const userList = Array.from(userNameSet).sort();

  // 날짜 배열 생성 (정렬)
  const dateList = Object.keys(jsonData).sort();

  // 엑셀 데이터 구조 생성
  const excelData = [];

  // 헤더 row 추가 (날짜들)
  // const headerRow = ["Users", ...dateList];
  // excelData.push(headerRow);

  // // 각 유저별 데이터 row 추가
  // userList.forEach((user) => {
  //   const row = [user];
  //   dateList.forEach((date) => {
  //     const commitTime = jsonData[date]?.[user] || "";
  //     row.push(commitTime);
  //   });

  //   excelData.push(row);
  // });

  const headerRow = ["", ...userList];
  excelData.push(headerRow);

  // 각 유저별 데이터 row 추가
  dateList.forEach((date) => {
    const row = [date];
    userList.forEach((user) => {
      const commitTime = jsonData?.[date]?.[user] || "";
      row.push(commitTime);
    });

    excelData.push(row);
  });

  // 워크북 생성
  const wb = XLSX.utils.book_new();

  // 워크시트 생성
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // 이 두개 옵션은 ㄴ나중에 보자...
  // 행 길이 설정
  ws["!cols"] = [
    { wch: 12 },
    ...Array(userList.length).fill({ wch: 15 }),
  ] as XLSX.ColInfo[];

  // // 행 높이 설정
  ws["!rows"] = [
    { hpt: 30 },
    ...Array(dateList.length).fill({ hpt: 25 }),
  ] as XLSX.RowInfo[];

  // 워크북에 시트 추가
  XLSX.utils.book_append_sheet(wb, ws, "Commit Times");

  // 파일 저장
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
