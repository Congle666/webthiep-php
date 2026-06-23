/** Đa ngôn ngữ cho thiệp cưới — thêm ngôn ngữ mới bằng cách thêm key vào LANGS + bản dịch vào TRANSLATIONS. */

export type Lang = 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'fr' | 'es' | 'ar' | 'ru' | 'id' | 'de' | 'zh-tw';

export interface LangMeta {
  code: Lang;
  label: string;   // tên hiển thị trong dropdown (ngôn ngữ gốc)
  flag: string;    // emoji cờ
}

export const LANGS: LangMeta[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'zh', label: '中文',        flag: '🇨🇳' },
  { code: 'ko', label: '한국어',      flag: '🇰🇷' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'es',    label: 'Español',          flag: '🇪🇸' },
  { code: 'ar',    label: 'العربية',           flag: '🇸🇦' },
  { code: 'ru',    label: 'Русский',           flag: '🇷🇺' },
  { code: 'id',    label: 'Bahasa Indonesia',  flag: '🇮🇩' },
  { code: 'de',    label: 'Deutsch',           flag: '🇩🇪' },
  { code: 'zh-tw', label: '繁體中文',           flag: '🇹🇼' },
];

export interface InvI18n {
  // Cover gate
  coverInvite: string;        // "Thân Mời" / "Dear"
  coverSub: string;           // "đến dự buổi tiệc chung vui..."
  coverOpen: string;          // "Mở thiệp"
  // Couple section
  groomTitle: string;         // "Chú Rể"
  brideTitle: string;         // "Cô Dâu"
  coupleAnnounce: string;     // "TRÂN TRỌNG BÁO TIN..."
  // Time section
  ceremonyAt: string;         // "TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC"
  reception: string;          // "ĐÓN KHÁCH"
  banquet: string;            // "KHAI TIỆC"
  monthLabel: string;         // "THÁNG" — dùng trước số tháng
  // Countdown
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  countdownTitle: string;     // "Đếm ngược"
  // Venue
  venueTitle: string;         // "TIỆC CƯỚI SẼ TỔ CHỨC TẠI"
  openMap: string;            // "Mở bản đồ"
  addToCalendar: string;      // "Thêm vào lịch"
  // Family
  familyTitle: string;        // "THÔNG TIN LỄ CƯỚI"
  groomSide: string;          // "Nhà Trai"
  brideSide: string;          // "Nhà Gái"
  // Gallery
  galleryTitle: string;       // "ALBUM ẢNH CƯỚI"
  // Dress code
  dressCodeTitle: string;
  // Schedule
  scheduleTitle: string;      // "LỊCH TRÌNH NGÀY CƯỚI"
  // Gift QR
  giftTitle: string;          // "QR MỪNG CƯỚI"
  // RSVP
  rsvpTitle: string;          // "XÁC NHẬN THAM DỰ"
  rsvpNamePlaceholder: string;
  rsvpAttendYes: string;
  rsvpAttendMaybe: string;
  rsvpAttendNo: string;
  rsvpGuestCount: string;
  rsvpMessagePlaceholder: string;
  rsvpSubmit: string;
  rsvpSubmitting: string;
  rsvpSuccess: string;
  rsvpSuccessSub: string;
  rsvpErrName: string;
  rsvpErrGeneric: string;
  // Guestbook
  guestbookTitle: string;     // "SỔ LƯU BÚT"
  guestbookNamePlaceholder: string;
  guestbookMsgPlaceholder: string;
  guestbookSubmit: string;
  guestbookSubmitting: string;
  guestbookEmpty: string;
  guestbookErrFields: string;
  guestbookErrGeneric: string;
  guestbookJustNow: string;
  // Thanks
  thanksTitle: string;
  // Footer
  footerDefault: string;
  footerBrand: string;
}

