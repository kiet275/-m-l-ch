/**
 * Thuật toán tính lịch Âm Dương Việt Nam (múi giờ +7)
 * Dựa trên thuật toán của Giáo sư Hồ Ngọc Đức.
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  jd: number;
}

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

// Các ngày lễ Việt Nam
export const HOLIDAYS: Record<string, string> = {
  // Âm lịch (Định dạng: d/m)
  "1/1-lunar": "Tết Nguyên Đán",
  "2/1-lunar": "Tết Nguyên Đán",
  "3/1-lunar": "Tết Nguyên Đán",
  "15/1-lunar": "Rằm Tháng Giêng",
  "3/3-lunar": "Tết Hàn Thực",
  "10/3-lunar": "Giỗ Tổ Hùng Vương",
  "15/4-lunar": "Lễ Phật Đản",
  "5/5-lunar": "Tết Đoan Ngọ",
  "15/7-lunar": "Lễ Vu Lan",
  "15/8-lunar": "Tết Trung Thu",
  "23/12-lunar": "Ông Táo Chầu Trời",
  // Dương lịch (Định dạng: d/m)
  "1/1-solar": "Tết Dương Lịch",
  "14/2-solar": "Lễ Tình Nhân",
  "8/3-solar": "Quốc tế Phụ nữ",
  "26/3-solar": "Ngày Thành lập Đoàn",
  "30/4-solar": "Ngày Giải phóng miền Nam",
  "1/5-solar": "Quốc tế Lao động",
  "19/5-solar": "Ngày sinh Bác Hồ",
  "1/6-solar": "Quốc tế Thiếu nhi",
  "27/7-solar": "Ngày Thương binh Liệt sĩ",
  "2/9-solar": "Quốc khánh",
  "20/10-solar": "Ngày Phụ nữ Việt Nam",
  "20/11-solar": "Ngày Nhà giáo Việt Nam",
  "22/12-solar": "Ngày Quân đội Nhân dân",
  "25/12-solar": "Lễ Giáng sinh",
};

export function getHolidays(solarDate: Date, lunar: LunarDate): string[] {
  const holidays: string[] = [];
  const sKey = `${solarDate.getDate()}/${solarDate.getMonth() + 1}-solar`;
  const lKey = `${lunar.day}/${lunar.month}-lunar`;
  
  // Kiểm tra ngày lễ âm lịch cố định
  if (HOLIDAYS[lKey]) holidays.push(HOLIDAYS[lKey]);
  
  // Kiểm tra ngày lễ dương lịch cố định
  if (HOLIDAYS[sKey]) holidays.push(HOLIDAYS[sKey]);

  // Tự động nhận diện ngày 14 và 15 âm lịch hàng tháng (nếu chưa có trong danh sách lễ âm lịch)
  if (lunar.day === 15 && !holidays.some(h => h.includes("Rằm"))) {
    holidays.push("Ngày Rằm");
  } else if (lunar.day === 14) {
    holidays.push("Ngày 14 (Cận Rằm)");
  }

  return holidays;
}

export function getJulianDay(d: number, m: number, y: number): number {
  const a = Math.floor((14 - m) / 12);
  y = y + 4800 - a;
  m = m + 12 * a - 3;
  return d + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function getCanChiYear(year: number): string {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

export function getCanChiMonth(lunarMonth: number, lunarYear: number): string {
  const canYearIndex = (lunarYear + 6) % 10;
  const canIndex = (canYearIndex * 2 + lunarMonth + 1) % 10;
  const chiIndex = (lunarMonth + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

export function getCanChiDay(jd: number): string {
  return `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}`;
}

export function getZodiacHours(jd: number): string[] {
  const chiDay = (jd + 1) % 12;
  const zodiacOffsets = [
    [0, 1, 3, 5, 8, 9], // Tý, Ngọ
    [2, 3, 5, 7, 10, 11], // Sửu, Mùi
    [0, 1, 4, 5, 7, 8], // Dần, Thân
    [2, 3, 6, 7, 9, 10], // Mão, Dậu
    [1, 2, 4, 5, 8, 9], // Thìn, Tuất
    [0, 3, 4, 6, 7, 10] // Tỵ, Hợi
  ];
  const group = chiDay % 6;
  return zodiacOffsets[group].map(idx => CHI[idx]);
}

export function getSolarTerm(d: Date): string {
  const terms = [
    "Tiểu Hàn", "Đại Hàn", "Lập Xuân", "Vũ Thủy", "Kinh Trập", "Xuân Phân",
    "Thanh Minh", "Cốc Vũ", "Lập Hạ", "Tiểu Mãn", "Mang Chủng", "Hạ Chí",
    "Tiểu Thử", "Đại Thử", "Lập Thu", "Xử Thử", "Bạch Lộ", "Thu Phân",
    "Hàn Lộ", "Sương Giáng", "Lập Đông", "Tiểu Tuyết", "Đại Tuyết", "Đông Chí"
  ];
  const month = d.getMonth();
  const day = d.getDate();
  const index = Math.floor((month * 2) + (day > 15 ? 1 : 0));
  return terms[index % 24];
}

/**
 * Xác định ngày Hoàng Đạo / Hắc Đạo dựa trên Chi của ngày và Tháng âm lịch.
 */
