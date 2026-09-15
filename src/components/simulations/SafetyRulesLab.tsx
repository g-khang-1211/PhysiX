import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Zap, Flame, Eye, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface SafetySymbol {
  id: string;
  name: string;
  type: 'danger' | 'prohibit' | 'mandatory' | 'safe';
  shape: string;
  meaning: string;
  example: string;
}

const symbols: SafetySymbol[] = [
  {
    id: 'laser',
    name: 'Cảnh báo tia Laser',
    type: 'danger',
    shape: 'Tam giác vàng, viền đen',
    meaning: 'Bức xạ laser có mật độ năng lượng cao gây bỏng võng mạc mắt vĩnh viễn.',
    example: 'Thí nghiệm giao thoa ánh sáng, nguồn phát laser quang học.',
  },
  {
    id: 'high_voltage',
    name: 'Nguy hiểm điện áp cao',
    type: 'danger',
    shape: 'Tam giác vàng, viền đen',
    meaning: 'Điện áp lớn có nguy cơ gây điện giật chết người và phóng điện hồ quang.',
    example: 'Biến áp nguồn lưới 220V, máy phát tĩnh điện Van de Graaff.',
  },
  {
    id: 'hot_surface',
    name: 'Cảnh báo nhiệt độ cao',
    type: 'danger',
    shape: 'Tam giác vàng, viền đen',
    meaning: 'Bề mặt thiết bị đang nóng có thể gây bỏng nhiệt nghiêm trọng khi chạm vào.',
    example: 'Đèn dây tóc, bình đun nhiệt lượng kế, biến trở công suất lớn.',
  },
  {
    id: 'no_water',
    name: 'Cấm dùng nước dập lửa',
    type: 'prohibit',
    shape: 'Hình tròn trắng, viền đỏ, gạch chéo',
    meaning: 'Nước dẫn điện gây nguy cơ giật lan truyền và bùng nổ khi gặp kim loại kiềm.',
    example: 'Đám cháy do chập điện trong phòng thí nghiệm.',
  },
  {
    id: 'goggles',
    name: 'Bắt buộc đeo kính bảo hộ',
    type: 'mandatory',
    shape: 'Hình tròn nền xanh lam',
    meaning: 'Bảo vệ mắt khỏi các mảnh vỡ thủy tinh văng bắn hoặc tia sáng mạnh.',
    example: 'Thực hành cơ học với lò xo căng, thí nghiệm nén bình áp suất.',
  },
  {
    id: 'first_aid',
    name: 'Tủ cứu thương y tế',
    type: 'safe',
    shape: 'Hình chữ nhật nền xanh lá cây',
    meaning: 'Vị trí đặt bông băng, thuốc sơ cứu khẩn cấp khi có tai nạn.',
    example: 'Sơ cấp cứu vết bỏng nhẹ hoặc trầy xước trong giờ thực hành.',
  },
];

interface Scenario {
  id: number;
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    question: 'Khi đang tiến hành thí nghiệm điện, bạn nhìn thấy bạn cùng nhóm bị điện giật dính tay vào dây dẫn hở. Hành động ĐẦU TIÊN và QUAN TRỌNG NHẤT bạn phải làm là gì?',
    options: [
      {
        text: 'Lao vào dùng tay kéo bạn ra khỏi dây điện ngay lập tức.',
        correct: false,
        feedback: 'SAI! Tay người dẫn điện, bạn sẽ bị điện truyền qua và bị giật theo!',
      },
      {
        text: 'Lập tức ngắt cầu dao điện chính (aptomat) hoặc giật phích cắm nguồn ra.',
        correct: true,
        feedback: 'CHÍNH XÁC! Ngắt nguồn điện chính là nguyên tắc sống còn số 1 để giải cứu nạn nhân an toàn.',
      },
      {
        text: 'Hô hoán và chạy ra khỏi phòng tìm người lớn mà không làm gì.',
        correct: false,
        feedback: 'Chậm trễ trong vài giây có thể khiến tim nạn nhân ngừng đập do dòng điện chạy qua.',
      },
    ],
  },
  {
    id: 2,
    question: 'Bạn cần đo cường độ dòng điện khoảng 120 mA chạy qua một bóng đèn nhỏ. Đồng hồ đa năng hiện số có các thang đo dòng DC: 20 mA, 200 mA, 10 A. Bạn nên chọn thang đo nào?',
    options: [
      {
        text: 'Thang đo 20 mA để có độ nhạy lớn nhất.',
        correct: false,
        feedback: 'SAI! Dòng 120 mA lớn hơn 20 mA sẽ làm đứt cầu chì hoặc cháy đồng hồ đo!',
      },
      {
        text: 'Thang đo 200 mA vì lớn hơn 120 mA và gần giá trị đo nhất.',
        correct: true,
        feedback: 'CHÍNH XÁC! Quy tắc: Chọn thang đo lớn hơn giá trị ước lượng nhưng gần nhất để kết quả vừa an toàn vừa có độ chính xác cao nhất.',
      },
      {
        text: 'Thang đo 10 A cho an toàn tuyệt đối.',
        correct: false,
        feedback: 'Thang 10 A quá lớn, giá trị đọc sẽ bị sai số hiển thị rất lớn (0.12 A).',
      },
    ],
  },
  {
    id: 3,
    question: 'Nếu xảy ra sự cố cháy do chập bảng điện trong phòng thí nghiệm, loại phương tiện chữa cháy nào TUYỆT ĐỐI KHÔNG được sử dụng?',
    options: [
      {
        text: 'Bình khí chữa cháy CO2.',
        correct: false,
        feedback: 'Bình CO2 dập cháy điện rất tốt vì khí CO2 không dẫn điện.',
      },
      {
        text: 'Bình bột chữa cháy ABC chuyên dụng.',
        correct: false,
        feedback: 'Bột ABC dập tắt đám cháy điện an toàn.',
      },
      {
        text: 'Xô nước sinh hoạt tạt trực tiếp vào ngọn lửa.',
        correct: true,
        feedback: 'ĐÚNG! Nước là chất dẫn điện cực tốt, tạt nước vào đám cháy điện sẽ gây phóng điện nổ và điện giật người dập lửa!',
      },
    ],
  },
];

