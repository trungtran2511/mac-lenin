export const PHILOSOPHY_PROFILE_STORAGE_KEY = "philosophy_profile_last_result";

export const philosophyProfileGroups = {
  dialecticalMaterialism: {
    label: "Duy vật biện chứng",
    shortLabel: "Duy vật BC",
    color: "#007d84",
  },
  idealism: {
    label: "Duy tâm",
    shortLabel: "Duy tâm",
    color: "#7b4bc2",
  },
  dialectics: {
    label: "Biện chứng",
    shortLabel: "Biện chứng",
    color: "#d85c4a",
  },
  metaphysics: {
    label: "Siêu hình",
    shortLabel: "Siêu hình",
    color: "#52616b",
  },
  praxis: {
    label: "Thực tiễn luận",
    shortLabel: "Thực tiễn",
    color: "#f2b441",
  },
};

export const philosophyProfiles = {
  dialecticalMaterialism: {
    name: "Nhà duy vật biện chứng tỉnh táo",
    badge: "Tư duy hệ thống",
    description:
      "Bạn thường nhìn vấn đề từ điều kiện thực tế, quan hệ giữa các mặt và sự vận động của hoàn cảnh. Bạn không dễ bị cuốn vào cảm tính đơn lẻ, nhưng vẫn đủ linh hoạt để thấy mọi thứ đang thay đổi.",
    strengths: [
      "Biết nối dữ kiện với bối cảnh.",
      "Có xu hướng phân tích nguyên nhân sâu hơn bề mặt.",
      "Dễ học tốt các phần quy luật, phạm trù và phương pháp luận.",
    ],
    improvements: [
      "Tránh phân tích quá lâu rồi chậm hành động.",
      "Nên dùng ví dụ đời sống để giữ kiến thức bớt khô.",
    ],
    studyTips:
      "Học theo sơ đồ quan hệ: khái niệm, điều kiện, mâu thuẫn, vận động, kết quả. Sau mỗi mục hãy tự hỏi: nó xuất hiện trong đời sống ở đâu?",
  },
  idealism: {
    name: "Người kể chuyện duy tâm",
    badge: "Tư duy ý niệm",
    description:
      "Bạn nhạy với niềm tin, ý nghĩa, động lực tinh thần và góc nhìn cá nhân. Khi gặp vấn đề, bạn thường bắt đầu từ thái độ, cảm nhận hoặc câu chuyện bên trong con người.",
    strengths: [
      "Dễ nhớ lý thuyết qua câu chuyện và hình ảnh.",
      "Có khả năng diễn đạt mềm, giàu liên tưởng.",
      "Hợp với phần thế giới quan, ý thức và vai trò tinh thần.",
    ],
    improvements: [
      "Cần kiểm tra ý tưởng bằng dữ kiện cụ thể hơn.",
      "Tránh biến cảm nhận cá nhân thành kết luận chung quá nhanh.",
    ],
    studyTips:
      "Hãy học bằng ví dụ nhân vật, trích dẫn và tình huống. Sau đó đối chiếu lại với định nghĩa giáo trình để cân bằng giữa cảm hứng và khái niệm.",
  },
  dialectics: {
    name: "Thợ săn mâu thuẫn",
    badge: "Tư duy biến đổi",
    description:
      "Bạn nhìn thấy sự đối lập, chuyển hóa và phát triển khá nhanh. Với bạn, một vấn đề thú vị không nằm ở trạng thái đứng yên mà ở quá trình nó biến đổi.",
    strengths: [
      "Nhạy với mâu thuẫn chính và phụ.",
      "Dễ hiểu các quy luật lượng - chất, mâu thuẫn, phủ định.",
      "Có khả năng nhìn hai mặt của một tình huống.",
    ],
    improvements: [
      "Đừng biến mọi chuyện thành xung đột cần giải quyết ngay.",
      "Nên bổ sung dữ kiện thực tế trước khi kết luận xu hướng phát triển.",
    ],
    studyTips:
      "Học bằng timeline, trước - sau, nguyên nhân - bước ngoặt - kết quả. Mỗi bài nên tự tạo một ví dụ về sự chuyển hóa.",
  },
  metaphysics: {
    name: "Người phân loại siêu hình",
    badge: "Tư duy rõ ràng",
    description:
      "Bạn thích ranh giới rõ, định nghĩa gọn và câu trả lời chắc. Cách học của bạn có lợi khi cần hệ thống hóa, nhưng đôi lúc dễ làm vấn đề sống động trở nên hơi cứng.",
    strengths: [
      "Giỏi chia nhóm, lập bảng và ghi nhớ định nghĩa.",
      "Phù hợp với việc ôn thi nhanh.",
      "Ít bị rối khi gặp nhiều thuật ngữ gần nhau.",
    ],
    improvements: [
      "Cần luyện nhìn sự vật trong quan hệ và vận động.",
      "Tránh học thuộc mà bỏ qua ví dụ biến đổi thực tế.",
    ],
    studyTips:
      "Bắt đầu bằng bảng so sánh để nắm khung, sau đó thêm cột ví dụ, điều kiện lịch sử và sự chuyển hóa để tư duy mềm hơn.",
  },
  praxis: {
    name: "Chiến binh thực tiễn luận",
    badge: "Tư duy hành động",
    description:
      "Bạn tin vào kiểm nghiệm, trải nghiệm và kết quả. Khi học triết, bạn muốn biết khái niệm này dùng được gì, giải thích đời sống ra sao và có giúp hành động tốt hơn không.",
    strengths: [
      "Dễ biến lý thuyết thành ví dụ cụ thể.",
      "Hợp với phần thực tiễn, nhận thức, chân lý và vận dụng.",
      "Có động lực học khi thấy kiến thức gắn với đời sống.",
    ],
    improvements: [
      "Đừng bỏ qua phần định nghĩa vì thấy nó quá trừu tượng.",
      "Nên ghi lại khái niệm gốc trước khi áp dụng.",
    ],
    studyTips:
      "Học theo công thức: khái niệm ngắn, ví dụ thật, bài học vận dụng. Mỗi chủ đề hãy tự viết một tình huống đời sống để kiểm tra hiểu bài.",
  },
};