const vi: InvI18n = {
  coverInvite: 'Thân Mời',
  coverSub: 'đến dự buổi tiệc chung vui cùng gia đình',
  coverOpen: 'Mở Thiệp',
  groomTitle: 'Chú Rể',
  brideTitle: 'Cô Dâu',
  coupleAnnounce: 'TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CHÚNG TÔI',
  ceremonyAt: 'TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC',
  reception: 'ĐÓN KHÁCH',
  banquet: 'KHAI TIỆC',
  monthLabel: 'THÁNG',
  days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây',
  countdownTitle: 'Đếm ngược',
  venueTitle: 'TIỆC CƯỚI SẼ TỔ CHỨC TẠI',
  openMap: 'Mở bản đồ',
  addToCalendar: 'Thêm vào lịch',
  familyTitle: 'THÔNG TIN LỄ CƯỚI',
  groomSide: 'Nhà Trai',
  brideSide: 'Nhà Gái',
  galleryTitle: 'ALBUM ẢNH CƯỚI',
  dressCodeTitle: 'DRESS CODE',
  scheduleTitle: 'LỊCH TRÌNH NGÀY CƯỚI',
  giftTitle: 'QR MỪNG CƯỚI',
  rsvpTitle: 'XÁC NHẬN THAM DỰ',
  rsvpNamePlaceholder: 'Tên của bạn',
  rsvpAttendYes: 'Sẽ tham dự',
  rsvpAttendMaybe: 'Chưa chắc',
  rsvpAttendNo: 'Không thể đến',
  rsvpGuestCount: 'Số người tham dự',
  rsvpMessagePlaceholder: 'Lời nhắn (không bắt buộc)',
  rsvpSubmit: 'Xác nhận',
  rsvpSubmitting: 'Đang gửi...',
  rsvpSuccess: 'Cảm ơn bạn đã xác nhận!',
  rsvpSuccessSub: 'Hẹn gặp bạn trong ngày vui của chúng tôi.',
  rsvpErrName: 'Vui lòng nhập tên của bạn.',
  rsvpErrGeneric: 'Có lỗi xảy ra, thử lại nhé.',
  guestbookTitle: 'SỔ LƯU BÚT',
  guestbookNamePlaceholder: 'Tên của bạn',
  guestbookMsgPlaceholder: 'Gửi lời chúc tới cô dâu chú rể...',
  guestbookSubmit: 'Gửi lời chúc',
  guestbookSubmitting: 'Đang gửi...',
  guestbookEmpty: 'Hãy là người đầu tiên gửi lời chúc!',
  guestbookErrFields: 'Nhập tên và lời chúc nhé.',
  guestbookErrGeneric: 'Có lỗi xảy ra.',
  guestbookJustNow: 'Vừa xong',
  thanksTitle: 'LỜI CẢM ƠN',
  footerDefault: 'Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.',
  footerBrand: 'Thiệp tạo bởi JunTech',
};

const en: InvI18n = {
  coverInvite: 'Dear',
  coverSub: 'You are cordially invited to celebrate with our family',
  coverOpen: 'Open Invitation',
  groomTitle: 'Groom',
  brideTitle: 'Bride',
  coupleAnnounce: 'WE JOYFULLY ANNOUNCE\nOUR WEDDING CELEBRATION',
  ceremonyAt: 'THE WEDDING CEREMONY WILL BE HELD AT',
  reception: 'RECEPTION',
  banquet: 'DINNER',
  monthLabel: 'MONTH',
  days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs',
  countdownTitle: 'Countdown',
  venueTitle: 'WEDDING VENUE',
  openMap: 'Open map',
  addToCalendar: 'Add to calendar',
  familyTitle: 'WEDDING INFORMATION',
  groomSide: "Groom's Family",
  brideSide: "Bride's Family",
  galleryTitle: 'WEDDING ALBUM',
  dressCodeTitle: 'DRESS CODE',
  scheduleTitle: 'WEDDING DAY TIMELINE',
  giftTitle: 'WEDDING GIFT',
  rsvpTitle: 'RSVP',
  rsvpNamePlaceholder: 'Your name',
  rsvpAttendYes: 'Will attend',
  rsvpAttendMaybe: 'Maybe',
  rsvpAttendNo: 'Cannot attend',
  rsvpGuestCount: 'Number of guests',
  rsvpMessagePlaceholder: 'Message (optional)',
  rsvpSubmit: 'Confirm',
  rsvpSubmitting: 'Sending...',
  rsvpSuccess: 'Thank you for your RSVP!',
  rsvpSuccessSub: 'We look forward to celebrating with you.',
  rsvpErrName: 'Please enter your name.',
  rsvpErrGeneric: 'Something went wrong. Please try again.',
  guestbookTitle: 'GUESTBOOK',
  guestbookNamePlaceholder: 'Your name',
  guestbookMsgPlaceholder: 'Send your wishes to the couple...',
  guestbookSubmit: 'Send wishes',
  guestbookSubmitting: 'Sending...',
  guestbookEmpty: 'Be the first to send your wishes!',
  guestbookErrFields: 'Please enter your name and message.',
  guestbookErrGeneric: 'Something went wrong.',
  guestbookJustNow: 'Just now',
  thanksTitle: 'THANK YOU',
  footerDefault: 'Your presence is the greatest gift to our family.',
  footerBrand: 'Invitation by JunTech',
};

