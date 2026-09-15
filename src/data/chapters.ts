import { Chapter, Lesson, LessonTheory, LessonVirtualLab, LessonPractice } from '../types';
import { quizzesData } from './quizzes';

const rawChaptersData: Chapter[] = [
  {
    id: 'chuong-1',
    number: 1,
    romanNumeral: 'I',
    title: 'Mở đầu',
    description: 'Làm quen với Vật lí, các quy tắc an toàn trong phòng thực hành và phương pháp xử lí sai số thực nghiệm.',
    lessons: [
      {
        id: 'bai-1',
        chapterId: 'chuong-1',
        number: 1,
        title: 'Bài 1: Làm quen với Vật lí',
        shortDesc: 'Đối tượng nghiên cứu & mục tiêu, các lĩnh vực chính, quá trình phát triển và hai phương pháp nghiên cứu cốt lõi: thực nghiệm và mô hình.',
        labType: 'galileo_pisa',
        labTitle: 'Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi tự do và Phương pháp thực nghiệm của Galilei',
        labDescription: 'Bác bỏ quan điểm chủ quan của Aristotle ("vật nặng rơi nhanh hơn vật nhẹ") và chứng minh sự rơi không phụ thuộc vào khối lượng khi bỏ qua lực cản.',
        virtualLabSpec: {
          experimentName: 'Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi tự do và Phương pháp thực nghiệm của Galilei',
          purpose: 'Bác bỏ quan điểm chủ quan của Aristotle ("vật nặng rơi nhanh hơn vật nhẹ") và chứng minh sự rơi không phụ thuộc vào khối lượng khi bỏ qua lực cản.',
          equipmentAndSteps: [
            '1. Chọn hai quả cầu kim loại có khối lượng chênh lệch ($m_1 = 10\\text{ kg}$, $m_2 = 1\\text{ kg}$).',
            '2. Đặt ở cùng độ cao $h$ trên đỉnh tháp.',
            '3. Bật/Tắt chế độ "Lực cản không khí" (Air Resistance) và thả rơi đồng thời.',
          ],
          physicsNatureAndLogic: 'Khi không có lực cản không khí, gia tốc rơi của mọi vật là $g$. Thời gian rơi được xác định qua công thức $t = \\sqrt{\\frac{2h}{g}}$, không phụ thuộc vào khối lượng $m$.',
          expectedResults: {
            positive: 'Kết quả Tích cực (Bật chân không): Hai quả cầu rơi với cùng vận tốc và chạm đất chính xác cùng một lúc, khẳng định giả thuyết của Galilei.',
            negative: 'Kết quả Tiêu cực (Bật lực cản không khí mạnh / Thả vật nhẹ như tờ giấy): Lực cản $F_c$ làm vật nhẹ rơi chậm hơn, minh họa yếu tố nhiễu môi trường nếu không cô lập điều kiện thí nghiệm.',
          },
        },
        sections: [
          {
            title: '1. Đối tượng nghiên cứu & Mục tiêu',
            content: `Vật lí nghiên cứu các dạng vận động của **vật chất** (chất, trường) và **năng lượng**.

Học Vật lí giúp phát triển năng lực khoa học, rèn luyện kĩ năng khám phá thế giới tự nhiên và vận dụng tri thức vào đời sống thực tiễn.`,
            keyTakeaway: 'Đối tượng nghiên cứu: Các dạng vận động của vật chất và năng lượng.',
          },
          {
            title: '2. Các lĩnh vực chính của Vật lí',
            content: `Các lĩnh vực nghiên cứu chính bao gồm:
* **Cơ học**: Chuyển động của vật thể và tương tác lực.
* **Điện học & Điện từ học**: Điện tích, dòng điện, từ trường và sóng điện từ.
* **Quang học**: Bản chất, sự truyền và tương tác của ánh sáng.
* **Âm học**: Sự lan truyền và đặc tính của sóng âm.
* **Nhiệt học**: Nhiệt độ, nhiệt lượng và các định luật nhiệt động lực học.
* **Vật lí hạt nhân & Vật lí lượng tử**: Cấu trúc vi mô của nguyên tử, hạt cơ bản và các hiện tượng lượng tử.
* **Thuyết tương đối**: Không gian, thời gian và trường hấp dẫn ở quy mô vũ trụ.`,
            keyTakeaway: 'Các phân ngành: Cơ học, Nhiệt học, Điện - Từ học, Quang học, Âm học, Lượng tử, Hạt nhân và Thuyết tương đối.',
          },
          {
            title: '3. Quá trình phát triển của Vật lí học',
            content: `Lịch sử phát triển của Vật lí học được chia thành 3 giai đoạn chính:

* **Tiền Vật lí (350 TCN – XVI)**: Dựa trên quan sát và suy luận chủ quan, tiêu biểu là triết gia Aristotle (A-rít-xtốt).
* **Vật lí cổ điển (XVII – XIX)**: Sử dụng phương pháp thực nghiệm khoa học, tiêu biểu là Galilei (Ga-li-lê), Newton (Niu-tơn), Joule, Faraday, Maxwell.
* **Vật lí hiện đại (cuối XIX – nay)**: Tập trung vào mô hình lý thuyết vi mô và kiểm chứng thí nghiệm chính xác cao, tiêu biểu là Max Planck, Albert Einstein, Bohr.`,
            keyTakeaway: 'Ba giai đoạn: Tiền Vật lí (quan sát chủ quan) → Vật lí cổ điển (thực nghiệm) → Vật lí hiện đại (mô hình lượng tử và tương đối).',
          },
          {
            title: '4. Phương pháp nghiên cứu Vật lí',
            content: `Để khám phá các quy luật tự nhiên, Vật lí sử dụng hai phương pháp cốt lõi:

### a) Phương pháp thực nghiệm
Xác định vấn đề $\\rightarrow$ Quan sát, thu thập thông tin $\\rightarrow$ Đưa ra dự đoán (giả thuyết) $\\rightarrow$ Thí nghiệm kiểm tra $\\rightarrow$ Rút ra kết luận.

### b) Phương pháp mô hình
* **Mô hình vật chất**: Quả địa cầu, mô hình phân tử, chất điểm.
* **Mô hình lý thuyết**: Tia sáng trong quang hình học, đường sức điện, khí lí tưởng.
* **Mô hình toán học**: Vectơ, phương trình chuyển động $s = v \\cdot t$, đồ thị quan hệ giữa các đại lượng.`,
            keyTakeaway: 'Hai phương pháp chính: Phương pháp thực nghiệm (thực tế kiểm chứng) và Phương pháp mô hình (trừu tượng hóa đơn giản hóa).',
          },
        ],
      },
      {
        id: 'bai-2',
        chapterId: 'chuong-1',
        number: 2,
        title: 'Bài 2: Các quy tắc an toàn trong phòng thực hành Vật lí',
        shortDesc: 'Kí hiệu an toàn, nhãn thông số kĩ thuật, các nguy cơ mất an toàn phổ biến và quy tắc PCCC trong phòng thí nghiệm.',
        labType: 'electric_safety',
        labTitle: 'Vận hành Nguồn điện & Thiết lập thang đo Ampe kế an toàn',
        labDescription: 'Thực hành quy trình kết nối nguồn điện AC/DC, chọn thang đo thích hợp và tránh nguy cơ cháy nổ/hỏng thiết bị.',
        virtualLabSpec: {
          experimentName: 'Vận hành Nguồn điện & Thiết lập thang đo Ampe kế an toàn',
          purpose: 'Thực hành quy trình kết nối nguồn điện $AC/DC$, chọn thang đo thích hợp và tránh nguy cơ cháy nổ/hỏng thiết bị.',
          equipmentAndSteps: [
            '1. Chọn bộ chuyển đổi điện áp $AC/DC$ và chọn điện áp đầu ra thích hợp.',
            '2. Mắc Ampe kế nối tiếp với mạch điện có điện trở $R$.',
            '3. Chọn các thang đo Ampe kế khác nhau ($0.6\\text{ A}$ hoặc $3\\text{ A}$).',
          ],
          physicsNatureAndLogic: 'Theo định luật Ohm, dòng điện $I = \\frac{U}{R}$. Nếu chọn thang đo nhỏ hơn giá trị $I$ thực tế, dòng vượt ngưỡng sẽ làm hỏng cuộn dây Ampe kế.',
          expectedResults: {
            positive: 'Kết quả Tích cực: Chọn thang đo $3\\text{ A}$ cho dòng $1.5\\text{ A}$, kim chỉ chính xác vị trí, mạch hoạt động an toàn.',
            negative: 'Kết quả Tiêu cực (Thao tác sai): Chọn thang $0.6\\text{ A}$ nhưng cho dòng $2\\text{ A}$ chạy qua $\\rightarrow$ Hệ thống báo cháy hỏng Ampe kế; hoặc mắc Ampe kế song song (nhầm với Voltkế) gây ngắt mạch/chập điện.',
          },
        },
        sections: [
          {
            title: '1. Kí hiệu an toàn & Nhãn thông số',
            content: `Khi thực hành trong phòng thí nghiệm, học sinh cần nắm vững các kí hiệu và nhãn thông số:

* **Nguồn điện**:
  * $DC$ hoặc dấu ($-$) : Dòng điện một chiều.
  * $AC$ hoặc dấu ($\\sim$) : Dòng điện xoay chiều.
  * Cực dương ($+$ / màu đỏ), Cực âm ($-$ / màu xanh hoặc đen).
* **Biển cảnh báo nguy hiểm**:
  * Cảnh báo nhiệt độ cao, nguồn laser quang học.
  * Từ trường mạnh, bình khí nén áp suất cao.
  * Nguy hiểm điện áp cao, chất độc hại và chất phóng xạ.`,
            keyTakeaway: 'Phải phân biệt nguồn AC / DC, cực dương / cực âm và nhận diện đầy đủ các biển báo nguy hiểm.',
          },
          {
            title: '2. Nguy cơ mất an toàn trong phòng thực hành',
            content: `Các nguy cơ thường gặp nếu vi phạm quy tắc:
* **Sốc điện (điện giật)**: Tiếp xúc trực tiếp với dây dẫn hở hoặc điện áp nguồn vượt ngưỡng an toàn.
* **Hỏng Ampe kế**: Do đo dòng vượt quá giới hạn thang đo ($I > I_{\\max}$) làm cháy đứt cuộn dây đo.
* **Đoản mạch (chập mạch)**: Mắc nhầm Ampe kế song song với nguồn điện thay vì mắc nối tiếp.
* **Cháy nổ**: Đặt hóa chất dễ cháy gần nguồn nhiệt hoặc chập cháy tia lửa điện.`,
            keyTakeaway: 'Luôn kiểm tra mạch điện trước khi đóng cầu dao; chọn thang đo Ampe kế từ lớn đến nhỏ.',
          },
          {
            title: '3. Quy tắc an toàn PCCC',
            content: `Quy trình ứng phó khẩn cấp khi có sự cố:
* **Ngắt toàn bộ hệ thống điện ngay lập tức** khi phát hiện khói, tia lửa điện hoặc người bị giật.
* **Không dùng nước dập đám cháy thiết bị điện hoặc dầu cồn** vì nước dẫn điện gây giật lan truyền và dầu nổi trên nước làm đám cháy lan rộng.
* **Không dùng $\\text{CO}_2$ dập đám cháy kim loại kiềm** (như $\\text{Na}, \\text{K}$) hoặc đám cháy trên người (khí $\\text{CO}_2$ lạnh hóa lỏng gây bỏng lạnh mô thịt).`,
            keyTakeaway: 'Cắt cầu dao trước tiên! Dùng bình CO2 hoặc bình bột cho đám cháy điện, tuyệt đối không dùng nước.',
          },
        ],
      },
      {
        id: 'bai-3',
        chapterId: 'chuong-1',
        number: 3,
        title: 'Bài 3: Thực hành tính sai số trong phép đo. Ghi kết quả đo',
        shortDesc: 'Phép đo trực tiếp & gián tiếp, sai số dụng cụ, sai số ngẫu nhiên, các công thức tính sai số và quy tắc ghi kết quả đo.',
        labType: 'photogate_error',
        labTitle: 'Đo tốc độ $v$ của viên bi thép lăn trên máng nghiêng bằng Cổng quang điện & Đồng hồ đo thời gian hiện số MC964',
        labDescription: 'Xác định sai số trực tiếp của quãng đường s, thời gian t và tính sai số gián tiếp của tốc độ v = s/t.',
        virtualLabSpec: {
          experimentName: 'Đo tốc độ $v$ của viên bi thép lăn trên máng nghiêng bằng Cổng quang điện & Đồng hồ đo thời gian hiện số MC964',
          purpose: 'Xác định sai số trực tiếp của quãng đường $s$, thời gian $t$ và tính sai số gián tiếp của tốc độ $v = \\frac{s}{t}$.',
          equipmentAndSteps: [
            '1. Điều chỉnh cổng quang điện $E$ và $F$ trên máng nghiêng, đo khoảng cách $s$ bằng thước.',
            '2. Đặt đồng hồ MC964 ở chế độ $MODE A \\leftrightarrow B$.',
            '3. Thả viên bi từ nam châm điện $N$, ghi lại thời gian $t$ hiển thị (lặp lại 5 lần).',
          ],
          physicsNatureAndLogic: 'Tốc độ trung bình: $\\overline{v} = \\frac{\\overline{s}}{\\overline{t}}$. Phép tính sai số tỉ đối gián tiếp: $\\delta v = \\delta s + \\delta t = \\frac{\\Delta s}{\\overline{s}} \\cdot 100\\% + \\frac{\\Delta t}{\\overline{t}} \\cdot 100\\%$. Sai số tuyệt đối: $\\Delta v = \\delta v \\cdot \\overline{v}$.',
          expectedResults: {
            positive: 'Kết quả Tích cực: Bảng dữ liệu tự động tính toán $t_1, t_2, \\dots, t_5$, xuất ra kết quả dạng $v = \\overline{v} \\pm \\Delta v$, vẽ đồ thị có các ô bao sai số dạng hình chữ nhật $2\\Delta x \\times 2\\Delta y$ xung quanh điểm thực nghiệm.',
            negative: 'Kết quả Tiêu cực: Thả bi ở các vị trí ban đầu không đồng nhất làm tăng mạnh sai số ngẫu nhiên $\\overline{\\Delta t}$, khiến sai số tỉ đối $\\delta v$ vượt quá $10\\%$ (phép đo không đáng tin cậy).',
          },
        },
        sections: [
          {
            title: '1. Phân loại phép đo',
            content: `* **Phép đo trực tiếp**: Đọc trực tiếp kết quả trên dụng cụ đo (ví dụ: đo chiều dài bằng thước kẻ, đo thời gian bằng đồng hồ bấm giây, đo nhiệt độ bằng nhiệt kế).
* **Phép đo gián tiếp**: Xác định thông qua công thức liên hệ với các đại lượng đo trực tiếp (ví dụ: đo tốc độ $v = \\frac{s}{t}$, đo khối lượng riêng $\\rho = \\frac{m}{V}$).`,
            keyTakeaway: 'Phép đo trực tiếp đọc ngay trên thang chia dụng cụ; phép đo gián tiếp tính qua công thức.',
          },
          {
            title: '2. Phân loại sai số',
            content: `* **Sai số hệ thống (dụng cụ)**: Do đặc điểm cấu tạo dụng cụ gây ra, có tính quy luật lặp lại. Thường lấy bằng một nửa độ chia nhỏ nhất (ĐCNN):
$$\\Delta A_{dc} = \\frac{1}{2}\\text{ĐCNN}$$
(hoặc bằng 1 ĐCNN theo quy định của nhà sản xuất).
* **Sai số ngẫu nhiên**: Do thao tác đo của con người, phản xạ bấm đồng hồ, góc nhìn lệch hoặc điều kiện môi trường bất định. Có thể giảm thiểu bằng cách đo nhiều lần (ít nhất 3 - 5 lần).`,
            keyTakeaway: 'Sai số dụng cụ: ΔA_dc = 1/2 ĐCNN. Sai số ngẫu nhiên được khắc phục bằng cách đo lặp lại nhiều lần.',
          },
          {
            title: '3. Công thức tính sai số phép đo trực tiếp',
            content: `Khi đo $n$ lần đại lượng $A$ ta thu được các giá trị $A_1, A_2, \\dots, A_n$:

* **Giá trị trung bình**:
$$\\overline{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}$$

* **Sai số ngẫu nhiên tuyệt đối trung bình**:
$$\\overline{\\Delta A} = \\frac{\\Delta A_1 + \\Delta A_2 + \\dots + \\Delta A_n}{n}$$
với $\\Delta A_i = |\\overline{A} - A_i|$ là sai số tuyệt đối của lần đo thứ $i$.

* **Sai số tuyệt đối toàn phần**:
$$\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$$

* **Sai số tỉ đối**:
$$\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%$$`,
            keyTakeaway: 'ΔA = ΔA_bar + ΔA_dc. Sai số tỉ đối δA biểu thị độ chuẩn xác của phép đo.',
            formulas: [
              {
                name: 'Giá trị trung bình',
                latex: '\\overline{A} = \\frac{1}{n} \\sum_{i=1}^n A_i',
                description: 'Giá trị đại diện cho phép đo',
              },
              {
                name: 'Sai số tuyệt đối',
                latex: '\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}',
                description: 'Tổng sai số ngẫu nhiên và sai số dụng cụ',
              },
              {
                name: 'Sai số tỉ đối',
                latex: '\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%',
                description: 'Tỉ số đánh giá độ tin cậy của phép đo',
                units: '%',
              },
            ],
          },
          {
            title: '4. Ghi kết quả đo & Sai số phép đo gián tiếp',
            content: `### Quy cách ghi kết quả đo:
$$A = \\overline{A} \\pm \\Delta A$$

**Quy tắc làm tròn**:
* Sai số tuyệt đối $\\Delta A$ làm tròn đến **1 hoặc 2 chữ số có nghĩa**.
* Giá trị trung bình $\\overline{A}$ làm tròn đến cùng bậc thập phân với chữ số có nghĩa của $\\Delta A$.

### Phép tính sai số đo gián tiếp:
* **Đại lượng dạng tổng/hiệu** ($F = X + Y - Z$): $\\Delta F = \\Delta X + \\Delta Y + \\Delta Z$
* **Đại lượng dạng tích/thương** ($v = \\frac{s}{t}$):
$$\\delta v = \\delta s + \\delta t = \\frac{\\Delta s}{\\overline{s}} \\cdot 100\\% + \\frac{\\Delta t}{\\overline{t}} \\cdot 100\\%$$
Từ đó suy ra sai số tuyệt đối: $\\Delta v = \\delta v \\cdot \\overline{v}$.`,
            keyTakeaway: 'Kết quả: A = A_bar ± ΔA. Với tích/thương: cộng sai số tỉ đối δF = δX + δY.',
          },
        ],
        summaryFormulas: [
          { name: 'Giá trị trung bình', latex: '\\overline{A} = \\frac{1}{n} \\sum_{i=1}^n A_i' },
          { name: 'Sai số tuyệt đối', latex: '\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}' },
          { name: 'Sai số tỉ đối', latex: '\\delta A = \\frac{\\Delta A}{\\overline{A}} \\times 100\\%' },
          { name: 'Ghi kết quả', latex: 'A = \\overline{A} \\pm \\Delta A' },
        ],
      },
    ],
  },
  {
    id: 'chuong-2',
    number: 2,
    romanNumeral: 'II',
    title: 'Động học',
    description: 'Nghiên cứu quy luật chuyển động cơ học của vật: quãng đường, độ dịch chuyển, vận tốc, gia tốc, chuyển động thẳng biến đổi đều, rơi tự do và chuyển động ném.',
    lessons: [
      {
        id: 'bai-4',
        chapterId: 'chuong-2',
        number: 4,
        title: 'Độ dịch chuyển và quãng đường đi được',
        shortDesc: 'Hệ quy chiếu, phân biệt quãng đường s (vô hướng) và độ dịch chuyển vectơ d, tổng hợp độ dịch chuyển.',
        labType: 'vector_velocity',
        labTitle: 'Mô phỏng Quãng đường vs Độ dịch chuyển Vectơ',
        labDescription: 'Tương tác di chuyển chất điểm trên mặt phẳng toạ độ 2D để trực quan hóa sự khác biệt giữa s (độ dài đường đi) và vectơ d (nối điểm đầu với điểm cuối).',
        sections: [
          {
            title: '1. Hệ quy chiếu và mô tả chuyển động',
            content: `Để xác định vị trí và thời gian của một vật chuyển động, ta cần chọn một **Hệ quy chiếu** bao gồm:
* **Vật mốc** và **Hệ toạ độ** gắn với vật mốc (thường là trục số $Ox$ hoặc hệ toạ độ vuông góc $Oxy$).
* **Gốc thời gian** ($t = 0$) và **Đồng hồ đo thời gian**.

Chất điểm: Một vật được coi là chất điểm nếu kích thước của nó rất nhỏ so với quãng đường di chuyển hoặc khoảng cách đang xét.`,
            keyTakeaway: 'Hệ quy chiếu = Vật mốc & Hệ toạ độ + Gốc thời gian & Đồng hồ.',
          },
          {
            title: '2. Quãng đường đi được và Độ dịch chuyển',
            content: `### Quãng đường đi được ($s$):
* Là độ dài toàn bộ quỹ đạo mà vật đã vạch ra trong suốt quá trình chuyển động.
* Là một **đại lượng vô hướng, luôn dương hoặc bằng 0** ($s \\ge 0$).

### Độ dịch chuyển (vectơ $\\vec{d}$):
* Là một **đại lượng vectơ** nối vị trí điểm đầu chuyển động đến vị trí điểm cuối.
* Cho biết cả độ lớn khoảng cách thay đổi lẫn **hướng chuyển động** của vật:
$$d = x_2 - x_1 = \\Delta x$$ (khi chuyển động trên trục $Ox$).
* Độ dịch chuyển có thể mang giá trị **dương, âm hoặc bằng 0** tùy theo chiều chọn của trục toạ độ.`,
            keyTakeaway: 'Quãng đường s là độ dài đường đi thực tế (s ≥ 0). Độ dịch chuyển d là vectơ nối vị trí đầu với vị trí cuối.',
          },
          {
            title: '3. Mối liên hệ so sánh giữa $s$ và $d$',
            content: `Về độ lớn:
$$d \\le s$$

* Khi vật **chuyển động thẳng và không đổi chiều**: Độ lớn độ dịch chuyển bằng quãng đường đi được ($d = s$).
* Khi vật chuyển động có đổi chiều hoặc đi theo đường cong: Độ lớn độ dịch chuyển luôn nhỏ hơn quãng đường ($d < s$).
* Khi vật đi một vòng khép kín và quay về đúng vị trí ban đầu: Độ dịch chuyển bằng không ($d = 0$), trong khi quãng đường $s > 0$.`,
            keyTakeaway: '|d| ≤ s; |d| = s khi và chỉ khi vật chuyển động thẳng không đổi chiều.',
          },
          {
            title: '4. Tổng hợp độ dịch chuyển bằng phép cộng vectơ',
            content: `Khi vật thực hiện liên tiếp hai độ dịch chuyển $\\vec{d}_1$ và $\\vec{d}_2$, độ dịch chuyển tổng hợp $\\vec{d}$ được xác định bằng phép cộng vectơ:
$$\\vec{d} = \\vec{d}_1 + \\vec{d}_2$$

Các trường hợp đặc biệt về độ lớn:
* Hai độ dịch chuyển cùng hướng: $d = d_1 + d_2$
* Hai độ dịch chuyển ngược hướng: $d = |d_1 - d_2|$
* Hai độ dịch chuyển vuông góc ($\\vec{d}_1 \\perp \\vec{d}_2$):
$$d = \\sqrt{d_1^2 + d_2^2}$$`,
            keyTakeaway: 'Quy tắc cộng vectơ độ dịch chuyển: d = d1 + d2. Khi vuông góc: d = √(d1² + d2²).',
            formulas: [
              {
                name: 'Tổng hợp độ dịch chuyển',
                latex: '\\vec{d} = \\vec{d}_1 + \\vec{d}_2',
                description: 'Cộng vectơ theo quy tắc hình bình hành hoặc tam giác',
              },
              {
                name: 'Trường hợp vuông góc',
                latex: 'd = \\sqrt{d_1^2 + d_2^2}',
                description: 'Định lí Pythagoras áp dụng cho hai chuyển động trực giao',
                units: 'm',
              },
            ],
          },
        ],
        summaryFormulas: [
          { name: 'Độ biến thiên toạ độ', latex: 'd = \\Delta x = x_2 - x_1' },
          { name: 'Tổng hợp vectơ độ dịch chuyển', latex: '\\vec{d} = \\vec{d}_1 + \\vec{d}_2' },
        ],
      },
      {
        id: 'bai-5',
        chapterId: 'chuong-2',
        number: 5,
        title: 'Tốc độ và vận tốc',
        shortDesc: 'Tốc độ trung bình & tức thời, vận tốc trung bình & tức thời, công thức cộng vận tốc trong chuyển động tương đối.',
        labType: 'vector_velocity',
        labTitle: 'Mô phỏng Thuyền qua sông & Công thức cộng vận tốc',
        labDescription: 'Tùy chỉnh vận tốc dòng nước và vận tốc thuyền để quan sát trực tiếp vectơ vận tốc thực tế v₁₃ = v₁₂ + v₂₃ và độ dạt bờ của thuyền.',
        sections: [
          {
            title: '1. Tốc độ trung bình và Tốc độ tức thời',
            content: `### Tốc độ trung bình ($v_{tb}$):
Đặc trưng cho mức độ nhanh hay chậm của chuyển động trên cả quãng đường:
$$v_{tb} = \\frac{s}{t} \\quad \\text{hoặc} \\quad v = \\frac{\\Delta s}{\\Delta t}$$
* Tốc độ trung bình là đại lượng vô hướng, không âm ($v_{tb} \\ge 0$).
* Đơn vị trong hệ SI: mét trên giây ($\\text{m/s}$). Đơn vị thực tế thông dụng: $\\text{km/h}$ ($1\\text{ m/s} = 3{,}6\\text{ km/h}$).

### Tốc độ tức thời:
Là tốc độ tại một thời điểm hoặc một vị trí xác định trên quỹ đạo (đo bằng **tốc kế** trên xe máy, ô tô).`,
            keyTakeaway: 'Tốc độ = Quãng đường / Thời gian (đại lượng vô hướng, cho biết độ nhanh chậm).',
          },
          {
            title: '2. Vận tốc trung bình và Vận tốc tức thời',
            content: `Khác với tốc độ, **vận tốc** là một đại lượng vectơ cho biết cả độ nhanh chậm và hướng của chuyển động:

### Vận tốc trung bình:
$$\\vec{v} = \\frac{\\vec{d}}{t} = \\frac{\\Delta \\vec{d}}{\\Delta t}$$
* Chiều của vectơ vận tốc trung bình cùng chiều với vectơ độ dịch chuyển $\\vec{d}$.
* Về độ lớn trên trục $Ox$: $v = \\frac{d}{t} = \\frac{x_2 - x_1}{t_2 - t_1}$. Vận tốc có thể âm khi vật đi ngược chiều dương trục toạ độ.

### Vận tốc tức thời ($\\vec{v}_t$):
Là vận tốc tại một thời điểm rất ngắn $\\Delta t \\to 0$. Vectơ vận tốc tức thời có gốc tại vật, phương tiếp tuyến với quỹ đạo và chiều theo chiều chuyển động.`,
            keyTakeaway: 'Vận tốc là đại lượng vectơ: v = d / t. Hướng của vectơ vận tốc trùng với hướng dịch chuyển.',
          },
          {
            title: '3. Công thức cộng vận tốc',
            content: `Khi một vật chuyển động trong một hệ quy chiếu chuyển động (ví dụ: thuyền chạy trên dòng sông đang chảy):

Gọi:
* Vật 1: Vật chuyển động (Thuyền)
* Vật 2: Hệ quy chiếu chuyển động (Dòng nước)
* Vật 3: Hệ quy chiếu đứng yên (Bờ sông)

**Công thức cộng vận tốc dạng vectơ**:
$$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$$

* $\\vec{v}_{1,3}$: Vận tốc tuyệt đối (vận tốc thuyền so với bờ).
* $\\vec{v}_{1,2}$: Vận tốc tương đối (vận tốc thuyền so với dòng nước).
* $\\vec{v}_{2,3}$: Vận tốc kéo theo (vận tốc dòng nước so với bờ).

### Các trường hợp cụ thể:
* **Thuyền xuôi dòng** ($\\vec{v}_{1,2} \\uparrow\\uparrow \\vec{v}_{2,3}$):
$$v_{1,3} = v_{1,2} + v_{2,3}$$
* **Thuyền ngược dòng** ($\\vec{v}_{1,2} \\uparrow\\downarrow \\vec{v}_{2,3}$):
$$v_{1,3} = |v_{1,2} - v_{2,3}|$$
* **Thuyền đi vuông góc với dòng chảy** ($\\vec{v}_{1,2} \\perp \\vec{v}_{2,3}$):
$$v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$$
Góc lệch so với bờ $\\tan \\alpha = \\frac{v_{1,2}}{v_{2,3}}$.`,
            keyTakeaway: 'Công thức cộng vận tốc: v₁₃ = v₁₂ + v₂₃. Vận tốc tuyệt đối = Vận tốc tương đối + Vận tốc kéo theo.',
            formulas: [
              {
                name: 'Công thức cộng vận tốc',
                latex: '\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}',
                description: 'Quan hệ giữa vận tốc tuyệt đối, tương đối và kéo theo',
              },
            ],
          },
        ],
        summaryFormulas: [
          { name: 'Tốc độ trung bình', latex: 'v = \\frac{s}{t}' },
          { name: 'Vận tốc trung bình', latex: '\\vec{v} = \\frac{\\vec{d}}{t}' },
          { name: 'Cộng vận tốc', latex: '\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}' },
        ],
      },
      {
        id: 'bai-6',
        chapterId: 'chuong-2',
        number: 6,
        title: 'Thực hành: Đo tốc độ của vật chuyển động',
        shortDesc: 'Phương án đo thực nghiệm với Cổng quang điện, Đồng hồ đo thời gian hiện số MC964, máng nghiêng và thước kẹp.',
        labType: 'photogate_mc964',
        labTitle: 'Phòng thí nghiệm Ảo: Đồng hồ MC964 & Máng nghiêng',
        labDescription: 'Thao tác các chế độ MODE A, B, A+B, A<->B trên đồng hồ MC964, thả bi thép trượt trên máng nghiêng và ghi nhận thời gian chắn cổng quang điện.',
        sections: [
          {
            title: '1. Dụng cụ thí nghiệm đo tốc độ',
            content: `Bộ thí nghiệm tiêu chuẩn trong SGK Kết nối tri thức bao gồm:
* **Máng nhôm định hình nghiêng** có thước đo milimet chia vạch gắn kèm.
* **Bi thép** có đường kính $d$ (đo bằng thước kẹp cơ khí).
* **Nam châm điện** gắn ở đầu máng để giữ và nhả bi thép không vận tốc đầu.
* **Cổng quang điện** (Photogate): Gồm một đầu phát tia hồng ngoại và một đầu thu. Khi vật chắn qua tia hồng ngoại, cổng phát ra tín hiệu điện kích hoạt đồng hồ.
* **Đồng hồ đo thời gian hiện số MC964**: Dụng cụ đếm xung thời gian chính xác đến $0{,}001\\text{ s}$.`,
            keyTakeaway: 'Đồng hồ MC964 kết hợp với cổng quang điện cho phép đo thời gian chắn tia sáng với độ chính xác đến mili-giây (0,001 s).',
          },
          {
            title: '2. Các chế độ làm việc (MODE) của đồng hồ MC964',
            content: `Đồng hồ MC964 có công tắc chọn các chế độ đo chuyên dụng:

* **MODE A**: Đo thời gian vật chắn qua cổng quang A (dùng để tính tốc độ tức thời tại A).
* **MODE B**: Đo thời gian vật chắn qua cổng quang B (dùng để tính tốc độ tức thời tại B).
* **MODE A + B**: Đo tổng thời gian chắn cổng A và chắn cổng B.
* **MODE A $\\leftrightarrow$ B**: Đo khoảng thời gian kể từ khi vật bắt đầu chắn cổng A đến khi vật bắt đầu chắn cổng B (dùng để đo thời gian chuyển động giữa hai vị trí).`,
            keyTakeaway: 'MODE A/B đo thời gian che cổng để tính tốc độ tức thời; MODE A↔B đo khoảng thời gian đi giữa 2 cổng để tính tốc độ trung bình.',
          },
          {
            title: '3. Phương án đo và Công thức tính',
            content: `### Phương án 1: Đo tốc độ trung bình
* Đặt đồng hồ ở **MODE A $\\leftrightarrow$ B**.
* Đặt cổng A tại vị trí $s_1$, cổng B tại vị trí $s_2$. Quãng đường $s = s_2 - s_1$.
* Thả bi lăn qua 2 cổng, đọc thời gian $t$ hiển thị trên đồng hồ MC964.
* Tốc độ trung bình:
$$v_{tb} = \\frac{s}{t}$$

### Phương án 2: Đo tốc độ tức thời
* Dùng thước kẹp đo đường kính của viên bi thép: $d$ (thước kẹp có ĐCNN $0{,}02\\text{ mm}$ hoặc $0{,}05\\text{ mm}$).
* Đặt đồng hồ ở **MODE A** (hoặc MODE B).
* Cho viên bi lăn qua cổng quang A. Viên bi chắn chùm tia sáng một khoảng thời gian $\\Delta t_A$.
* Tốc độ tức thời của viên bi khi đi qua cổng A:
$$v_A = \\frac{d}{\\Delta t_A}$$`,
            keyTakeaway: 'Tốc độ tức thời vt = d / Δt (đường kính viên bi chia cho thời gian chắn cổng quang).',
            formulas: [
              {
                name: 'Tốc độ trung bình',
                latex: 'v_{tb} = \\frac{s}{t}',
                description: 'Khoảng cách giữa hai cổng quang chia cho thời gian đo ở MODE A↔B',
                units: 'm/s',
              },
              {
                name: 'Tốc độ tức thời',
                latex: 'v_A = \\frac{d}{\\Delta t_A}',
                description: 'Đường kính bi thép chia cho thời gian chắn cổng quang đo ở MODE A',
                units: 'm/s',
              },
            ],
          },
        ],
      },
      {
        id: 'bai-7',
        chapterId: 'chuong-2',
        number: 7,
        title: 'Đồ thị độ dịch chuyển – thời gian',
        shortDesc: 'Đọc và vẽ đồ thị d - t trong chuyển động thẳng, ý nghĩa của độ dốc (hệ số góc) chính là vận tốc v.',
        labType: 'motion_graph',
        labTitle: 'Vẽ Đồ thị d-t Thời gian thực',
        labDescription: 'Quan sát chuyển động của xe đồng thời theo dõi đồ thị d - t được vẽ trực tiếp từng bước, thay đổi vận tốc để thấy độ dốc thay đổi.',
        sections: [
          {
            title: '1. Dạng đồ thị độ dịch chuyển – thời gian ($d - t$)',
            content: `Đồ thị $d - t$ biểu diễn mối liên hệ giữa độ dịch chuyển $d$ (trục tung) theo thời gian $t$ (trục hoành):

* Trong **chuyển động thẳng đều**: $d = v \\cdot t$. Phương trình có dạng hàm bậc nhất $y = ax$, do đó đồ thị $d - t$ là một **đường thẳng đi qua gốc toạ độ** (nếu chọn gốc toạ độ tại vị trí ban đầu).
* Nếu tại thời điểm ban đầu vật đã ở vị trí $d_0 \\ne 0$: $d = d_0 + v \\cdot t$, đồ thị là đường thẳng cắt trục tung tại điểm $(0; d_0)$.`,
            keyTakeaway: 'Đồ thị d-t của chuyển động thẳng đều luôn là đường thẳng xiên góc hoặc nằm ngang.',
          },
          {
            title: '2. Ý nghĩa độ dốc (hệ số góc) của đồ thị $d - t$',
            content: `Độ dốc (slope) của đường biểu diễn trên đồ thị $d - t$ chính là giá trị của **vận tốc**:
$$\\text{Độ dốc} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1} = v$$

### Các trường hợp biểu diễn:
* **Đường thẳng dốc lên** (hệ số góc dương, $\\Delta d > 0$): Vật chuyển động thẳng đều **cùng chiều dương** ($v > 0$). Độ dốc càng lớn thì vận tốc càng nhanh.
* **Đường thẳng nằm ngang song song trục thời gian** ($\\Delta d = 0$): Vật **đứng yên** ($v = 0$).
* **Đường thẳng dốc xuống** (hệ số góc âm, $\\Delta d < 0$): Vật chuyển động thẳng đều **ngược chiều dương** ($v < 0$).
* **Đường cong**: Vận tốc thay đổi theo thời gian (chuyển động biến đổi).`,
            keyTakeaway: 'Hệ số góc (độ dốc) của đồ thị d - t bằng vận tốc: v = Δd / Δt. Dốc lên: v > 0; nằm ngang: v = 0; dốc xuống: v < 0.',
            formulas: [
              {
                name: 'Độ dốc đồ thị d-t',
                latex: 'v = \\frac{\\Delta d}{\\Delta t} = \\tan \\alpha',
                description: 'Vận tốc bằng hệ số góc của đường d-t so với trục thời gian',
                units: 'm/s',
              },
            ],
          },
        ],
        summaryFormulas: [
          { name: 'Phương trình d-t thẳng đều', latex: 'd = v \\cdot t' },
          { name: 'Vận tốc từ hệ số góc', latex: 'v = \\frac{d_2 - d_1}{t_2 - t_1}' },
        ],
      },
      {
        id: 'bai-8',
        chapterId: 'chuong-2',
        number: 8,
        title: 'Chuyển động biến đổi. Gia tốc',
        shortDesc: 'Khái niệm chuyển động biến đổi, định nghĩa đại lượng gia tốc a, ý nghĩa dấu của tích a.v đối với chuyển động nhanh dần và chậm dần.',
        labType: 'motion_graph',
        labTitle: 'Khám phá Vectơ Gia tốc và Vận tốc',
        labDescription: 'Điều chỉnh gia tốc dương và âm, quan sát vectơ v và vectơ a hiển thị song song trên xe để hiểu bản chất tích a.v.',
        sections: [
          {
            title: '1. Khái niệm chuyển động biến đổi',
            content: `Chuyển động có vận tốc thay đổi theo thời gian gọi là **chuyển động biến đổi**.
* Tàu hỏa rời ga: vận tốc tăng dần.
* Xe máy bóp phanh: vận tốc giảm dần.
* Xe vào khúc cua: hướng chuyển động thay đổi liên tục.

Để định lượng sự thay đổi của vận tốc nhanh hay chậm, người ta đưa ra đại lượng **Gia tốc**.`,
          },
          {
            title: '2. Định nghĩa và Công thức Gia tốc',
            content: `**Gia tốc** là đại lượng vật lí đặc trưng cho **tốc độ thay đổi của vận tốc** theo thời gian:
$$a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_t - v_0}{t - t_0}$$

* Trong hệ SI, đơn vị của gia tốc là **mét trên giây bình phương** ($\\text{m/s}^2$).
* **Vectơ gia tốc**:
$$\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v}_t - \\vec{v}_0}{\\Delta t}$$
Vectơ gia tốc có cùng hướng với vectơ biến thiên vận tốc $\\Delta \\vec{v}$.`,
            keyTakeaway: 'Gia tốc đặc trưng cho sự biến thiên của vận tốc: a = Δv / Δt (đơn vị: m/s²).',
            formulas: [
              {
                name: 'Gia tốc trung bình',
                latex: 'a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}',
                description: 'Độ biến thiên vận tốc trong một đơn vị thời gian',
                units: 'm/s²',
              },
            ],
          },
          {
            title: '3. Phân biệt chuyển động nhanh dần đều và chậm dần đều',
            content: `Xét chuyển động thẳng:

### a) Chuyển động nhanh dần (vận tốc tăng theo thời gian)
* Vectơ gia tốc $\\vec{a}$ **cùng chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\uparrow \\vec{v}$).
* Tích đại số:
$$a \\cdot v > 0$$
(Tức $a$ và $v$ cùng dấu: cùng dương nếu đi theo chiều dương, cùng âm nếu đi theo chiều âm).

### b) Chuyển động chậm dần (vận tốc giảm theo thời gian)
* Vectơ gia tốc $\\vec{a}$ **ngược chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\downarrow \\vec{v}$).
* Tích đại số:
$$a \\cdot v < 0$$
(Tức $a$ và $v$ trái dấu: một đại lượng dương thì đại lượng kia âm).`,
            keyTakeaway: 'Nhanh dần: a và v cùng chiều (a·v > 0). Chậm dần: a và v ngược chiều (a·v < 0).',
          },
        ],
        summaryFormulas: [
          { name: 'Gia tốc', latex: 'a = \\frac{v_t - v_0}{t - t_0}' },
          { name: 'Điều kiện nhanh dần', latex: 'a \\cdot v > 0' },
          { name: 'Điều kiện chậm dần', latex: 'a \\cdot v < 0' },
        ],
      },
      {
        id: 'bai-9',
        chapterId: 'chuong-2',
        number: 9,
        title: 'Chuyển động thẳng biến đổi đều',
        shortDesc: 'Định nghĩa a = const, bộ 3 công thức cốt lõi v = v₀ + at, d = v₀t + ½at², v² - v₀² = 2ad, đồ thị v - t và diện tích hình thang.',
        labType: 'motion_graph',
        labTitle: 'Phòng thí nghiệm: Chuyển động Thẳng Biến đổi đều',
        labDescription: 'Mô phỏng xe chạy có gia tốc, đồng thời vẽ đồ thị v - t theo thời gian thực và tính diện tích miền dưới đồ thị để kiểm chứng độ dịch chuyển d.',
        sections: [
          {
            title: '1. Định nghĩa Chuyển động thẳng biến đổi đều',
            content: `Chuyển động thẳng biến đổi đều là chuyển động có **quỹ đạo là đường thẳng** và có **gia tốc không đổi theo thời gian** ($\\vec{a} = \\text{hằng số}$).
* Nếu $a \\cdot v > 0$: Chuyển động thẳng **nhanh dần đều** (vận tốc tăng đều theo thời gian).
* Nếu $a \\cdot v < 0$: Chuyển động thẳng **chậm dần đều** (vận tốc giảm đều theo thời gian).`,
            keyTakeaway: 'Chuyển động thẳng biến đổi đều: Quỹ đạo thẳng, gia tốc không đổi (a = const).',
          },
          {
            title: '2. Các công thức cốt lõi',
            content: `### 1. Công thức vận tốc tức thời:
$$v = v_0 + at$$
Trong đó: $v_0$ là vận tốc ban đầu (tại $t = 0$); $v$ là vận tốc tại thời điểm $t$; $a$ là gia tốc.

### 2. Công thức tính độ dịch chuyển (hoặc quãng đường):
$$d = v_0 t + \\frac{1}{2}at^2$$
(Khi chuyển động thẳng không đổi chiều thì $s = d$).

### 3. Công thức liên hệ độc lập với thời gian (Hệ thức độc lập $t$):
$$v^2 - v_0^2 = 2ad$$
Công thức này cho phép tìm vận tốc hoặc quãng đường mà không cần biết thời gian $t$.`,
            keyTakeaway: 'Bộ 3 công thức cốt lõi: v = v₀ + at; d = v₀t + ½at²; v² - v₀² = 2ad.',
            formulas: [
              {
                name: 'Vận tốc tức thời',
                latex: 'v = v_0 + at',
                description: 'Vận tốc biến thiên bậc nhất theo thời gian',
                units: 'm/s',
              },
              {
                name: 'Độ dịch chuyển',
                latex: 'd = v_0 t + \\frac{1}{2}at^2',
                description: 'Độ dịch chuyển là hàm bậc hai theo thời gian',
                units: 'm',
              },
              {
                name: 'Hệ thức độc lập thời gian',
                latex: 'v^2 - v_0^2 = 2ad',
                description: 'Liên hệ giữa vận tốc, gia tốc và độ dịch chuyển',
              },
            ],
          },
          {
            title: '3. Đồ thị vận tốc – thời gian ($v - t$)',
            content: `* Đồ thị $v - t$ của chuyển động thẳng biến đổi đều là một **đường thẳng xiên góc**:
  * Độ dốc của đường thẳng $v - t$ chính bằng **gia tốc** $a = \\frac{\\Delta v}{\\Delta t}$.
  * Nếu $a > 0$: đường thẳng dốc lên.
  * Nếu $a < 0$: đường thẳng dốc xuống.
  * Nếu $a = 0$: đường thẳng nằm ngang (chuyển động thẳng đều).

### Ý nghĩa diện tích dưới đồ thị $v - t$:
**Diện tích của hình giới hạn bởi đồ thị $v - t$, trục hoành thời gian và hai đường dóng thời điểm $t_1, t_2$ có giá trị bằng độ lớn của độ dịch chuyển $d$** trong khoảng thời gian đó.
* Với hình thang vuông: $S = \\frac{(v_0 + v) \\cdot t}{2} = v_0 t + \\frac{1}{2}at^2 = d$.`,
            keyTakeaway: 'Độ dốc đồ thị v - t bằng gia tốc a. Diện tích hình phẳng dưới đồ thị v - t bằng độ dịch chuyển d.',
          },
        ],
        summaryFormulas: [
          { name: 'Vận tốc', latex: 'v = v_0 + at' },
          { name: 'Độ dịch chuyển', latex: 'd = v_0 t + \\frac{1}{2}at^2' },
          { name: 'Hệ thức liên hệ', latex: 'v^2 - v_0^2 = 2ad' },
        ],
      },
      {
        id: 'bai-10',
        chapterId: 'chuong-2',
        number: 10,
        title: 'Sự rơi tự do',
        shortDesc: 'Định nghĩa sự rơi trong chân không, gia tốc rơi tự do g, các công thức rơi tự do không vận tốc ban đầu.',
        labType: 'free_fall',
        labTitle: 'Mô phỏng Rơi Tự do trong Chân không',
        labDescription: 'Thả rơi vật từ các độ cao khác nhau, so sánh chuyển động trong không khí có lực cản vs trong ống chân không Newton, theo dõi v và s.',
        sections: [
          {
            title: '1. Sự rơi trong không khí và Sự rơi tự do',
            content: `* Trong không khí: Các vật rơi nhanh hay chậm khác nhau chủ yếu là do **lực cản của không khí** tác dụng lên vật. Thí nghiệm ống Newton cho thấy: Khi hút hết không khí ra khỏi ống, một chiếc lông chim và một hòn bi chì rơi nhanh như nhau!
* **Định nghĩa**: Sự rơi tự do là sự rơi của một vật **chỉ chịu tác dụng của trọng lực**.
* Nếu vật rơi trong không khí mà sức cản của không khí rất nhỏ so với trọng lực của vật (ví dụ: hòn bi thép, quả cầu chì), ta có thể coi gần đúng chuyển động rơi đó là rơi tự do.`,
            keyTakeaway: 'Rơi tự do là chuyển động chỉ chịu tác dụng của trọng lực. Không khí cản làm vật rơi chậm lại.',
          },
          {
            title: '2. Đặc điểm của chuyển động rơi tự do',
            content: `* **Phương chuyển động**: Thẳng đứng.
* **Chiều chuyển động**: Từ trên xuống dưới.
* **Tính chất chuyển động**: Là chuyển động thẳng **nhanh dần đều** với vận tốc ban đầu bằng không ($v_0 = 0$).
* **Gia tốc rơi tự do**: Tại một nơi nhất định trên Trái Đất và ở gần mặt đất, mọi vật đều rơi tự do với cùng một gia tốc kí hiệu là $g$.
  * Giá trị thường lấy: $g \\approx 9{,}8\\text{ m/s}^2$ hoặc $g \\approx 10\\text{ m/s}^2$.
  * Gia tốc $g$ thay đổi nhẹ theo vĩ độ địa lí (ở xích đạo $g \\approx 9{,}78\\text{ m/s}^2$, ở hai cực $g \\approx 9{,}83\\text{ m/s}^2$) và giảm dần theo độ cao.`,
            keyTakeaway: 'Rơi tự do: Thẳng đứng, từ trên xuống, nhanh dần đều với gia tốc g ≈ 9,8 m/s².',
          },
          {
            title: '3. Các công thức của sự rơi tự do',
            content: `Do rơi tự do là chuyển động thẳng nhanh dần đều với $v_0 = 0$ và $a = g$, ta suy ra từ các công thức của chuyển động thẳng biến đổi đều:

### 1. Vận tốc tức thời:
$$v = g \\cdot t$$

### 2. Quãng đường rơi (độ cao giảm):
$$s = h = \\frac{1}{2}g t^2$$

### 3. Công thức liên hệ giữa vận tốc và quãng đường:
$$v^2 = 2gs \\implies v = \\sqrt{2gs}$$

### 4. Thời gian rơi chạm đất từ độ cao $h$:
$$t = \\sqrt{\\frac{2h}{g}}$$`,
            keyTakeaway: 'Công thức rơi tự do: v = gt; s = ½gt²; v = √(2gs); thời gian rơi t = √(2h/g).',
            formulas: [
              {
                name: 'Vận tốc rơi tự do',
                latex: 'v = g t',
                description: 'Vận tốc tăng tỉ lệ thuận với thời gian',
                units: 'm/s',
              },
              {
                name: 'Quãng đường rơi',
                latex: 's = \\frac{1}{2}g t^2',
                description: 'Quãng đường tỉ lệ với bình phương thời gian rơi',
                units: 'm',
              },
              {
                name: 'Thời gian rơi từ độ cao h',
                latex: 't = \\sqrt{\\frac{2h}{g}}',
                description: 'Thời gian chạm đất chỉ phụ thuộc độ cao h và gia tốc g',
                units: 's',
              },
            ],
          },
        ],
        summaryFormulas: [
          { name: 'Vận tốc rơi', latex: 'v = gt' },
          { name: 'Quãng đường', latex: 's = \\frac{1}{2}gt^2' },
          { name: 'Vận tốc chạm đất', latex: 'v = \\sqrt{2gh}' },
          { name: 'Thời gian rơi', latex: 't = \\sqrt{\\frac{2h}{g}}' },
        ],
      },
      {
        id: 'bai-11',
        chapterId: 'chuong-2',
        number: 11,
        title: 'Thực hành: Đo gia tốc rơi tự do',
        shortDesc: 'Bộ thí nghiệm đo gia tốc g với nam châm điện, cổng quang điện, đồng hồ đo số, phương pháp vẽ đồ thị s - t².',
        labType: 'free_fall',
        labTitle: 'Phòng thí nghiệm: Đo Gia tốc Trọng trường g',
        labDescription: 'Tương tác điều chỉnh độ cao s của cổng quang điện, bấm nhả nam châm điện để đồng hồ MC964 tự động ghi nhận thời gian t và vẽ đồ thị s - t².',
        sections: [
          {
            title: '1. Mục đích và Dụng cụ thí nghiệm',
            content: `### Mục đích:
Xác định gia tốc rơi tự do $g$ tại phòng thí nghiệm thông qua phép đo quãng đường rơi $s$ và thời gian rơi $t$.

### Bộ dụng cụ bao gồm:
1. Trụ đứng bằng hợp kim nhôm có gắn thước đo vạch chia đến milimet.
2. Quả dọi định phương thẳng đứng.
3. Nam châm điện gắn cố định ở đỉnh trụ để giữ và nhả viên bi thép khi ngắt điện.
4. Cổng quang điện gắn trên giá có thể điều chỉnh vị trí dọc theo trụ.
5. Đồng hồ đo thời gian hiện số MC964 cắm vào nam châm và cổng quang điện.
6. Hộp hứng bi có xốp giảm chấn ở đáy.`,
            keyTakeaway: 'Thí nghiệm đo gia tốc g sử dụng nam châm điện thả rơi bi thép qua cổng quang điện nối với đồng hồ MC964.',
          },
          {
            title: '2. Tiến trình đo đạc',
            content: `1. Điều chỉnh trụ thẳng đứng bằng cách nhìn quả dọi.
2. Gắn viên bi thép dính vào cực nam châm điện ở đỉnh.
3. Đặt cổng quang điện ở vị trí cách vị trí bi thép thả rơi một đoạn $s$ (ví dụ: $s = 0{,}2\\text{ m}, 0{,}4\\text{ m}, 0{,}6\\text{ m}, 0{,}8\\text{ m}$).
4. Cài đặt đồng hồ đo hiện số: Nhấn nút Reset về $0{,}000\\text{ s}$.
5. Nhấn công tắc ngắt điện nam châm: Nam châm nhả bi đồng thời kích hoạt đồng hồ đếm thời gian. Khi bi đi qua cổng quang điện, chùm tia hồng ngoại bị chắn, đồng hồ tự động dừng lại. Đọc giá trị $t$.
6. Lặp lại phép đo ít nhất 3 - 5 lần với mỗi độ cao để lấy giá trị thời gian trung bình $\\bar{t}$.`,
          },
          {
            title: '3. Xử lí số liệu và Tính toán gia tốc $g$',
            content: `Từ công thức rơi tự do:
$$s = \\frac{1}{2}g t^2 \\implies g = \\frac{2s}{t^2}$$

### Cách 1: Tính toán theo công thức trung bình
* Tính gia tốc trung bình:
$$\\bar{g} = \\frac{2\\bar{s}}{\\bar{t}^2}$$
* Tính sai số tỉ đối:
$$\\delta g = \\delta s + 2\\delta t = \\frac{\\Delta s}{\\bar{s}} + 2\\frac{\\Delta t}{\\bar{t}}$$
* Tính sai số tuyệt đối: $\\Delta g = \\delta g \\cdot \\bar{g}$.
* Ghi kết quả: $g = \\bar{g} \\pm \\Delta g \\quad (\\text{m/s}^2)$.

### Cách 2: Phương pháp vẽ đồ thị $s - t^2$
* Đặt $y = s$ và $x = t^2$. Phương trình có dạng đường thẳng $y = kx$ đi qua gốc toạ độ.
* Hệ số góc của đường thẳng thực nghiệm:
$$k = \\frac{1}{2}g \\implies g = 2k$$
Phương pháp đồ thị giúp loại bỏ bớt sai số ngẫu nhiên một cách trực quan và khoa học.`,
            keyTakeaway: 'Xác định gia tốc g: Tính trực tiếp g = 2s / t² hoặc suy ra từ hệ số góc k của đồ thị s theo t²: g = 2k.',
            formulas: [
              {
                name: 'Gia tốc rơi tự do thực nghiệm',
                latex: 'g = \\frac{2s}{t^2}',
                description: 'Tính từ độ dịch chuyển thẳng đứng s và thời gian rơi t',
                units: 'm/s²',
              },
              {
                name: 'Hệ số góc đồ thị s - t²',
                latex: 's = k \\cdot t^2 \\implies g = 2k',
                description: 'Xác định g thông qua độ dốc của đồ thị thực nghiệm',
              },
            ],
          },
        ],
        summaryFormulas: [
          { name: 'Công thức tính g', latex: 'g = \\frac{2s}{t^2}' },
          { name: 'Sai số tỉ đối của g', latex: '\\delta g = \\delta s + 2\\delta t' },
        ],
      },
      {
        id: 'bai-12',
        chapterId: 'chuong-2',
        number: 12,
        title: 'Chuyển động ném',
        shortDesc: 'Phương pháp toạ độ phân tích chuyển động ném ngang trên Ox (đều) và Oy (rơi tự do), quỹ đạo parabol, tầm xa L, giới thiệu ném xiên.',
        labType: 'projectile',
        labTitle: 'Phòng thí nghiệm: Chuyển động Ném ngang & Ném xiên',
        labDescription: 'Tùy chỉnh độ cao ban đầu h, vận tốc ném v₀ và góc ném θ; quan sát quỹ đạo parabol và so sánh đồng thời với vật rơi tự do thả rơi từ cùng độ cao.',
        sections: [
          {
            title: '1. Chuyển động ném ngang',
            content: `Chuyển động ném ngang là chuyển động của một vật được ném theo **phương nằm ngang** từ độ cao $h$ với vận tốc ban đầu $\\vec{v}_0$.

### Phương pháp phân tích toạ độ (Phương pháp phân tích chuyển động):
Chọn hệ toạ độ $Oxy$:
* Gốc $O$ tại vị trí ném.
* Trục $Ox$ nằm ngang, cùng chiều với vận tốc ban đầu $\\vec{v}_0$.
* Trục $Oy$ thẳng đứng hướng xuống dưới.
* Gốc thời gian $t = 0$ là lúc bắt đầu ném.

Ta phân tích chuyển động ném ngang thành hai chuyển động thành phần độc lập trên hai trục toạ độ:
1. **Theo phương ngang (trục $Ox$)**: Vật không chịu lực nào (bỏ qua cản không khí) $\\implies a_x = 0$.
   Vật chuyển động **thẳng đều** với vận tốc không đổi $v_x = v_0$.
2. **Theo phương thẳng đứng (trục $Oy$)**: Vật chỉ chịu tác dụng của trọng lực $\\implies a_y = g$.
   Vật chuyển động **rơi tự do** với $v_{0y} = 0$.`,
            keyTakeaway: 'Chuyển động ném ngang = Chuyển động thẳng đều theo phương ngang (Ox) + Chuyển động rơi tự do theo phương thẳng đứng (Oy).',
          },
          {
            title: '2. Các phương trình của chuyển động ném ngang',
            content: `### a) Phương trình vận tốc:
* $v_x = v_0$
* $v_y = gt$
* Vận tốc toàn phần tại thời điểm $t$:
$$v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{v_0^2 + (gt)^2}$$
Hướng của vectơ vận tốc hợp với phương ngang một góc $\\alpha$: $\\tan \\alpha = \\frac{v_y}{v_x} = \\frac{gt}{v_0}$.

### b) Phương trình toạ độ:
* $x = v_0 t$
* $y = \\frac{1}{2}gt^2$

### c) Phương trình quỹ đạo:
Rút $t = \\frac{x}{v_0}$ từ phương trình toạ độ $x$ thế vào phương trình $y$:
$$y = \\frac{g}{2v_0^2} \\cdot x^2$$
Vì $g, v_0$ là hằng số nên phương trình quỹ đạo có dạng $y = ax^2$, chứng tỏ **quỹ đạo của chuyển động ném ngang là một nhánh của đường cong Parabol** đỉnh $O$.`,
            keyTakeaway: 'Quỹ đạo ném ngang là đường Parabol: y = (g / 2v₀²) x².',
            formulas: [
              {
                name: 'Phương trình toạ độ',
                latex: 'x = v_0 t, \\quad y = \\frac{1}{2}gt^2',
                description: 'Toạ độ vị trí vật ném ngang tại thời điểm t',
              },
              {
                name: 'Phương trình quỹ đạo Parabol',
                latex: 'y = \\frac{g}{2v_0^2} x^2',
                description: 'Phương trình quỹ đạo dạng parabol đỉnh O',
              },
              {
                name: 'Vận tốc toàn phần',
                latex: 'v = \\sqrt{v_0^2 + (gt)^2}',
                description: 'Tổng hợp vận tốc theo phương ngang và phương đứng',
                units: 'm/s',
              },
            ],
          },
          {
            title: '3. Thời gian chuyển động và Tầm xa',
            content: `Khi vật chạm đất thì toạ độ thẳng đứng $y = h$ (độ cao ban đầu).

### a) Thời gian chuyển động ($t$):
$$h = \\frac{1}{2}gt^2 \\implies t = \\sqrt{\\frac{2h}{g}}$$
* **Kết luận quan trọng**: Thời gian rơi của vật ném ngang chỉ phụ thuộc vào độ cao $h$ và gia tốc $g$, **hoàn toàn không phụ thuộc vào vận tốc ném $v_0$**.
* Nếu từ cùng một độ cao, ta đồng thời ném ngang một vật và thả rơi tự do một vật khác thì cả hai vật sẽ **chạm đất cùng một thời điểm**!

### b) Tầm xa ($L = x_{\\max}$):
Là khoảng cách xa nhất theo phương ngang mà vật đạt được khi chạm đất:
$$L = x_{\\max} = v_0 \\cdot t = v_0 \\sqrt{\\frac{2h}{g}}$$
Tầm xa tỉ lệ thuận với vận tốc ban đầu $v_0$ và căn bậc hai của độ cao $h$.`,
            keyTakeaway: 'Thời gian rơi t = √(2h/g) giống hệt rơi tự do! Tầm xa: L = v₀ √(2h/g).',
            formulas: [
              {
                name: 'Thời gian chuyển động',
                latex: 't = \\sqrt{\\frac{2h}{g}}',
                description: 'Thời gian bay đến khi chạm đất',
                units: 's',
              },
              {
                name: 'Tầm xa cực đại',
                latex: 'L = v_0 \\sqrt{\\frac{2h}{g}}',
                description: 'Khoảng cách bay xa nhất theo phương ngang',
                units: 'm',
              },
            ],
          },
          {
            title: '4. Giới thiệu Chuyển động ném xiên',
            content: `Khi vật được ném với góc nghiêng $\\theta$ so với mặt phẳng ngang:
* Vận tốc ban đầu phân tích thành:
  * $v_{0x} = v_0 \\cos \\theta$
  * $v_{0y} = v_0 \\sin \\theta$
* Trên trục $Ox$: Chuyển động thẳng đều với $x = (v_0 \\cos \\theta) t$.
* Trên trục $Oy$: Chuyển động biến đổi đều ngược chiều $g$ với $y = (v_0 \\sin \\theta) t - \\frac{1}{2}gt^2$.
* Tầm bay cao cực đại: $H = \\frac{v_0^2 \\sin^2 \\theta}{2g}$.
* Tầm bay xa trên mặt đất bằng: $L = \\frac{v_0^2 \\sin(2\\theta)}{g}$ (đạt cực đại khi góc ném $\\theta = 45^\\circ$).`,
          },
        ],
        summaryFormulas: [
          { name: 'Thời gian ném ngang', latex: 't = \\sqrt{\\frac{2h}{g}}' },
          { name: 'Tầm xa ném ngang', latex: 'L = v_0 \\sqrt{\\frac{2h}{g}}' },
          { name: 'Quỹ đạo ném ngang', latex: 'y = \\frac{g}{2v_0^2}x^2' },
          { name: 'Tầm xa ném xiên (mặt bằng)', latex: 'L = \\frac{v_0^2 \\sin 2\\theta}{g}' },
        ],
      },
    ],
  },
  {
    id: 'chuong-3',
    number: 3,
    romanNumeral: 'III',
    title: 'Động lực học',
    description: 'Các định luật Newton về chuyển động, tổng hợp phân tích lực, các loại lực trong tự nhiên và cân bằng vật rắn.',
    lessons: [
      {
        id: 'bai-13',
        chapterId: 'chuong-3',
        number: 13,
        title: 'Bài 13: Tổng hợp và phân tích lực. Cân bằng lực',
        shortDesc: 'Quy tắc hình bình hành, điều kiện cân bằng của chất điểm dưới tác dụng của nhiều lực.',
        labType: 'vector',
        labTitle: 'Mô phỏng Bàn tròn Đồng quy & Phân tích Lực',
        labDescription: 'Khám phá tổng hợp lực đồng quy và cân bằng lực trên hệ tọa độ trực giao.',
        sections: [
          {
            title: '1. Tổng hợp lực và Quy tắc hình bình hành',
            content: `Tổng hợp lực là thay thế nhiều lực tác dụng đồng thời vào một vật bằng một lực duy nhất có tác dụng tương đương.
Lực tổng hợp: $\\vec{F} = \\vec{F_1} + \\vec{F_2}$. Độ lớn: $F^2 = F_1^2 + F_2^2 + 2F_1 F_2 \\cos \\alpha$.`,
            keyTakeaway: 'Quy tắc hình bình hành áp dụng cho các đại lượng vectơ lực.',
          },
        ],
      },
      {
        id: 'bai-14',
        chapterId: 'chuong-3',
        number: 14,
        title: 'Bài 14: Định luật 1 Newton',
        shortDesc: 'Quán tính và định luật quán tính của Newton.',
        labType: 'motion',
        labTitle: 'Mô phỏng Quán tính & Đệm không khí',
        labDescription: 'Khám phá chuyển động khi lực tác dụng triệt tiêu hoàn toàn.',
        sections: [
          {
            title: '1. Định luật 1 Newton (Định luật Quán tính)',
            content: `Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.`,
            keyTakeaway: 'Quán tính là tính chất bảo toàn vận tốc của vật cả về hướng và độ lớn.',
          },
        ],
      },
      {
        id: 'bai-15',
        chapterId: 'chuong-3',
        number: 15,
        title: 'Bài 15: Định luật 2 Newton',
        shortDesc: 'Mối quan hệ giữa gia tốc, hợp lực tác dụng và khối lượng của vật: F = m.a.',
        labType: 'motion',
        labTitle: 'Kiểm chứng Định luật 2 Newton',
        labDescription: 'Đo gia tốc a phụ thuộc vào lực kéo F và khối lượng xe m.',
        sections: [
          {
            title: '1. Định luật 2 Newton',
            content: `Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực tác dụng và tỉ lệ nghịch với khối lượng của vật:
$$\\vec{a} = \\frac{\\vec{F}}{m} \\iff \\vec{F} = m\\vec{a}$$`,
            keyTakeaway: 'Phương trình cơ bản của động lực học: F = m.a.',
          },
        ],
      },
      {
        id: 'bai-16',
        chapterId: 'chuong-3',
        number: 16,
        title: 'Bài 16: Định luật 3 Newton',
        shortDesc: 'Lực và phản lực trong tương tác giữa hai vật: F_AB = - F_BA.',
        labType: 'motion',
        labTitle: 'Mô phỏng Lực và Phản lực giữa 2 xe va chạm',
        labDescription: 'Cảm biến lực ghi nhận lực tương tác trực đối giữa hai vật.',
        sections: [
          {
            title: '1. Định luật 3 Newton',
            content: `Trong mọi trường hợp, khi vật A tác dụng lên vật B một lực, thì vật B cũng tác dụng lại vật A một lực. Hai lực này là hai lực trực đối:
$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$`,
            keyTakeaway: 'Lực và phản lực luôn xuất hiện và mất đi đồng thời, cùng bản chất, đặt vào 2 vật khác nhau.',
          },
        ],
      },
    ],
  },
  {
    id: 'chuong-4',
    number: 4,
    romanNumeral: 'IV',
    title: 'Năng lượng, công, công suất',
    description: 'Công cơ học, công suất định mức, động năng, thế năng trọng trường, cơ năng và định luật bảo toàn cơ năng.',
    lessons: [
      {
        id: 'bai-23',
        chapterId: 'chuong-4',
        number: 23,
        title: 'Bài 23: Năng lượng. Công cơ học',
        shortDesc: 'Định nghĩa công cơ học: A = F.s.cos(alpha) và đơn vị Joule (J).',
        labType: 'motion',
        labTitle: 'Tính công cơ học trên mặt phẳng nghiêng',
        labDescription: 'Khám phá sự phụ thuộc của công phát động và công cản vào góc nghiêng.',
        sections: [
          {
            title: '1. Công cơ học',
            content: `Công của lực không đổi làm dịch chuyển một quãng đường $s$:
$$A = F \\cdot s \\cdot \\cos \\alpha$$
* $\\alpha < 90^\\circ$: Công phát động ($A > 0$).
* $\\alpha = 90^\\circ$: Lực không sinh công ($A = 0$).
* $\\alpha > 90^\\circ$: Công cản ($A < 0$).`,
            keyTakeaway: 'Đơn vị công: Joule (1 J = 1 N.m).',
          },
        ],
      },
      {
        id: 'bai-24',
        chapterId: 'chuong-4',
        number: 24,
        title: 'Bài 24: Công suất & Hiệu suất',
        shortDesc: 'Tốc độ sinh công: P = A / t = F.v và hiệu suất năng lượng H = A_ci / A_tp.',
        labType: 'motion',
        labTitle: 'Đo công suất động cơ điện',
        labDescription: 'Đánh giá công suất tức thời và hiệu suất cơ học.',
        sections: [
          {
            title: '1. Công suất',
            content: `Công suất là đại lượng đặc trưng cho tốc độ thực hiện công:
$$\\mathcal{P} = \\frac{A}{t} = F \\cdot v$$
Đơn vị công suất là Oát (W), $1\\text{ W} = 1\\text{ J/s}$.`,
            keyTakeaway: 'P = A / t = F.v.',
          },
        ],
      },
      {
        id: 'bai-26',
        chapterId: 'chuong-4',
        number: 26,
        title: 'Bài 26: Cơ năng và Định luật bảo toàn cơ năng',
        shortDesc: 'Cơ năng của vật trong trọng trường: W = Wd + Wt. Bảo toàn cơ năng khi chỉ có lực thế.',
        labType: 'freefall',
        labTitle: 'Bảo toàn Cơ năng của Con lắc đơn & Rơi tự do',
        labDescription: 'Theo dõi sự chuyển hóa qua lại giữa thế năng Wt và động năng Wd.',
        sections: [
          {
            title: '1. Định luật bảo toàn cơ năng',
            content: `Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực thì cơ năng của vật là một đại lượng bảo toàn:
$$W = W_đ + W_t = \\frac{1}{2}mv^2 + mgz = \\text{hằng số}$$`,
            keyTakeaway: 'Cơ năng bảo toàn khi không có ma sát hoặc lực cản tiêu tán.',
          },
        ],
      },
    ],
  },
  {
    id: 'chuong-5',
    number: 5,
    romanNumeral: 'V',
    title: 'Động lượng',
    description: 'Định nghĩa động lượng, xung lượng của lực, định luật bảo toàn động lượng và ứng dụng trong va chạm cơ học.',
    lessons: [
      {
        id: 'bai-28',
        chapterId: 'chuong-5',
        number: 28,
        title: 'Bài 28: Động lượng & Xung lượng của lực',
        shortDesc: 'Vectơ động lượng p = m.v và độ biến thiên động lượng Delta p = F.Delta t.',
        labType: 'motion',
        labTitle: 'Đo động lượng của hai xe va chạm trên đệm khí',
        labDescription: 'Kiểm chứng mối liên hệ giữa xung lượng của lực và độ biến thiên động lượng.',
        sections: [
          {
            title: '1. Động lượng',
            content: `Động lượng của một vật khối lượng $m$ chuyển động với vận tốc $\\vec{v}$ là đại lượng vectơ:
$$\\vec{p} = m\\vec{v}$$
Đơn vị: $\\text{kg}\\cdot\\text{m/s}$.`,
            keyTakeaway: 'Động lượng cùng hướng với vận tốc của vật.',
          },
        ],
      },
      {
        id: 'bai-29',
        chapterId: 'chuong-5',
        number: 29,
        title: 'Bài 29: Định luật bảo toàn động lượng',
        shortDesc: 'Bảo toàn động lượng của hệ kín (cô lập): p_he = const. Va chạm mềm và va chạm đàn hồi.',
        labType: 'motion',
        labTitle: 'Thực hành Va chạm đàn hồi & Va chạm mềm',
        labDescription: 'Kiểm chứng nguyên lí chuyển động bằng phản lực và súng giật.',
        sections: [
          {
            title: '1. Định luật bảo toàn động lượng của hệ kín',
            content: `Tổng động lượng của một hệ kín là một đại lượng bảo toàn:
$$\\vec{p}_1 + \\vec{p}_2 + \\dots + \\vec{p}_n = \\text{hằng số}$$`,
            keyTakeaway: 'Áp dụng cho va chạm, chuyển động bằng phản lực của tên lửa.',
          },
        ],
      },
    ],
  },
  {
    id: 'chuong-6',
    number: 6,
    romanNumeral: 'VI',
    title: 'Chuyển động tròn',
    description: 'Tốc độ góc, chu kì, tần số, gia tốc hướng tâm và lực hướng tâm giữ vật chuyển động tròn đều.',
    lessons: [
      {
        id: 'bai-31',
        chapterId: 'chuong-6',
        number: 31,
        title: 'Bài 31: Động học của chuyển động tròn đều',
        shortDesc: 'Độ dịch chuyển góc, tốc độ góc omega, chu kì T, tần số f và liên hệ v = omega.r.',
        labType: 'motion',
        labTitle: 'Mô phỏng Bàn quay Tròn đều & Tốc độ góc',
        labDescription: 'Quan sát vệt quét của vật trên đĩa quay ở các bán kính khác nhau.',
        sections: [
          {
            title: '1. Đặc trưng của chuyển động tròn đều',
            content: `* Tốc độ góc: $\\omega = \\frac{\\Delta \\theta}{\\Delta t}$ (đơn vị: $\\text{rad/s}$).
* Chu kì: $T = \\frac{2\\pi}{\\omega}$; Tần số: $f = \\frac{1}{T}$.
* Hệ thức liên hệ: $v = \\omega \\cdot r$.`,
            keyTakeaway: 'Tốc độ dài tỉ lệ thuận với bán kính quỹ đạo khi tốc độ góc không đổi.',
          },
        ],
      },
      {
        id: 'bai-32',
        chapterId: 'chuong-6',
        number: 32,
        title: 'Bài 32: Lực hướng tâm và Gia tốc hướng tâm',
        shortDesc: 'Gia tốc hướng tâm a_ht = v^2 / r = omega^2 . r và lực hướng tâm F_ht = m.a_ht.',
        labType: 'motion',
        labTitle: 'Lực căng dây của vật chuyển động tròn trong mặt phẳng đứng',
        labDescription: 'Quan sát vectơ gia tốc luôn hướng vào tâm quỹ đạo.',
        sections: [
          {
            title: '1. Lực hướng tâm',
            content: `Hợp lực của các lực tác dụng lên vật chuyển động tròn đều hướng vào tâm quỹ đạo gọi là lực hướng tâm:
$$F_{ht} = m a_{ht} = m \\frac{v^2}{r} = m \\omega^2 r$$`,
            keyTakeaway: 'Lực hướng tâm không phải là loại lực mới mà là hợp lực của các lực tác dụng lên vật.',
          },
        ],
      },
    ],
  },
  {
    id: 'chuong-7',
    number: 7,
    romanNumeral: 'VII',
    title: 'Biến dạng của vật rắn. Áp suất chất lỏng',
    description: 'Biến dạng đàn hồi của lò xo, định luật Hooke, khối lượng riêng và áp suất chất lỏng tác dụng lên đáy bình.',
    lessons: [
      {
        id: 'bai-33',
        chapterId: 'chuong-7',
        number: 33,
        title: 'Bài 33: Biến dạng của vật rắn. Định luật Hooke',
        shortDesc: 'Độ biến dạng Delta l, giới hạn đàn hồi và lực đàn hồi F_dh = k.|Delta l|.',
        labType: 'motion',
        labTitle: 'Thí nghiệm Treo quả nặng Kiểm chứng Định luật Hooke',
        labDescription: 'Đo độ giãn Delta l của lò xo theo trọng lượng quả nặng treo vào.',
        sections: [
          {
            title: '1. Định luật Hooke',
            content: `Trong giới hạn đàn hồi, lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của lò xo:
$$F_{đh} = k \\cdot |\\Delta l|$$
với $k$ là độ cứng của lò xo (đơn vị: $\\text{N/m}$).`,
            keyTakeaway: 'Định luật Hooke: F_dh = k . |Δl|.',
          },
        ],
      },
      {
        id: 'bai-34',
        chapterId: 'chuong-7',
        number: 34,
        title: 'Bài 34: Khối lượng riêng. Áp suất chất lỏng',
        shortDesc: 'Công thức tính áp suất thủy tĩnh p = p_0 + rho.g.h và lực đẩy Archimedes.',
        labType: 'motion',
        labTitle: 'Đo Áp suất Chất lỏng ở các độ sâu khác nhau',
        labDescription: 'Quan sát màng cao su biến dạng dưới áp lực chất lỏng.',
        sections: [
          {
            title: '1. Áp suất chất lỏng',
            content: `Áp suất ở độ sâu $h$ trong lòng chất lỏng có khối lượng riêng $\\rho$:
$$p = p_a + \\rho \\cdot g \\cdot h$$
với $p_a$ là áp suất khí quyển. Áp suất chất lỏng tác dụng theo mọi phương lên vật nhúng trong nó.`,
            keyTakeaway: 'Áp suất tăng tuyến tính theo độ sâu h.',
          },
        ],
      },
    ],
  },
];