export const SafetyRulesLab: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<SafetySymbol>(symbols[0]);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [userSelection, setUserSelection] = useState<number | null>(null);

  const curScenario = scenarios[activeScenarioIdx];

  return (
    <div id="safety-lab-container" className="space-y-6">
      {/* Scientific Research Method Flow */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          Chu trình nghiên cứu Vật lí theo Phương pháp Thực nghiệm
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-[10px] text-indigo-400 font-bold">BƯỚC 1</span>
            <div className="font-semibold text-slate-200 mt-1">Xác định vấn đề</div>
            <p className="text-[11px] text-slate-400 mt-1">Quan sát hiện tượng tự nhiên và đặt ra câu hỏi nghiên cứu.</p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-[10px] text-sky-400 font-bold">BƯỚC 2</span>
            <div className="font-semibold text-slate-200 mt-1">Đề xuất Giả thuyết</div>
            <p className="text-[11px] text-slate-400 mt-1">Dựa trên suy luận logic và kiến thức có sẵn đưa ra dự đoán.</p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-400 font-bold">BƯỚC 3</span>
            <div className="font-semibold text-slate-200 mt-1">Thí nghiệm kiểm chứng</div>
            <p className="text-[11px] text-slate-400 mt-1">Thiết kế phương án và bố trí dụng cụ đo đạc thu thập số liệu.</p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-[10px] text-amber-400 font-bold">BƯỚC 4</span>
            <div className="font-semibold text-slate-200 mt-1">Phân tích & Kết luận</div>
            <p className="text-[11px] text-slate-400 mt-1">Xử lý sai số, rút ra quy luật định lượng hoặc hoàn thiện giả thuyết.</p>
          </div>
        </div>
      </div>

      {/* Interactive Safety Symbols Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Symbol Selector Grid (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Biển cảnh báo tiêu chuẩn trong phòng thực hành (Bấm để xem chi tiết)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {symbols.map((sym) => (
              <button
                key={sym.id}
                onClick={() => setSelectedSymbol(sym)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                  selectedSymbol.id === sym.id
                    ? 'bg-indigo-950/70 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">{sym.name}</span>
                  {sym.type === 'danger' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  {sym.type === 'prohibit' && <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                  {sym.type === 'mandatory' && <Eye className="w-4 h-4 text-sky-400 flex-shrink-0" />}
                  {sym.type === 'safe' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-400">{sym.shape}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Symbol Detail Inspector (5 cols) */}
        <div className="md:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Chi tiết quy tắc an toàn
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{selectedSymbol.name}</h3>
            <div className="text-xs text-slate-400 mt-0.5">Dạng biển: <strong className="text-slate-300">{selectedSymbol.shape}</strong></div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1 text-xs">
            <div className="font-semibold text-amber-300">Nguy cơ / Ý nghĩa:</div>
            <p className="text-slate-300 leading-relaxed">{selectedSymbol.meaning}</p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1 text-xs">
            <div className="font-semibold text-sky-300">Tình huống thực tế:</div>
            <p className="text-slate-300 leading-relaxed">{selectedSymbol.example}</p>
          </div>
        </div>
      </div>

      {/* Safety Scenario Interactive Trainer */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Tình huống xử lí sự cố thực hành (Tình huống {activeScenarioIdx + 1}/{scenarios.length})
          </h4>
          <div className="flex items-center gap-1">
            {scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveScenarioIdx(idx);
                  setUserSelection(null);
                }}
                className={`w-6 h-6 rounded text-xs font-mono font-bold transition-colors ${
                  activeScenarioIdx === idx ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm font-medium text-slate-200 leading-relaxed">
          {curScenario.question}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {curScenario.options.map((opt, idx) => {
            const isSelected = userSelection === idx;
            return (
              <button
                key={idx}
                onClick={() => setUserSelection(idx)}
                className={`w-full p-3 text-left rounded-xl border text-xs transition-all ${
                  isSelected
                    ? opt.correct
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-500 text-rose-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.text}</span>
                  {isSelected && (
                    opt.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )
                  )}
                </div>
                {isSelected && (
                  <div className={`mt-2 pt-2 border-t text-[11px] font-medium ${opt.correct ? 'border-emerald-800 text-emerald-300' : 'border-rose-800 text-rose-300'}`}>
                    {opt.feedback}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