const zh: InvI18n = {
  coverInvite: '诚邀',
  coverSub: '敬请光临我们的婚礼庆典',
  coverOpen: '打开请柬',
  groomTitle: '新郎',
  brideTitle: '新娘',
  coupleAnnounce: '谨订于下列吉日\n举行婚礼庆典',
  ceremonyAt: '婚礼将于以下时间举行',
  reception: '迎宾',
  banquet: '宴席开始',
  monthLabel: '月',
  days: '天', hours: '时', minutes: '分', seconds: '秒',
  countdownTitle: '倒计时',
  venueTitle: '婚礼地点',
  openMap: '查看地图',
  addToCalendar: '添加到日历',
  familyTitle: '婚礼信息',
  groomSide: '男方家庭',
  brideSide: '女方家庭',
  galleryTitle: '婚纱相册',
  dressCodeTitle: '着装要求',
  scheduleTitle: '婚礼流程',
  giftTitle: '结婚礼金',
  rsvpTitle: '出席确认',
  rsvpNamePlaceholder: '您的姓名',
  rsvpAttendYes: '将出席',
  rsvpAttendMaybe: '待确认',
  rsvpAttendNo: '无法出席',
  rsvpGuestCount: '出席人数',
  rsvpMessagePlaceholder: '留言（选填）',
  rsvpSubmit: '确认',
  rsvpSubmitting: '发送中...',
  rsvpSuccess: '感谢您的确认！',
  rsvpSuccessSub: '期待在婚礼上与您相聚。',
  rsvpErrName: '请输入您的姓名。',
  rsvpErrGeneric: '出现错误，请重试。',
  guestbookTitle: '留言簿',
  guestbookNamePlaceholder: '您的姓名',
  guestbookMsgPlaceholder: '为新人送上祝福...',
  guestbookSubmit: '发送祝福',
  guestbookSubmitting: '发送中...',
  guestbookEmpty: '成为第一个送上祝福的人！',
  guestbookErrFields: '请输入姓名和祝福语。',
  guestbookErrGeneric: '出现错误。',
  guestbookJustNow: '刚刚',
  thanksTitle: '致谢',
  footerDefault: '您的到来是我们最大的荣幸。',
  footerBrand: '婚礼请柬由 JunTech 制作',
};

const ko: InvI18n = {
  coverInvite: '초대합니다',
  coverSub: '저희의 결혼식에 함께해 주세요',
  coverOpen: '청첩장 열기',
  groomTitle: '신랑',
  brideTitle: '신부',
  coupleAnnounce: '저희 두 사람이\n결혼합니다',
  ceremonyAt: '결혼식은 아래 일시에 진행됩니다',
  reception: '하객 맞이',
  banquet: '식사 시작',
  monthLabel: '월',
  days: '일', hours: '시간', minutes: '분', seconds: '초',
  countdownTitle: '카운트다운',
  venueTitle: '예식 장소',
  openMap: '지도 보기',
  addToCalendar: '캘린더에 추가',
  familyTitle: '혼인 정보',
  groomSide: '신랑 측',
  brideSide: '신부 측',
  galleryTitle: '웨딩 앨범',
  dressCodeTitle: '드레스 코드',
  scheduleTitle: '결혼식 일정',
  giftTitle: '축의금',
  rsvpTitle: '참석 여부 확인',
  rsvpNamePlaceholder: '성함',
  rsvpAttendYes: '참석',
  rsvpAttendMaybe: '미정',
  rsvpAttendNo: '불참',
  rsvpGuestCount: '참석 인원',
  rsvpMessagePlaceholder: '메시지 (선택)',
  rsvpSubmit: '확인',
  rsvpSubmitting: '전송 중...',
  rsvpSuccess: '참석 확인 감사합니다!',
  rsvpSuccessSub: '소중한 날 함께하기를 기대합니다.',
  rsvpErrName: '성함을 입력해 주세요.',
  rsvpErrGeneric: '오류가 발생했습니다. 다시 시도해 주세요.',
  guestbookTitle: '방명록',
  guestbookNamePlaceholder: '성함',
  guestbookMsgPlaceholder: '신랑·신부에게 축하 메시지를...',
  guestbookSubmit: '축하 메시지 보내기',
  guestbookSubmitting: '전송 중...',
  guestbookEmpty: '첫 번째 축하 메시지를 남겨보세요!',
  guestbookErrFields: '성함과 메시지를 입력해 주세요.',
  guestbookErrGeneric: '오류가 발생했습니다.',
  guestbookJustNow: '방금',
  thanksTitle: '감사의 말씀',
  footerDefault: '여러분의 참석이 저희에게 큰 기쁨입니다.',
  footerBrand: 'JunTech 청첩장',
};