export const philosophyProfileQuestions = [
  {
    id: "q01",
    question: "Khi nhóm làm bài bị trễ deadline, phản ứng tự nhiên của bạn là gì?",
    options: [
      {
        text: "Tìm nguyên nhân trong cách chia việc, nguồn lực và quy trình.",
        scores: { dialecticalMaterialism: 2, praxis: 1 },
      },
      {
        text: "Xem tinh thần nhóm đang xuống ở đâu rồi động viên lại.",
        scores: { idealism: 2, praxis: 1 },
      },
      {
        text: "Chỉ ra mâu thuẫn chính khiến mọi người kẹt.",
        scores: { dialectics: 2, dialecticalMaterialism: 1 },
      },
      {
        text: "Tách từng lỗi riêng lẻ để xử lý cho gọn.",
        scores: { metaphysics: 2 },
      },
    ],
  },
  {
    id: "q02",
    question: "Bạn học một khái niệm triết khó bằng cách nào?",
    options: [
      {
        text: "Đọc định nghĩa, tìm điều kiện xuất hiện và quan hệ với khái niệm khác.",
        scores: { dialecticalMaterialism: 2, dialectics: 1 },
      },
      {
        text: "Tìm một câu chuyện hoặc hình ảnh giúp mình cảm được ý nghĩa.",
        scores: { idealism: 2 },
      },
      {
        text: "Vẽ sơ đồ trước - sau để thấy nó biến đổi thế nào.",
        scores: { dialectics: 2 },
      },
      {
        text: "Lấy ví dụ đời sống rồi thử dùng khái niệm để giải thích.",
        scores: { praxis: 2, dialecticalMaterialism: 1 },
      },
    ],
  },
  {
    id: "q03",
    question: "Nếu một người nói: 'Chỉ cần nghĩ tích cực là mọi chuyện ổn', bạn sẽ...",
    options: [
      {
        text: "Hỏi thêm điều kiện vật chất và hoàn cảnh cụ thể.",
        scores: { dialecticalMaterialism: 2, praxis: 1 },
      },
      {
        text: "Đồng ý một phần vì tinh thần có sức ảnh hưởng lớn.",
        scores: { idealism: 2 },
      },
      {
        text: "Nói rằng tích cực cũng cần chuyển hóa thành hành động.",
        scores: { praxis: 2, dialectics: 1 },
      },
      {
        text: "Tách rõ: tinh thần là tinh thần, kết quả là kết quả.",
        scores: { metaphysics: 2 },
      },
    ],
  },
  {
    id: "q04",
    question: "Một thói quen xấu muốn sửa mãi chưa được. Bạn nghĩ điểm mấu chốt là...",
    options: [
      {
        text: "Phải thay đổi dần lượng nhỏ đến khi tạo bước nhảy.",
        scores: { dialectics: 2, praxis: 1 },
      },
      {
        text: "Phải hiểu môi trường, lịch sinh hoạt và nguyên nhân khách quan.",
        scores: { dialecticalMaterialism: 2 },
      },
      {
        text: "Phải đổi niềm tin bên trong trước đã.",
        scores: { idealism: 2 },
      },
      {
        text: "Phải đặt luật cố định, sai là phạt.",
        scores: { metaphysics: 2, praxis: 1 },
      },
    ],
  },
  {
    id: "q05",
    question: "Khi tranh luận, bạn hay bị hấp dẫn bởi kiểu lập luận nào?",
    options: [
      {
        text: "Có bằng chứng, có bối cảnh, có quan hệ nhân quả.",
        scores: { dialecticalMaterialism: 2, praxis: 1 },
      },
      {
        text: "Có giá trị, lý tưởng và ý nghĩa nhân văn.",
        scores: { idealism: 2 },
      },
      {
        text: "Có hai mặt đối lập và hướng giải quyết mâu thuẫn.",
        scores: { dialectics: 2 },
      },
      {
        text: "Có định nghĩa rõ, phạm vi rõ, kết luận rõ.",
        scores: { metaphysics: 2 },
      },
    ],
  },
  {
    id: "q06",
    question: "Bạn chọn ví dụ nào đúng vibe 'lượng đổi dẫn đến chất đổi' nhất?",
    options: [
      {
        text: "Học đều mỗi ngày đến lúc tự nhiên hiểu sâu hơn.",
        scores: { dialectics: 2, praxis: 1 },
      },
      {
        text: "Một ý tưởng lớn làm thay đổi toàn bộ con người.",
        scores: { idealism: 2 },
      },
      {
        text: "Điều kiện học tập thay đổi làm kết quả học thay đổi.",
        scores: { dialecticalMaterialism: 2 },
      },
      {
        text: "Chia bài thành từng mục cố định để học cho chắc.",
        scores: { metaphysics: 2 },
      },
    ],
  },
  {
    id: "q07",
    question: "Khi gặp một hiện tượng xã hội đang hot, bạn muốn hỏi gì trước?",
    options: [
      {
        text: "Nó xuất phát từ điều kiện kinh tế, xã hội nào?",
        scores: { dialecticalMaterialism: 2 },
      },
      {
        text: "Nó phản ánh niềm tin hoặc tâm lý đám đông nào?",
        scores: { idealism: 2 },
      },
      {
        text: "Mâu thuẫn nào đang bộc lộ qua hiện tượng này?",
        scores: { dialectics: 2 },
      },
      {
        text: "Có số liệu hay trải nghiệm nào kiểm chứng không?",
        scores: { praxis: 2 },
      },
    ],
  },
  {
    id: "q08",
    question: "Bạn làm slide thuyết trình triết, phần bạn muốn phụ trách là...",
    options: [
      {
        text: "Khung lý thuyết và liên hệ các phần với nhau.",
        scores: { dialecticalMaterialism: 2 },
      },
      {
        text: "Câu chuyện mở đầu, quote và phần truyền cảm hứng.",
        scores: { idealism: 2 },
      },
      {
        text: "Sơ đồ quá trình phát triển và các bước chuyển.",
        scores: { dialectics: 2 },
      },
      {
        text: "Ví dụ thực tế, mini game và câu hỏi tương tác.",
        scores: { praxis: 2 },
      },
    ],
  },
  {
    id: "q09",
    question: "Nếu phải ôn thi trong một buổi tối, bạn ưu tiên gì?",
    options: [
      {
        text: "Nắm logic chung rồi suy ra từng phần.",
        scores: { dialecticalMaterialism: 2, dialectics: 1 },
      },
      {
        text: "Học các ý có thể kể lại mạch lạc.",
        scores: { idealism: 1, metaphysics: 1 },
      },
      {
        text: "Lập bảng định nghĩa, đặc điểm, ý nghĩa.",
        scores: { metaphysics: 2 },
      },
      {
        text: "Làm quiz thật nhiều để biết mình sai ở đâu.",
        scores: { praxis: 2 },
      },
    ],
  },
  {
    id: "q10",
    question: "Bạn thấy câu nào gần với mình nhất?",
    options: [
      {
        text: "Muốn hiểu con người phải nhìn cả hoàn cảnh sống của họ.",
        scores: { dialecticalMaterialism: 2 },
      },
      {
        text: "Một niềm tin đúng lúc có thể kéo người ta đứng dậy.",
        scores: { idealism: 2 },
      },
      {
        text: "Không có vấn đề nào đứng yên; nó luôn đang chuyển hóa.",
        scores: { dialectics: 2 },
      },
      {
        text: "Lý thuyết phải bước ra thực tế mới đáng tin.",
        scores: { praxis: 2 },
      },
    ],
  },
  {
    id: "q11",
    question: "Khi một kế hoạch thất bại, bạn rút kinh nghiệm bằng cách...",
    options: [
      {
        text: "Phân tích điều kiện khách quan và chủ quan.",
        scores: { dialecticalMaterialism: 2 },
      },
      {
        text: "Nhìn lại động lực, mục tiêu và sự cam kết.",
        scores: { idealism: 2 },
      },
      {
        text: "Tìm điểm xung đột khiến kế hoạch đổi hướng.",
        scores: { dialectics: 2 },
      },
      {
        text: "Test lại giả định bằng hành động nhỏ hơn.",
        scores: { praxis: 2 },
      },
    ],
  },
  {
    id: "q12",
    question: "Một người bạn hỏi 'học triết để làm gì?', bạn trả lời...",
    options: [
      {
        text: "Để có phương pháp nhìn đời sống trong quan hệ và vận động.",
        scores: { dialecticalMaterialism: 2, dialectics: 1 },
      },
      {
        text: "Để hiểu ý nghĩa, niềm tin và cách con người suy nghĩ.",
        scores: { idealism: 2 },
      },
      {
        text: "Để thấy mâu thuẫn không đáng sợ, nó là động lực phát triển.",
        scores: { dialectics: 2 },
      },
      {
        text: "Để giải quyết việc thật tốt hơn, không chỉ học thuộc.",
        scores: { praxis: 2 },
      },
    ],
  },
];