export const chaptersData: Chapter[] = rawChaptersData.map((ch) => ({
  ...ch,
  lessons: ch.lessons.map((lesson): Lesson => {
    const rawSections = lesson.sections || lesson.theorySections || [];
    const sections =
      rawSections.length > 0
        ? rawSections
        : [
            {
              title: '1. Nội dung trọng tâm',
              content: lesson.shortDesc || 'Nội dung đang được cập nhật theo chuẩn SGK Vật lí 10...',
              keyTakeaway: lesson.title,
            },
          ];

    const theory: LessonTheory = {
      title: lesson.title ?? 'Lý thuyết trọng tâm',
      summary: lesson.description || lesson.shortDesc || 'Nội dung đang được cập nhật...',
      content: sections.map((s) => s.content).join('\n\n') || 'Nội dung đang được cập nhật...',
      sections,
      formulas: lesson.summaryFormulas || [],
      keyTakeaways: sections
        .map((s) => s.keyTakeaway)
        .filter((k): k is string => Boolean(k)),
      ...lesson.theory,
    };

    const labSpec = lesson.virtualLabSpec;
    const virtualLab: LessonVirtualLab = {
      id: `${lesson.id}-lab`,
      title: lesson.labTitle || labSpec?.experimentName || `Thí nghiệm mô phỏng: ${lesson.title}`,
      description:
        lesson.labDescription || labSpec?.purpose || 'Khám phá quy luật vật lí qua mô phỏng tương tác.',
      labType: lesson.labType || 'motion',
      experimentName: labSpec?.experimentName || lesson.labTitle || `Thí nghiệm: ${lesson.title}`,
      purpose: labSpec?.purpose || lesson.labDescription || 'Kiểm chứng các quy luật vật lí định lượng.',
      equipmentAndSteps: labSpec?.equipmentAndSteps || [
        '1. Quan sát trạng thái ban đầu của hệ thống.',
        '2. Điều chỉnh các thông số vật lí thực nghiệm.',
        '3. Tiến hành đo đạc và so sánh với công thức lý thuyết.',
      ],
      physicsNatureAndLogic:
        labSpec?.physicsNatureAndLogic ||
        (lesson.shortDesc || 'Kiểm chứng các quy luật vật lí định lượng theo chuẩn SGK Vật lí 10.'),
      expectedResults: labSpec?.expectedResults || {
        positive: 'Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.',
        negative: 'Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm.',
      },
      ...lesson.virtualLab,
    };

    const questions = quizzesData[lesson.id] || [
      {
        id: `${lesson.id}-default-1`,
        question: `Nội dung trọng tâm của ${lesson.title} đề cập đến quy luật vật lí nào?`,
        options: [
          lesson.shortDesc || 'Quy luật vật lí cơ bản',
          'Hiện tượng không có trong chương trình',
          'Các định luật hóa học',
          'Hiện tượng sinh học',
        ],
        correctAnswer: 0,
        explanation: `Theo SGK Vật lí 10, ${lesson.title} trang bị kiến thức về: ${lesson.shortDesc || lesson.title}.`,
        difficulty: 'easy' as const,
      },
    ];

    const practice: LessonPractice = {
      title: `Bài tập trắc nghiệm: ${lesson.title}`,
      description: `Hệ thống câu hỏi trắc nghiệm kiểm tra và củng cố kiến thức cho ${lesson.title}.`,
      questions,
      ...lesson.practice,
    };

    return {
      ...lesson,
      hasLab: lesson.hasLab ?? true,
      description: lesson.description || lesson.shortDesc || 'Nội dung đang được cập nhật...',
      sections,
      virtualLabSpec: labSpec || {
        experimentName: virtualLab.experimentName,
        purpose: virtualLab.purpose,
        equipmentAndSteps: virtualLab.equipmentAndSteps,
        physicsNatureAndLogic: virtualLab.physicsNatureAndLogic,
        expectedResults: virtualLab.expectedResults,
      },
      theory,
      virtualLab,
      practice,
    };
  }),
}));