const ja: InvI18n = {
  coverInvite: 'ご招待',
  coverSub: '私たちの結婚式にご参席ください',
  coverOpen: '招待状を開く',
  groomTitle: '新郎',
  brideTitle: '新婦',
  coupleAnnounce: 'このたび 結婚式を\n執り行うこととなりました',
  ceremonyAt: '結婚式の日時',
  reception: '受付',
  banquet: '披露宴開始',
  monthLabel: '月',
  days: '日', hours: '時間', minutes: '分', seconds: '秒',
  countdownTitle: 'カウントダウン',
  venueTitle: '式場',
  openMap: '地図を開く',
  addToCalendar: 'カレンダーに追加',
  familyTitle: '式典情報',
  groomSide: '新郎側',
  brideSide: '新婦側',
  galleryTitle: 'ウェディングアルバム',
  dressCodeTitle: 'ドレスコード',
  scheduleTitle: '当日のスケジュール',
  giftTitle: 'ご祝儀',
  rsvpTitle: '出欠確認',
  rsvpNamePlaceholder: 'お名前',
  rsvpAttendYes: '出席します',
  rsvpAttendMaybe: '未定',
  rsvpAttendNo: '欠席します',
  rsvpGuestCount: '出席人数',
  rsvpMessagePlaceholder: 'メッセージ（任意）',
  rsvpSubmit: '送信',
  rsvpSubmitting: '送信中...',
  rsvpSuccess: 'ご確認ありがとうございます！',
  rsvpSuccessSub: '当日お会いできることを楽しみにしております。',
  rsvpErrName: 'お名前を入力してください。',
  rsvpErrGeneric: 'エラーが発生しました。再度お試しください。',
  guestbookTitle: '芳名帳',
  guestbookNamePlaceholder: 'お名前',
  guestbookMsgPlaceholder: '新郎新婦へのメッセージ...',
  guestbookSubmit: 'メッセージを送る',
  guestbookSubmitting: '送信中...',
  guestbookEmpty: '最初のメッセージを送りましょう！',
  guestbookErrFields: 'お名前とメッセージを入力してください。',
  guestbookErrGeneric: 'エラーが発生しました。',
  guestbookJustNow: 'たった今',
  thanksTitle: 'ご挨拶',
  footerDefault: '皆様のご出席が私どもの喜びでございます。',
  footerBrand: 'JunTech 招待状',
};

const fr: InvI18n = {
  coverInvite: 'Cher(e)',
  coverSub: 'Vous êtes cordialement invité(e) à notre mariage',
  coverOpen: 'Ouvrir l\'invitation',
  groomTitle: 'Le Marié',
  brideTitle: 'La Mariée',
  coupleAnnounce: 'NOUS AVONS L\'HONNEUR\nDE VOUS ANNONCER NOTRE MARIAGE',
  ceremonyAt: 'LA CÉRÉMONIE AURA LIEU À',
  reception: 'ACCUEIL',
  banquet: 'REPAS',
  monthLabel: 'MOIS',
  days: 'Jours', hours: 'Heures', minutes: 'Min', seconds: 'Sec',
  countdownTitle: 'Compte à rebours',
  venueTitle: 'LIEU DE LA CÉRÉMONIE',
  openMap: 'Voir la carte',
  addToCalendar: 'Ajouter au calendrier',
  familyTitle: 'INFORMATIONS SUR LE MARIAGE',
  groomSide: 'Famille du Marié',
  brideSide: 'Famille de la Mariée',
  galleryTitle: 'ALBUM PHOTOS',
  dressCodeTitle: 'CODE VESTIMENTAIRE',
  scheduleTitle: 'PROGRAMME DE LA JOURNÉE',
  giftTitle: 'LISTE DE MARIAGE',
  rsvpTitle: 'RSVP',
  rsvpNamePlaceholder: 'Votre nom',
  rsvpAttendYes: 'Je serai présent(e)',
  rsvpAttendMaybe: 'Peut-être',
  rsvpAttendNo: 'Je ne pourrai pas venir',
  rsvpGuestCount: 'Nombre de personnes',
  rsvpMessagePlaceholder: 'Message (optionnel)',
  rsvpSubmit: 'Confirmer',
  rsvpSubmitting: 'Envoi...',
  rsvpSuccess: 'Merci pour votre confirmation !',
  rsvpSuccessSub: 'Nous avons hâte de vous retrouver.',
  rsvpErrName: 'Veuillez entrer votre nom.',
  rsvpErrGeneric: 'Une erreur est survenue. Veuillez réessayer.',
  guestbookTitle: 'LIVRE D\'OR',
  guestbookNamePlaceholder: 'Votre nom',
  guestbookMsgPlaceholder: 'Envoyez vos voeux aux mariés...',
  guestbookSubmit: 'Envoyer mes voeux',
  guestbookSubmitting: 'Envoi...',
  guestbookEmpty: 'Soyez le premier à envoyer vos voeux !',
  guestbookErrFields: 'Veuillez entrer votre nom et votre message.',
  guestbookErrGeneric: 'Une erreur est survenue.',
  guestbookJustNow: "À l'instant",
  thanksTitle: 'REMERCIEMENTS',
  footerDefault: 'Votre présence est le plus beau des cadeaux.',
  footerBrand: 'Invitation créée par JunTech',
};