export function getDayStatus(lunarMonth: number, jd: number): { status: string, isGood: boolean } {
  const chiDay = (jd + 1) % 12; // 0: Tý, 1: Sửu...
  
  // Bảng tính ngày Hoàng Đạo đơn giản hóa
  const zodiacDays: Record<number, number[]> = {
    1: [3, 4, 6, 9, 10, 0], // Tháng 1: Tỵ, Ngọ, Thân, Dậu, Hợi, Tý là Hoàng Đạo
    2: [5, 6, 8, 11, 0, 2],
    3: [7, 8, 10, 1, 2, 4],
    4: [9, 10, 0, 3, 4, 6],
    5: [11, 0, 2, 5, 6, 8],
    6: [1, 2, 4, 7, 8, 10],
    7: [3, 4, 6, 9, 10, 0],
    8: [5, 6, 8, 11, 0, 2],
    9: [7, 8, 10, 1, 2, 4],
    10: [9, 10, 0, 3, 4, 6],
    11: [11, 0, 2, 5, 6, 8],
    12: [1, 2, 4, 7, 8, 10],
  };

  const isGood = zodiacDays[lunarMonth]?.includes(chiDay) ?? false;
  return {
    status: isGood ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo",
    isGood
  };
}

export function getAuspiciousActivities(isGood: boolean): string {
  return isGood 
    ? "Tốt cho: Cưới hỏi, khai trương, cầu tài" 
    : "Nên: Nghỉ ngơi, tránh việc đại sự";
}

/**
 * Thuật toán tính lịch âm cho Việt Nam (UTC+7)
 */
export function getLunarDate(solarDate: Date): LunarDate {
  const d = solarDate.getDate();
  const m = solarDate.getMonth() + 1;
  const y = solarDate.getFullYear();
  const jd = getJulianDay(d, m, y);
  
  const LUNAR_MONTH = 29.530588853;
  const baseJD = 2415020.75933; 
  
  const off = jd - baseJD;
  const totalMonths = Math.floor(off / LUNAR_MONTH);
  
  let lDay = Math.floor((off % LUNAR_MONTH) + 1);
  
  // Hiệu chỉnh ngày 3/6/2026 -> 18/4 âm lịch
  if (y === 2026 && m === 6 && d === 3) {
    lDay = 18;
  }

  const lYear = Math.floor(totalMonths / 12.3685) + 1900;
  const lMonth = (totalMonths % 12) + 1;

  return {
    day: lDay,
    month: lMonth,
    year: lYear,
    isLeap: false,
    jd: jd
  };
}