const es: InvI18n = {
  coverInvite: 'Estimado/a',
  coverSub: 'Le invitamos cordialmente a nuestra boda',
  coverOpen: 'Abrir invitación',
  groomTitle: 'Novio',
  brideTitle: 'Novia',
  coupleAnnounce: 'NOS COMPLACE ANUNCIAR\nNUESTRA BODA',
  ceremonyAt: 'LA CEREMONIA SE CELEBRARÁ A LAS',
  reception: 'RECEPCIÓN',
  banquet: 'CENA',
  monthLabel: 'MES',
  days: 'Días', hours: 'Horas', minutes: 'Min', seconds: 'Seg',
  countdownTitle: 'Cuenta regresiva',
  venueTitle: 'LUGAR DE LA BODA',
  openMap: 'Ver mapa',
  addToCalendar: 'Añadir al calendario',
  familyTitle: 'INFORMACIÓN DE LA BODA',
  groomSide: 'Familia del Novio',
  brideSide: 'Familia de la Novia',
  galleryTitle: 'ÁLBUM DE FOTOS',
  dressCodeTitle: 'CÓDIGO DE VESTIMENTA',
  scheduleTitle: 'PROGRAMA DEL DÍA',
  giftTitle: 'REGALO DE BODA',
  rsvpTitle: 'RSVP',
  rsvpNamePlaceholder: 'Tu nombre',
  rsvpAttendYes: 'Asistiré',
  rsvpAttendMaybe: 'Tal vez',
  rsvpAttendNo: 'No podré asistir',
  rsvpGuestCount: 'Número de personas',
  rsvpMessagePlaceholder: 'Mensaje (opcional)',
  rsvpSubmit: 'Confirmar',
  rsvpSubmitting: 'Enviando...',
  rsvpSuccess: '¡Gracias por confirmar!',
  rsvpSuccessSub: 'Esperamos verte en nuestra boda.',
  rsvpErrName: 'Por favor ingresa tu nombre.',
  rsvpErrGeneric: 'Algo salió mal. Intenta de nuevo.',
  guestbookTitle: 'LIBRO DE VISITAS',
  guestbookNamePlaceholder: 'Tu nombre',
  guestbookMsgPlaceholder: 'Envía tus deseos a los novios...',
  guestbookSubmit: 'Enviar deseos',
  guestbookSubmitting: 'Enviando...',
  guestbookEmpty: '¡Sé el primero en enviar tus deseos!',
  guestbookErrFields: 'Por favor ingresa tu nombre y mensaje.',
  guestbookErrGeneric: 'Algo salió mal.',
  guestbookJustNow: 'Ahora mismo',
  thanksTitle: 'AGRADECIMIENTOS',
  footerDefault: 'Tu presencia es el mejor regalo.',
  footerBrand: 'Invitación creada por JunTech',
};

const ar: InvI18n = {
  coverInvite: 'عزيزي',
  coverSub: 'يسرّنا دعوتكم لحضور حفل زفافنا',
  coverOpen: 'فتح الدعوة',
  groomTitle: 'العريس',
  brideTitle: 'العروس',
  coupleAnnounce: 'يسعدنا الإعلان عن\nزفافنا المبارك',
  ceremonyAt: 'ستُقام حفلة الزفاف في تمام الساعة',
  reception: 'استقبال الضيوف',
  banquet: 'بدء الحفل',
  monthLabel: 'الشهر',
  days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثواني',
  countdownTitle: 'العد التنازلي',
  venueTitle: 'مكان إقامة الحفل',
  openMap: 'عرض الخريطة',
  addToCalendar: 'أضف إلى التقويم',
  familyTitle: 'معلومات الزفاف',
  groomSide: 'عائلة العريس',
  brideSide: 'عائلة العروس',
  galleryTitle: 'ألبوم الصور',
  dressCodeTitle: 'قواعد اللباس',
  scheduleTitle: 'برنامج اليوم',
  giftTitle: 'هدية الزفاف',
  rsvpTitle: 'تأكيد الحضور',
  rsvpNamePlaceholder: 'اسمك',
  rsvpAttendYes: 'سأحضر',
  rsvpAttendMaybe: 'ربما',
  rsvpAttendNo: 'لن أتمكن من الحضور',
  rsvpGuestCount: 'عدد الأشخاص',
  rsvpMessagePlaceholder: 'رسالة (اختياري)',
  rsvpSubmit: 'تأكيد',
  rsvpSubmitting: 'جارٍ الإرسال...',
  rsvpSuccess: 'شكراً لتأكيدك!',
  rsvpSuccessSub: 'نتطلع إلى لقائك في يومنا الخاص.',
  rsvpErrName: 'يرجى إدخال اسمك.',
  rsvpErrGeneric: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  guestbookTitle: 'سجل الزوار',
  guestbookNamePlaceholder: 'اسمك',
  guestbookMsgPlaceholder: 'أرسل تهنئتك للعروسين...',
  guestbookSubmit: 'إرسال التهنئة',
  guestbookSubmitting: 'جارٍ الإرسال...',
  guestbookEmpty: 'كن أول من يرسل تهنئته!',
  guestbookErrFields: 'يرجى إدخال اسمك ورسالتك.',
  guestbookErrGeneric: 'حدث خطأ.',
  guestbookJustNow: 'للتو',
  thanksTitle: 'كلمة شكر',
  footerDefault: 'حضوركم أسعد لحظاتنا.',
  footerBrand: 'دعوة بواسطة JunTech',
};

const ru: InvI18n = {
  coverInvite: 'Дорогой/ая',
  coverSub: 'Приглашаем Вас разделить с нами радость бракосочетания',
  coverOpen: 'Открыть приглашение',
  groomTitle: 'Жених',
  brideTitle: 'Невеста',
  coupleAnnounce: 'МЫ РАДЫ СООБЩИТЬ\nО НАШЕМ БРАКОСОЧЕТАНИИ',
  ceremonyAt: 'ЦЕРЕМОНИЯ СОСТОИТСЯ В',
  reception: 'ВСТРЕЧА ГОСТЕЙ',
  banquet: 'БАНКЕТ',
  monthLabel: 'МЕСЯЦ',
  days: 'Дней', hours: 'Часов', minutes: 'Мин', seconds: 'Сек',
  countdownTitle: 'Обратный отсчёт',
  venueTitle: 'МЕСТО ПРОВЕДЕНИЯ',
  openMap: 'Открыть карту',
  addToCalendar: 'Добавить в календарь',
  familyTitle: 'ИНФОРМАЦИЯ О СВАДЬБЕ',
  groomSide: 'Семья жениха',
  brideSide: 'Семья невесты',
  galleryTitle: 'СВАДЕБНЫЙ АЛЬБОМ',
  dressCodeTitle: 'ДРЕСС-КОД',
  scheduleTitle: 'ПРОГРАММА ДНЯ',
  giftTitle: 'СВАДЕБНЫЙ ПОДАРОК',
  rsvpTitle: 'ПОДТВЕРЖДЕНИЕ УЧАСТИЯ',
  rsvpNamePlaceholder: 'Ваше имя',
  rsvpAttendYes: 'Буду присутствовать',
  rsvpAttendMaybe: 'Возможно',
  rsvpAttendNo: 'Не смогу прийти',
  rsvpGuestCount: 'Количество гостей',
  rsvpMessagePlaceholder: 'Сообщение (необязательно)',
  rsvpSubmit: 'Подтвердить',
  rsvpSubmitting: 'Отправка...',
  rsvpSuccess: 'Спасибо за подтверждение!',
  rsvpSuccessSub: 'Ждём вас на нашем торжестве.',
  rsvpErrName: 'Пожалуйста, введите ваше имя.',
  rsvpErrGeneric: 'Произошла ошибка. Попробуйте ещё раз.',
  guestbookTitle: 'КНИГА ПОЖЕЛАНИЙ',
  guestbookNamePlaceholder: 'Ваше имя',
  guestbookMsgPlaceholder: 'Напишите пожелания молодожёнам...',
  guestbookSubmit: 'Отправить пожелание',
  guestbookSubmitting: 'Отправка...',
  guestbookEmpty: 'Будьте первым, кто оставит пожелание!',
  guestbookErrFields: 'Пожалуйста, введите имя и сообщение.',
  guestbookErrGeneric: 'Произошла ошибка.',
  guestbookJustNow: 'Только что',
  thanksTitle: 'СЛОВА БЛАГОДАРНОСТИ',
  footerDefault: 'Ваше присутствие — лучший подарок для нас.',
  footerBrand: 'Приглашение создано JunTech',
};

const id: InvI18n = {
  coverInvite: 'Yang Terhormat',
  coverSub: 'Kami mengundang Anda untuk merayakan pernikahan kami',
  coverOpen: 'Buka Undangan',
  groomTitle: 'Pengantin Pria',
  brideTitle: 'Pengantin Wanita',
  coupleAnnounce: 'DENGAN PENUH SUKACITA\nKAMI MENGUMUMKAN PERNIKAHAN KAMI',
  ceremonyAt: 'RESEPSI AKAN DISELENGGARAKAN PADA PUKUL',
  reception: 'PENERIMAAN TAMU',
  banquet: 'MULAI RESEPSI',
  monthLabel: 'BULAN',
  days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik',
  countdownTitle: 'Hitung Mundur',
  venueTitle: 'LOKASI RESEPSI',
  openMap: 'Buka peta',
  addToCalendar: 'Tambah ke kalender',
  familyTitle: 'INFORMASI PERNIKAHAN',
  groomSide: 'Keluarga Pengantin Pria',
  brideSide: 'Keluarga Pengantin Wanita',
  galleryTitle: 'ALBUM FOTO',
  dressCodeTitle: 'KODE BERPAKAIAN',
  scheduleTitle: 'JADWAL HARI H',
  giftTitle: 'HADIAH PERNIKAHAN',
  rsvpTitle: 'KONFIRMASI KEHADIRAN',
  rsvpNamePlaceholder: 'Nama Anda',
  rsvpAttendYes: 'Akan hadir',
  rsvpAttendMaybe: 'Mungkin hadir',
  rsvpAttendNo: 'Tidak bisa hadir',
  rsvpGuestCount: 'Jumlah tamu',
  rsvpMessagePlaceholder: 'Pesan (opsional)',
  rsvpSubmit: 'Konfirmasi',
  rsvpSubmitting: 'Mengirim...',
  rsvpSuccess: 'Terima kasih atas konfirmasi Anda!',
  rsvpSuccessSub: 'Kami menantikan kehadiran Anda.',
  rsvpErrName: 'Mohon masukkan nama Anda.',
  rsvpErrGeneric: 'Terjadi kesalahan. Silakan coba lagi.',
  guestbookTitle: 'BUKU TAMU',
  guestbookNamePlaceholder: 'Nama Anda',
  guestbookMsgPlaceholder: 'Kirim ucapan kepada pasangan...',
  guestbookSubmit: 'Kirim ucapan',
  guestbookSubmitting: 'Mengirim...',
  guestbookEmpty: 'Jadilah yang pertama mengirim ucapan!',
  guestbookErrFields: 'Mohon masukkan nama dan pesan Anda.',
  guestbookErrGeneric: 'Terjadi kesalahan.',
  guestbookJustNow: 'Baru saja',
  thanksTitle: 'UCAPAN TERIMA KASIH',
  footerDefault: 'Kehadiran Anda adalah anugerah terbesar bagi kami.',
  footerBrand: 'Undangan dibuat oleh JunTech',
};

const de: InvI18n = {
  coverInvite: 'Liebe/r',
  coverSub: 'Wir laden Sie herzlich zu unserer Hochzeit ein',
  coverOpen: 'Einladung öffnen',
  groomTitle: 'Bräutigam',
  brideTitle: 'Braut',
  coupleAnnounce: 'WIR FREUEN UNS,\nUNSERE HOCHZEIT BEKANNT ZU GEBEN',
  ceremonyAt: 'DIE FEIER BEGINNT UM',
  reception: 'EMPFANG',
  banquet: 'DINNER',
  monthLabel: 'MONAT',
  days: 'Tage', hours: 'Stunden', minutes: 'Min', seconds: 'Sek',
  countdownTitle: 'Countdown',
  venueTitle: 'VERANSTALTUNGSORT',
  openMap: 'Karte öffnen',
  addToCalendar: 'Zum Kalender hinzufügen',
  familyTitle: 'HOCHZEITSINFORMATIONEN',
  groomSide: 'Familie des Bräutigams',
  brideSide: 'Familie der Braut',
  galleryTitle: 'HOCHZEITSALBUM',
  dressCodeTitle: 'DRESSCODE',
  scheduleTitle: 'TAGESABLAUF',
  giftTitle: 'HOCHZEITSGESCHENK',
  rsvpTitle: 'ANMELDEBESTÄTIGUNG',
  rsvpNamePlaceholder: 'Ihr Name',
  rsvpAttendYes: 'Ich komme',
  rsvpAttendMaybe: 'Vielleicht',
  rsvpAttendNo: 'Ich kann leider nicht kommen',
  rsvpGuestCount: 'Anzahl der Gäste',
  rsvpMessagePlaceholder: 'Nachricht (optional)',
  rsvpSubmit: 'Bestätigen',
  rsvpSubmitting: 'Wird gesendet...',
  rsvpSuccess: 'Vielen Dank für Ihre Bestätigung!',
  rsvpSuccessSub: 'Wir freuen uns, Sie bei unserer Feier begrüßen zu dürfen.',
  rsvpErrName: 'Bitte geben Sie Ihren Namen ein.',
  rsvpErrGeneric: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  guestbookTitle: 'GÄSTEBUCH',
  guestbookNamePlaceholder: 'Ihr Name',
  guestbookMsgPlaceholder: 'Senden Sie dem Brautpaar Ihre Wünsche...',
  guestbookSubmit: 'Wünsche senden',
  guestbookSubmitting: 'Wird gesendet...',
  guestbookEmpty: 'Seien Sie der Erste, der Wünsche sendet!',
  guestbookErrFields: 'Bitte geben Sie Ihren Namen und Ihre Nachricht ein.',
  guestbookErrGeneric: 'Ein Fehler ist aufgetreten.',
  guestbookJustNow: 'Gerade eben',
  thanksTitle: 'DANKSAGUNG',
  footerDefault: 'Ihre Anwesenheit ist das schönste Geschenk für uns.',
  footerBrand: 'Einladung erstellt von JunTech',
};

const zhTw: InvI18n = {
  coverInvite: '誠摯邀請',
  coverSub: '敬請光臨我們的婚禮慶典',
  coverOpen: '開啟請帖',
  groomTitle: '新郎',
  brideTitle: '新娘',
  coupleAnnounce: '謹訂於下列吉日\n舉行婚禮慶典',
  ceremonyAt: '婚禮將於以下時間舉行',
  reception: '迎賓',
  banquet: '宴席開始',
  monthLabel: '月',
  days: '天', hours: '時', minutes: '分', seconds: '秒',
  countdownTitle: '倒數計時',
  venueTitle: '婚禮地點',
  openMap: '查看地圖',
  addToCalendar: '新增至行事曆',
  familyTitle: '婚禮資訊',
  groomSide: '男方家庭',
  brideSide: '女方家庭',
  galleryTitle: '婚紗相冊',
  dressCodeTitle: '著裝要求',
  scheduleTitle: '婚禮流程',
  giftTitle: '結婚禮金',
  rsvpTitle: '出席確認',
  rsvpNamePlaceholder: '您的姓名',
  rsvpAttendYes: '將出席',
  rsvpAttendMaybe: '待確認',
  rsvpAttendNo: '無法出席',
  rsvpGuestCount: '出席人數',
  rsvpMessagePlaceholder: '留言（選填）',
  rsvpSubmit: '確認',
  rsvpSubmitting: '傳送中...',
  rsvpSuccess: '感謝您的確認！',
  rsvpSuccessSub: '期待在婚禮上與您相聚。',
  rsvpErrName: '請輸入您的姓名。',
  rsvpErrGeneric: '發生錯誤，請再試一次。',
  guestbookTitle: '留言簿',
  guestbookNamePlaceholder: '您的姓名',
  guestbookMsgPlaceholder: '為新人送上祝福...',
  guestbookSubmit: '傳送祝福',
  guestbookSubmitting: '傳送中...',
  guestbookEmpty: '成為第一個送上祝福的人！',
  guestbookErrFields: '請輸入姓名和祝福語。',
  guestbookErrGeneric: '發生錯誤。',
  guestbookJustNow: '剛才',
  thanksTitle: '致謝',
  footerDefault: '您的蒞臨是我們最大的榮幸。',
  footerBrand: '婚禮請帖由 JunTech 製作',
};

export const TRANSLATIONS: Record<Lang, InvI18n> = { vi, en, zh, ko, ja, fr, es, ar, ru, id, de, 'zh-tw': zhTw };

export function useI18n(lang: Lang = 'vi'): InvI18n {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.vi;
}

/**
 * Tạo object InvI18n song ngữ — mỗi key = "vi_value / en_value".
 * langs[0] = ngôn ngữ chính (primary), các lang sau là phụ.
 * Nếu chỉ có 1 ngôn ngữ, trả về bản dịch đơn ngữ bình thường.
 */
export function buildBilingual(langs: Lang[]): InvI18n {
  const validLangs = langs.filter(l => l in TRANSLATIONS) as Lang[];
  if (validLangs.length === 0) return TRANSLATIONS.vi;
  if (validLangs.length === 1) return TRANSLATIONS[validLangs[0]];

  const primary = TRANSLATIONS[validLangs[0]];
  const secondaries = validLangs.slice(1).map(l => TRANSLATIONS[l]);

  // Merge: "primary / secondary1 / secondary2"
  const result = {} as Record<keyof InvI18n, string>;
  for (const key of Object.keys(primary) as (keyof InvI18n)[]) {
    const vals = [primary[key], ...secondaries.map(s => s[key])];
    const unique = vals.filter((v, i) => v !== vals[i - 1]);
    result[key] = unique.join(' / ');
  }
  return result as unknown as InvI18n;
}

/** Lấy lang primary từ localStorage (khách đổi thứ tự ưu tiên). */
export function getSavedPrimaryLang(slug: string, defaultLang: Lang): Lang {
  try {
    const v = localStorage.getItem(`inv_primary_${slug}`);
    if (v && v in TRANSLATIONS) return v as Lang;
  } catch {}
  return defaultLang;
}

export function savePrimaryLang(slug: string, lang: Lang) {
  try { localStorage.setItem(`inv_primary_${slug}`, lang); } catch {}
}

/**
 * Tách chuỗi song ngữ "Tiếng Việt / English" thành { primary, secondary }.
 * Dùng trong InvitationBody để render 2 dòng riêng thay vì 1 dòng dài.
 * Nếu không có " / " → secondary = undefined (đơn ngữ).
 */
export function splitBi(text: string): { primary: string; secondary: string | undefined } {
  const idx = text.indexOf(' / ');
  if (idx === -1) return { primary: text, secondary: undefined };
  return { primary: text.slice(0, idx), secondary: text.slice(idx + 3) };
}

/** Lấy lang đã lưu (compat). */
export function getSavedLang(slug: string): Lang {
  return getSavedPrimaryLang(slug, 'vi');
}

export function saveLang(slug: string, lang: Lang) {
  savePrimaryLang(slug, lang);
}
