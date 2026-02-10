// AET Progression Framework - Exact structure from official document
// 8 Areas, each with numbered categories and subcategories

export interface Subcategory {
  id: string;
  code: string; // e.g., "1.1", "2.3"
  name: string;
}

export interface Category {
  id: string;
  number: number;
  name: string;
  subcategories: Subcategory[];
}

export interface Area {
  id: string;
  name: string;
  description: string;
  color: string;
  categories: Category[];
}

export interface AETFramework {
  areas: Area[];
}

export const AET_FRAMEWORK_AR: AETFramework = {
	areas: [
	  {
		id: 'communication-interaction',
		name: 'التواصل والتفاعل',
		description: 'المهارات المتعلقة بالتواصل مع الآخرين وفهم التواصل',
		color: 'navy',
		categories: [
		  {
			id: 'engaging-interaction',
			number: 1,
			name: 'المشاركة في التفاعل',
			subcategories: [
			  { id: 'ci-1-1', code: '1.1', name: 'يستجيب بشكل إيجابي لشخص بالغ مألوف' },
			  { id: 'ci-1-2', code: '1.2', name: 'يسعى لجذب انتباه شخص بالغ مألوف' },
			  { id: 'ci-1-3', code: '1.3', name: 'يشارك تركيز الانتباه مع الشخص البالغ' },
			  { id: 'ci-1-4', code: '1.4', name: 'ينخرط في تبادل تفاعلي مع الشخص البالغ' },
			]
		  },
		  {
			id: 'making-requests',
			number: 2,
			name: 'تقديم الطلبات',
			subcategories: [
			  { id: 'ci-2-1', code: '2.1', name: 'يطلب غرضًا' },
			  { id: 'ci-2-2', code: '2.2', name: 'يرفض غرضًا أو نشاطًا' },
			  { id: 'ci-2-3', code: '2.3', name: 'يطلب استمرار أو إيقاف التفاعل' },
			  { id: 'ci-2-4', code: '2.4', name: 'يطلب المساعدة' },
			  { id: 'ci-2-5', code: '2.5', name: 'يطلب معلومات أو يطرح سؤالاً' },
			]
		  },
		  {
			id: 'communicating-information',
			number: 3,
			name: 'نقل المعلومات أو التعليق على الأحداث',
			subcategories: [
			  { id: 'ci-3-1', code: '3.1', name: 'يجيب عن سؤال' },
			  { id: 'ci-3-2', code: '3.2', name: 'ينقل معلومات عن الماضي والمستقبل' },
			  { id: 'ci-3-3', code: '3.3', name: 'يعبر عن الآراء أو الأفكار أو المشاعر' },
			  { id: 'ci-3-4', code: '3.4', name: 'يعطي تعليمات أو تفسيرات' },
			  { id: 'ci-3-5', code: '3.5', name: 'يسرد أحداثًا ويقدم شروحات' },
			  { id: 'ci-3-6', code: '3.6', name: 'يعلق أو يلفت الانتباه إلى غرض أو حدث' },
			]
		  },
		  {
			id: 'listening-understanding',
			number: 4,
			name: 'الاستماع والفهم',
			subcategories: [
			  { id: 'ci-4-1', code: '4.1', name: 'يستجيب للأصوات' },
			  { id: 'ci-4-2', code: '4.2', name: 'يفهم كلمة منطوقة واحدة' },
			  { id: 'ci-4-3', code: '4.3', name: 'يفهم جملة بسيطة' },
			  { id: 'ci-4-4', code: '4.4', name: 'يفهم التعليمات' },
			  { id: 'ci-4-5', code: '4.5', name: 'يفهم الأسئلة' },
			  { id: 'ci-4-6', code: '4.6', name: 'يستخرج المعنى أو المعلومات ذات الصلة' },
			  { id: 'ci-4-7', code: '4.7', name: 'يفهم الدعابة والكلام المجازي' },
			  { id: 'ci-4-8', code: '4.8', name: 'يفهم الكلام غير الرسمي أو العامية' },
			]
		  },
		  {
			id: 'greetings',
			number: 5,
			name: 'التحيات',
			subcategories: [
			  { id: 'ci-5-1', code: '5.1', name: 'يستجيب للتحيات أو عند مناداته' },
			  { id: 'ci-5-2', code: '5.2', name: 'يحيّي الآخرين' },
			]
		  },
		  {
			id: 'conversations',
			number: 6,
			name: 'المحادثات',
			subcategories: [
			  { id: 'ci-6-1', code: '6.1', name: 'يجذب انتباه الآخر' },
			  { id: 'ci-6-2', code: '6.2', name: 'يتولى قيادة الحوار' },
			  { id: 'ci-6-3', code: '6.3', name: 'يستجيب لشريك المحادثة' },
			  { id: 'ci-6-4', code: '6.4', name: 'يحافظ على سير المحادثة' },
			]
		  },
		  {
			id: 'non-verbal-communication',
			number: 7,
			name: 'التواصل غير اللفظي',
			subcategories: [
			  { id: 'ci-7-1', code: '7.1', name: 'يكيّف التواصل أو السلوك ليتناسب مع الموقف' },
			  { id: 'ci-7-2', code: '7.2', name: 'يُظهر دلائل على الاستماع الفعّال' },
			  { id: 'ci-7-3', code: '7.3', name: 'يفهم التواصل غير اللفظي' },
			]
		  },
		]
	  },
  
	  {
		id: 'social-understanding',
		name: 'الفهم الاجتماعي والعلاقات',
		description: 'المهارات المتعلقة بالتفاعل الاجتماعي وبناء العلاقات',
		color: 'red',
		categories: [
		  {
			id: 'being-with-others',
			number: 1,
			name: 'التواجد مع الآخرين',
			subcategories: [
			  { id: 'su-1-1', code: '1.1', name: 'يقبل وجود الآخرين في بيئة مألوفة' },
			  { id: 'su-1-2', code: '1.2', name: 'ينخرط في نشاط مشترك' },
			  { id: 'su-1-3', code: '1.3', name: 'يتكيف مع قرب الآخرين في الأماكن العامة' },
			]
		  },
		  {
			id: 'interactive-play',
			number: 2,
			name: 'اللعب التفاعلي',
			subcategories: [
			  { id: 'su-2-1', code: '2.1', name: 'يقبل وجود شخص بالغ في بيئة اللعب' },
			  { id: 'su-2-2', code: '2.2', name: 'ينخرط في لعب تفاعلي مع شخص بالغ' },
			  { id: 'su-2-3', code: '2.3', name: 'ينخرط في اللعب بالأشياء مع شخص بالغ' },
			  { id: 'su-2-4', code: '2.4', name: 'يلعب مع الأقران' },
			]
		  },
		  {
			id: 'positive-relationships-adults',
			number: 3,
			name: 'العلاقات الإيجابية (مع البالغين الداعمين)',
			subcategories: [
			  { id: 'su-3-1', code: '3.1', name: 'يتفاعل بشكل إيجابي مع الشخص الداعم' },
			  { id: 'su-3-2', code: '3.2', name: 'يقبل المساعدة من شخص بالغ' },
			  { id: 'su-3-3', code: '3.3', name: 'يشارك في الأنشطة بدعم من شخص بالغ' },
			  { id: 'su-3-4', code: '3.4', name: 'يسعى للحصول على النصيحة والدعم من شخص بالغ' },
			]
		  },
		  {
			id: 'positive-relationships-peers',
			number: 4,
			name: 'العلاقات الإيجابية والصداقات (الأقران)',
			subcategories: [
			  { id: 'su-4-1', code: '4.1', name: 'يبدأ التفاعل مع الأقران' },
			  { id: 'su-4-2', code: '4.2', name: 'ينخرط بشكل إيجابي في التفاعل مع الأقران' },
			  { id: 'su-4-3', code: '4.3', name: 'يراعي اهتمامات واحتياجات ومشاعر الآخرين أثناء التفاعل' },
			  { id: 'su-4-4', code: '4.4', name: 'يتخذ خطوات للحفاظ على علاقة إيجابية' },
			  { id: 'su-4-5', code: '4.5', name: 'يتعرف على السلوك السلبي أو التنمّر تجاه نفسه أو الآخرين' },
			]
		  },
		  {
			id: 'group-activities',
			number: 5,
			name: 'الأنشطة الجماعية',
			subcategories: [
			  { id: 'su-5-1', code: '5.1', name: 'يركز على هدف المجموعة' },
			  { id: 'su-5-2', code: '5.2', name: 'يشارك في نشاط جماعي' },
			  { id: 'su-5-3', code: '5.3', name: 'يدرك نفسه كجزء من المجموعة' },
			  { id: 'su-5-4', code: '5.4', name: 'يفهم ويلتزم بتوقعات العمل ضمن مجموعة' },
			  { id: 'su-5-5', code: '5.5', name: 'يشارك في نقاش جماعي' },
			]
		  },
		]
	  },
  
	  {
		id: 'sensory-processing',
		name: 'المعالجة الحسية',
		description: 'فهم وإدارة الاحتياجات والاستجابات الحسية',
		color: 'teal',
		categories: [
		  {
			id: 'understanding-sensory-needs',
			number: 1,
			name: 'فهم والتعبير عن الاحتياجات الحسية الخاصة',
			subcategories: [
			  { id: 'sp-1-1', code: '1.1', name: 'يعبر عن التفضيلات أو النفور الحسي' },
			  { id: 'sp-1-2', code: '1.2', name: 'يفهم احتياجاته الحسية' },
			]
		  },
		  {
			id: 'responding-sensory-interventions',
			number: 2,
			name: 'الاستجابة للتدخلات الحسية',
			subcategories: [
			  { id: 'sp-2-1', code: '2.1', name: 'يستجيب للتعديلات الحسية في البيئة' },
			  { id: 'sp-2-2', code: '2.2', name: 'يستجيب للمدخلات الحسية من الشخص الداعم' },
			  { id: 'sp-2-3', code: '2.3', name: 'يستجيب للمدخلات باستخدام معدات حسية' },
			  { id: 'sp-2-4', code: '2.4', name: 'يستجيب للبرامج الحسية المنتظمة' },
			]
		  },
		  {
			id: 'increasing-tolerance',
			number: 3,
			name: 'زيادة تحمل المدخلات الحسية',
			subcategories: [
			  { id: 'sp-3-1', code: '3.1', name: 'يُظهر زيادة في تحمل المدخلات الحسية' },
			]
		  },
		  {
			id: 'managing-sensory-needs',
			number: 4,
			name: 'إدارة الاحتياجات الحسية',
			subcategories: [
			  { id: 'sp-4-1', code: '4.1', name: 'يقبل الدعم لإدارة سلوكه فيما يتعلق بالاحتياجات الحسية' },
			  { id: 'sp-4-2', code: '4.2', name: 'يطلب مساعدة الآخرين لإدارة الاحتياجات الحسية' },
			  { id: 'sp-4-3', code: '4.3', name: 'يتخذ إجراءات لإدارة احتياجاته الحسية' },
			  { id: 'sp-4-4', code: '4.4', name: 'يتأمل احتياجاته الحسية وسلوكه' },
			]
		  },
		]
	  },
  
	  {
		id: 'interests-routines',
		name: 'الاهتمامات والروتين والمعالجة',
		description: 'إدارة التغيير والانتقالات والاهتمامات وحل المشكلات',
		color: 'purple',
		categories: [
		  {
			id: 'coping-with-change',
			number: 1,
			name: 'التكيف مع التغيير',
			subcategories: [
			  { id: 'ir-1-1', code: '1.1', name: 'يقبل التغيير ضمن المواقف المألوفة' },
			  { id: 'ir-1-2', code: '1.2', name: 'يتخذ إجراءات للتكيف مع التغيير' },
			]
		  },
		  {
			id: 'transitions',
			number: 2,
			name: 'الانتقالات',
			subcategories: [
			  { id: 'ir-2-1', code: '2.1', name: 'ينجح في الانتقال في المواقف اليومية' },
			  { id: 'ir-2-2', code: '2.2', name: 'ينخرط في الاستعداد للانتقال إلى بيئة جديدة' },
			]
		  },
		  {
			id: 'special-interests',
			number: 3,
			name: 'الاهتمامات الخاصة',
			subcategories: [
			  { id: 'ir-3-1', code: '3.1', name: 'يستخدم اهتماماته الخاصة للمشاركة الإيجابية في الأنشطة أو التبادلات' },
			  { id: 'ir-3-2', code: '3.2', name: 'ينخرط في مجموعة متنوعة من الأنشطة غير المرتبطة باهتماماته الخاصة' },
			]
		  },
		  {
			id: 'problem-solving',
			number: 4,
			name: 'حل المشكلات ومهارات التفكير',
			subcategories: [
			  { id: 'ir-4-1', code: '4.1', name: 'يتخذ قرارًا' },
			  { id: 'ir-4-2', code: '4.2', name: 'يستخدم المعلومات المتاحة لاتخاذ قرار مناسب' },
			  { id: 'ir-4-3', code: '4.3', name: 'يصنف العناصر إلى فئات' },
			  { id: 'ir-4-4', code: '4.4', name: 'يستخدم المعلومات للتخطيط والتنبؤ' },
			  { id: 'ir-4-5', code: '4.5', name: 'يستنتج بناءً على المعلومات المتاحة' },
			  { id: 'ir-4-6', code: '4.6', name: 'يتعرف على المشكلات ويتخذ إجراءات لحلها' },
			  { id: 'ir-4-7', code: '4.7', name: 'يتأمل المشكلات التي واجهها والاستراتيجيات المستخدمة' },
			]
		  },
		]
	  },
  
	  {
		id: 'emotional-understanding',
		name: 'الفهم العاطفي والوعي بالذات',
		description: 'فهم المشاعر وإدارة السلوك والوعي بالذات',
		color: 'green',
		categories: [
		  {
			id: 'understanding-own-emotions',
			number: 1,
			name: 'فهم والتعبير عن المشاعر الخاصة',
			subcategories: [
			  { id: 'eu-1-1', code: '1.1', name: 'يعبر عن مجموعة من المشاعر' },
			  { id: 'eu-1-2', code: '1.2', name: 'يتعرف على مشاعره' },
			  { id: 'eu-1-3', code: '1.3', name: 'يحدد سبب المشاعر' },
			]
		  },
		  {
			id: 'managing-emotions',
			number: 2,
			name: 'إدارة المشاعر والسلوك',
			subcategories: [
			  { id: 'eu-2-1', code: '2.1', name: 'يستجيب لاستراتيجيات التهدئة من الآخرين' },
			  { id: 'eu-2-2', code: '2.2', name: 'يستخدم استراتيجياته الخاصة لإدارة التوتر' },
			  { id: 'eu-2-3', code: '2.3', name: 'يشارك في تخطيط وإعداد استراتيجيات لإدارة مشاعره وسلوكه' },
			  { id: 'eu-2-4', code: '2.4', name: 'يستخدم الاستراتيجيات المُعلّمة لإدارة المشاعر والسلوك' },
			  { id: 'eu-2-5', code: '2.5', name: 'يتأمل في سلوكه' },
			]
		  },
		  {
			id: 'understanding-others-emotions',
			number: 3,
			name: 'فهم مشاعر ونوايا الآخرين',
			subcategories: [
			  { id: 'eu-3-1', code: '3.1', name: 'يتعرف على مشاعر الآخرين ويستجيب لها' },
			  { id: 'eu-3-2', code: '3.2', name: 'يحدد سبب مشاعر الآخرين' },
			  { id: 'eu-3-3', code: '3.3', name: 'يصدر أحكامًا تتعلق بسلوك الآخرين' },
			  { id: 'eu-3-4', code: '3.4', name: 'يتعرف على المخاطر المحتملة أو الفعلية في المواقف' },
			  { id: 'eu-3-5', code: '3.5', name: 'يدرك صعوباته في قراءة مشاعر أو نوايا الآخرين' },
			]
		  },
		  {
			id: 'self-awareness',
			number: 4,
			name: 'الوعي بالذات',
			subcategories: [
			  { id: 'eu-4-1', code: '4.1', name: 'يتعرف على خصائصه' },
			  { id: 'eu-4-2', code: '4.2', name: 'يتعرف على اهتماماته ونقاط قوته' },
			  { id: 'eu-4-3', code: '4.3', name: 'يفهم تشخيصه' },
			  { id: 'eu-4-4', code: '4.4', name: 'يتعرف على صعوباته' },
			  { id: 'eu-4-5', code: '4.5', name: 'يدرك التغيّر المتعلق بذاته' },
			  { id: 'eu-4-6', code: '4.6', name: 'يشارك في التخطيط لمستقبله' },
			]
		  },
		  {
			id: 'developing-confidence',
			number: 5,
			name: 'تنمية الثقة بالنفس وتقدير الذات',
			subcategories: [
			  { id: 'eu-5-1', code: '5.1', name: 'يعبر عن تفضيلاته' },
			  { id: 'eu-5-2', code: '5.2', name: 'يعبر عن آرائه وأفكاره' },
			  { id: 'eu-5-3', code: '5.3', name: 'يُظهر الثقة في الأنشطة' },
			  { id: 'eu-5-4', code: '5.4', name: 'يستجيب للسلوك السلبي' },
			]
		  },
		]
	  },
  
	  {
		id: 'learning-engagement',
		name: 'التعلم والمشاركة',
		description: 'اللعب والدافعية والتنظيم وتقييم التعلم',
		color: 'orange',
		categories: [
		  {
			id: 'learning-through-play',
			number: 1,
			name: 'التعلم من خلال اللعب',
			subcategories: [
			  { id: 'le-1-1', code: '1.1', name: 'يستكشف الألعاب أو الأدوات أو المواد' },
			  { id: 'le-1-2', code: '1.2', name: 'يُظهر فهمًا لغرض الألعاب أو أدوات اللعب' },
			  { id: 'le-1-3', code: '1.3', name: 'ينخرط في لعب السبب والنتيجة' },
			  { id: 'le-1-4', code: '1.4', name: 'ينخرط في اللعب التخيلي أو الرمزي' },
			  { id: 'le-1-5', code: '1.5', name: 'يمثل قصة أو سيناريو لعب' },
			]
		  },
		  {
			id: 'motivation-engagement',
			number: 2,
			name: 'الدافعية والمشاركة',
			subcategories: [
			  { id: 'le-2-1', code: '2.1', name: 'يستجيب للخصائص الحسية للأشياء أو الأنشطة' },
			  { id: 'le-2-2', code: '2.2', name: 'يستجيب للبيئة' },
			  { id: 'le-2-3', code: '2.3', name: 'يستجيب للتفاعل من الشخص الداعم أو الأقران' },
			  { id: 'le-2-4', code: '2.4', name: 'يتوقع أو يتنبأ بما سيحدث' },
			  { id: 'le-2-5', code: '2.5', name: 'يُظهر اهتمامًا بغرض أو نشاط أو موضوع' },
			  { id: 'le-2-6', code: '2.6', name: 'يستكشف أو يحقق في الأشياء أو الأنشطة' },
			  { id: 'le-2-7', code: '2.7', name: 'يكتشف معرفة وفهمًا جديدين' },
			  { id: 'le-2-8', code: '2.8', name: 'يركز على المهمة أو النشاط' },
			  { id: 'le-2-9', code: '2.9', name: 'يثابر على النشاط' },
			  { id: 'le-2-10', code: '2.10', name: 'ينتقل بالانتباه إلى مهمة أو نشاط أو طلب آخر' },
			  { id: 'le-2-11', code: '2.11', name: 'يبادر أو يطلب نشاطًا' },
			  { id: 'le-2-12', code: '2.12', name: 'ينخرط في مهام متفاوض عليها' },
			]
		  },
		  {
			id: 'organisation-independent-learning',
			number: 3,
			name: 'التنظيم والتعلم المستقل',
			subcategories: [
			  { id: 'le-3-1', code: '3.1', name: 'ينظم متعلقاته أو موارده' },
			  { id: 'le-3-2', code: '3.2', name: 'يستخدم الجداول أو المخططات بفعالية' },
			  { id: 'le-3-3', code: '3.3', name: 'يُظهر وعيًا بإدارة الوقت' },
			  { id: 'le-3-4', code: '3.4', name: 'يعمل بشكل مستقل' },
			  { id: 'le-3-5', code: '3.5', name: 'يشارك في تخطيط تعلمه' },
			  { id: 'le-3-6', code: '3.6', name: 'يخطط للعمل' },
			  { id: 'le-3-7', code: '3.7', name: 'يجري بحثًا حول موضوع' },
			  { id: 'le-3-8', code: '3.8', name: 'يطلب المساعدة' },
			]
		  },
		  {
			id: 'understanding-rules-routines',
			number: 4,
			name: 'فهم واتباع القواعد والروتين والتوقعات',
			subcategories: [
			  { id: 'le-4-1', code: '4.1', name: 'يجد طريقه داخل بيئة التعلم' },
			  { id: 'le-4-2', code: '4.2', name: 'يتكيف مع الاصطفاف أو الوقوف في طابور' },
			  { id: 'le-4-3', code: '4.3', name: 'يجذب الانتباه بطريقة مناسبة' },
			  { id: 'le-4-4', code: '4.4', name: 'يتبع الاستراتيجيات المتفق عليها للحركة داخل منطقة التعلم' },
			  { id: 'le-4-5', code: '4.5', name: 'يتبع روتين وقت اللعب أو الاستراحة' },
			  { id: 'le-4-6', code: '4.6', name: 'يُظهر زيادة في التحمل تجاه التوقعات' },
			]
		  },
		  {
			id: 'evaluating-own-learning',
			number: 5,
			name: 'تقييم التعلم الذاتي',
			subcategories: [
			  { id: 'le-5-1', code: '5.1', name: 'يقيّم تعلمه' },
			  { id: 'le-5-2', code: '5.2', name: 'يطبق فهمه لتعلمه' },
			  { id: 'le-5-3', code: '5.3', name: 'يعرف ويطبق نقاط قوته' },
			  { id: 'le-5-4', code: '5.4', name: 'يتعرف على صعوباته' },
			  { id: 'le-5-5', code: '5.5', name: 'يحدد أهداف تعلمه' },
			  { id: 'le-5-6', code: '5.6', name: 'يفهم عواقب اختياراته وأفعاله' },
			  { id: 'le-5-7', code: '5.7', name: 'يتعرف على إنجازاته' },
			]
		  },
		]
	  },
  
	  {
		id: 'healthy-living',
		name: 'العيش الصحي',
		description: 'الصحة والعناية الشخصية والتربية على العلاقات',
		color: 'blue',
		categories: [
		  {
			id: 'keeping-healthy',
			number: 1,
			name: 'الحفاظ على الصحة',
			subcategories: [
			  { id: 'hl-1-1', code: '1.1', name: 'يتعرف على احتياجاته الصحية' },
			  { id: 'hl-1-2', code: '1.2', name: 'يتكيف مع المواعيد الطبية' },
			  { id: 'hl-1-3', code: '1.3', name: 'يفهم فوائد ومخاطر الأدوية' },
			  { id: 'hl-1-4', code: '1.4', name: 'يعرف كيفية الحد من انتشار العدوى' },
			  { id: 'hl-1-5', code: '1.5', name: 'يتخذ خيارات صحية فيما يتعلق بالطعام والشراب' },
			  { id: 'hl-1-6', code: '1.6', name: 'يتحمل مجموعة متزايدة من الأطعمة' },
			  { id: 'hl-1-7', code: '1.7', name: 'يتخذ خيارات صحية فيما يتعلق بالتمارين' },
			  { id: 'hl-1-8', code: '1.8', name: 'يتخذ خيارات صحية فيما يتعلق بالنوم' },
			  { id: 'hl-1-9', code: '1.9', name: 'يفهم المخاطر الصحية المرتبطة بالتدخين والكحول' },
			  { id: 'hl-1-10', code: '1.10', name: 'يفهم القوانين المتعلقة بالمخدرات والكحول والتدخين' },
			]
		  },
		  {
			id: 'personal-care',
			number: 2,
			name: 'العناية الشخصية',
			subcategories: [
			  { id: 'hl-2-1', code: '2.1', name: 'يستخدم المرحاض بشكل مستقل في بيئة مألوفة' },
			  { id: 'hl-2-2', code: '2.2', name: 'يستخدم المرحاض العام' },
			  { id: 'hl-2-3', code: '2.3', name: 'يحافظ على نظافة اليدين' },
			  { id: 'hl-2-4', code: '2.4', name: 'يحافظ على نظافة الجسم' },
			  { id: 'hl-2-5', code: '2.5', name: 'يهتم بمظهره' },
			  { id: 'hl-2-6', code: '2.6', name: 'يتعرف ويدير الاحتياجات الحسية المتعلقة بالنظافة والملابس' },
			  { id: 'hl-2-7', code: '2.7', name: 'يرتدي ملابسه بفعالية' },
			]
		  },
		  {
			id: 'relationships-sex-education',
			number: 3,
			name: 'التربية على العلاقات والجنس',
			subcategories: [
			  { id: 'hl-3-1', code: '3.1', name: 'يتعرف على خصائصه الشخصية' },
			  { id: 'hl-3-2', code: '3.2', name: 'يتعرف على الاختلافات بين الناس ويقبلها' },
			  { id: 'hl-3-3', code: '3.3', name: 'يفهم ويقبل التغيرات التي تحدث في سن البلوغ' },
			  { id: 'hl-3-4', code: '3.4', name: 'يفهم المساحة الشخصية' },
			  { id: 'hl-3-5', code: '3.5', name: 'يميز بين العام والخاص' },
			  { id: 'hl-3-6', code: '3.6', name: 'يفهم أنواع العلاقات المختلفة' },
			  { id: 'hl-3-7', code: '3.7', name: 'يستخدم سلوكًا مناسبًا للعلاقة' },
			  { id: 'hl-3-8', code: '3.8', name: 'يفهم القوانين المتعلقة بالموافقة في العلاقات' },
			  { id: 'hl-3-9', code: '3.9', name: 'يحافظ على سلامته داخل العلاقات' },
			  { id: 'hl-3-10', code: '3.10', name: 'يعرف أين يطلب النصيحة أو المساعدة' },
			]
		  },
		]
	  },
  
	  {
		id: 'independence-community',
		name: 'الاستقلالية والمشاركة المجتمعية',
		description: 'العيش المستقل والسلامة والسفر والترفيه',
		color: 'slate',
		categories: [
		  {
			id: 'independent-living',
			number: 1,
			name: 'العيش المستقل',
			subcategories: [
			  { id: 'ic-1-1', code: '1.1', name: 'يدير وقته وروتينه' },
			  { id: 'ic-1-2', code: '1.2', name: 'يُحضّر وجبة خفيفة بسيطة' },
			  { id: 'ic-1-3', code: '1.3', name: 'يحضّر مشروبًا لنفسه أو للآخرين' },
			  { id: 'ic-1-4', code: '1.4', name: 'يستعد لإعداد وجبة' },
			  { id: 'ic-1-5', code: '1.5', name: 'يُحضّر وجبة' },
			  { id: 'ic-1-6', code: '1.6', name: 'يشارك في تناول الوجبة مع الآخرين' },
			  { id: 'ic-1-7', code: '1.7', name: 'يطلب وجبة' },
			  { id: 'ic-1-8', code: '1.8', name: 'يستعد للذهاب للتسوق' },
			  { id: 'ic-1-9', code: '1.9', name: 'يتسوق لشراء أغراض' },
			  { id: 'ic-1-10', code: '1.10', name: 'يدفع ثمن المشتريات في المتجر' },
			  { id: 'ic-1-11', code: '1.11', name: 'ينفذ الأعمال المنزلية' },
			  { id: 'ic-1-12', code: '1.12', name: 'يدير أمواله' },
			  { id: 'ic-1-13', code: '1.13', name: 'يستخدم الهاتف' },
			  { id: 'ic-1-14', code: '1.14', name: 'يخطط للمستقبل' },
			]
		  },
		  {
			id: 'personal-safety',
			number: 2,
			name: 'السلامة الشخصية',
			subcategories: [
			  { id: 'ic-2-1', code: '2.1', name: 'يحافظ على سلامته في المنزل' },
			  { id: 'ic-2-2', code: '2.2', name: 'يحافظ على سلامته في المدرسة' },
			  { id: 'ic-2-3', code: '2.3', name: 'يحافظ على سلامته في المجتمع' },
			  { id: 'ic-2-4', code: '2.4', name: 'يعرف كيفية الحصول على المساعدة في المجتمع' },
			  { id: 'ic-2-5', code: '2.5', name: 'يحافظ على سلامته على الإنترنت' },
			]
		  },
		  {
			id: 'road-safety-travel',
			number: 3,
			name: 'السلامة على الطرق والسفر',
			subcategories: [
			  { id: 'ic-3-1', code: '3.1', name: 'يمشي بأمان بجانب الطريق' },
			  { id: 'ic-3-2', code: '3.2', name: 'يعبر الطريق بأمان' },
			  { id: 'ic-3-3', code: '3.3', name: 'يعثر على الطريق أو يتبع الاتجاهات' },
			  { id: 'ic-3-4', code: '3.4', name: 'يخطط لرحلة أو خروج' },
			  { id: 'ic-3-5', code: '3.5', name: 'يستعد لاستخدام وسائل النقل العامة' },
			  { id: 'ic-3-6', code: '3.6', name: 'يستخدم وسائل النقل العامة' },
			  { id: 'ic-3-7', code: '3.7', name: 'يحل المشكلات التي قد تحدث أثناء السفر' },
			]
		  },
		  {
			id: 'leisure',
			number: 4,
			name: 'الترفيه',
			subcategories: [
			  { id: 'ic-4-1', code: '4.1', name: 'يُظهر تفضيلًا لأنشطة ترفيهية معينة' },
			  { id: 'ic-4-2', code: '4.2', name: 'يخطط لنشاطه الترفيهي' },
			  { id: 'ic-4-3', code: '4.3', name: 'ينخرط في تبادل اجتماعي ضمن النشاط الترفيهي' },
			  { id: 'ic-4-4', code: '4.4', name: 'يراعي الآخرين ضمن الأنشطة الترفيهية' },
			  { id: 'ic-4-5', code: '4.5', name: 'يقبل ويطبق الإرشادات ضمن الأنشطة الترفيهية' },
			]
		  },
		]
	  },
	]
  };

export const AET_FRAMEWORK: AETFramework = {
  areas: [
    // Area 1: Communication and Interaction
    {
      id: 'communication-interaction',
      name: 'Communication and Interaction',
      description: 'Skills related to communicating with others and understanding communication',
      color: 'navy',
      categories: [
        {
          id: 'engaging-interaction',
          number: 1,
          name: 'Engaging in interaction',
          subcategories: [
            { id: 'ci-1-1', code: '1.1', name: 'Responds positively to familiar adult' },
            { id: 'ci-1-2', code: '1.2', name: 'Seeks attention from familiar adult' },
            { id: 'ci-1-3', code: '1.3', name: 'Shares attention focus with adult' },
            { id: 'ci-1-4', code: '1.4', name: 'Engages in interactive exchange with adult' },
          ]
        },
        {
          id: 'making-requests',
          number: 2,
          name: 'Making requests',
          subcategories: [
            { id: 'ci-2-1', code: '2.1', name: 'Makes request for an item' },
            { id: 'ci-2-2', code: '2.2', name: 'Refuses an item / activity' },
            { id: 'ci-2-3', code: '2.3', name: 'Makes request for interaction to continue / stop' },
            { id: 'ci-2-4', code: '2.4', name: 'Requests help' },
            { id: 'ci-2-5', code: '2.5', name: 'Requests information / asks a question' },
          ]
        },
        {
          id: 'communicating-information',
          number: 3,
          name: 'Communicating information / commenting on events',
          subcategories: [
            { id: 'ci-3-1', code: '3.1', name: 'Answers a question' },
            { id: 'ci-3-2', code: '3.2', name: 'Communicates information about the past and future' },
            { id: 'ci-3-3', code: '3.3', name: 'Expresses opinions / thoughts / feelings' },
            { id: 'ci-3-4', code: '3.4', name: 'Gives instructions / explanations' },
            { id: 'ci-3-5', code: '3.5', name: 'Gives recounts and explanations' },
            { id: 'ci-3-6', code: '3.6', name: 'Comments/draws attention to item/event' },
          ]
        },
        {
          id: 'listening-understanding',
          number: 4,
          name: 'Listening and understanding',
          subcategories: [
            { id: 'ci-4-1', code: '4.1', name: 'Responds to sounds' },
            { id: 'ci-4-2', code: '4.2', name: 'Understands single spoken word' },
            { id: 'ci-4-3', code: '4.3', name: 'Understands simple statement' },
            { id: 'ci-4-4', code: '4.4', name: 'Understands instructions' },
            { id: 'ci-4-5', code: '4.5', name: 'Understands questions' },
            { id: 'ci-4-6', code: '4.6', name: 'Extracts relevant meaning / information' },
            { id: 'ci-4-7', code: '4.7', name: 'Understands humour and figurative speech' },
            { id: 'ci-4-8', code: '4.8', name: 'Understands informal speech / slang' },
          ]
        },
        {
          id: 'greetings',
          number: 5,
          name: 'Greetings',
          subcategories: [
            { id: 'ci-5-1', code: '5.1', name: 'Responds to greetings / being addressed' },
            { id: 'ci-5-2', code: '5.2', name: 'Greets others' },
          ]
        },
        {
          id: 'conversations',
          number: 6,
          name: 'Conversations',
          subcategories: [
            { id: 'ci-6-1', code: '6.1', name: "Gains another's attention" },
            { id: 'ci-6-2', code: '6.2', name: 'Takes lead in conversation' },
            { id: 'ci-6-3', code: '6.3', name: 'Responds to conversation partner' },
            { id: 'ci-6-4', code: '6.4', name: 'Maintains flow of conversation' },
          ]
        },
        {
          id: 'non-verbal-communication',
          number: 7,
          name: 'Non-verbal communication',
          subcategories: [
            { id: 'ci-7-1', code: '7.1', name: 'Adapts communication / behaviour to suit situation' },
            { id: 'ci-7-2', code: '7.2', name: "Shows evidence of 'active listening'" },
            { id: 'ci-7-3', code: '7.3', name: 'Understands non-verbal communication' },
          ]
        },
      ]
    },

    // Area 2: Social Understanding and Relationships
    {
      id: 'social-understanding',
      name: 'Social Understanding and Relationships',
      description: 'Skills related to social interaction and building relationships',
      color: 'red',
      categories: [
        {
          id: 'being-with-others',
          number: 1,
          name: 'Being with others',
          subcategories: [
            { id: 'su-1-1', code: '1.1', name: 'Accepts the presence of others in familiar environment' },
            { id: 'su-1-2', code: '1.2', name: 'Engages in shared activity' },
            { id: 'su-1-3', code: '1.3', name: 'Copes with proximity of others in public space' },
          ]
        },
        {
          id: 'interactive-play',
          number: 2,
          name: 'Interactive play',
          subcategories: [
            { id: 'su-2-1', code: '2.1', name: 'Accepts presence of adult in play environment' },
            { id: 'su-2-2', code: '2.2', name: 'Engages in interactive play with an adult' },
            { id: 'su-2-3', code: '2.3', name: 'Engages in object play with adult' },
            { id: 'su-2-4', code: '2.4', name: 'Engages in play with peers' },
          ]
        },
        {
          id: 'positive-relationships-adults',
          number: 3,
          name: 'Positive relationships (supporting adults)',
          subcategories: [
            { id: 'su-3-1', code: '3.1', name: 'Engages positively with supporting adult' },
            { id: 'su-3-2', code: '3.2', name: 'Accepts help from an adult' },
            { id: 'su-3-3', code: '3.3', name: 'Accesses activities / situations with adult support' },
            { id: 'su-3-4', code: '3.4', name: 'Seeks advice and support from adult' },
          ]
        },
        {
          id: 'positive-relationships-peers',
          number: 4,
          name: 'Positive relationships and friendships (peers)',
          subcategories: [
            { id: 'su-4-1', code: '4.1', name: 'Initiates interaction with peer/s' },
            { id: 'su-4-2', code: '4.2', name: 'Engages positively in interaction with peer/s' },
            { id: 'su-4-3', code: '4.3', name: "Takes account of others' interests / needs / feelings within interactions" },
            { id: 'su-4-4', code: '4.4', name: 'Takes action to sustain positive relationship' },
            { id: 'su-4-5', code: '4.5', name: 'Recognises negative or bullying behaviour towards self or others' },
          ]
        },
        {
          id: 'group-activities',
          number: 5,
          name: 'Group activities',
          subcategories: [
            { id: 'su-5-1', code: '5.1', name: 'Attends to focus of group' },
            { id: 'su-5-2', code: '5.2', name: 'Participates in group activity' },
            { id: 'su-5-3', code: '5.3', name: 'Is aware of self as part of group' },
            { id: 'su-5-4', code: '5.4', name: 'Understands and conforms to expectations of working in a group' },
            { id: 'su-5-5', code: '5.5', name: 'Participates in group discussion' },
          ]
        },
      ]
    },

    // Area 3: Sensory Processing
    {
      id: 'sensory-processing',
      name: 'Sensory Processing',
      description: 'Understanding and managing sensory needs and responses',
      color: 'teal',
      categories: [
        {
          id: 'understanding-sensory-needs',
          number: 1,
          name: 'Understanding and expressing own sensory needs',
          subcategories: [
            { id: 'sp-1-1', code: '1.1', name: 'Expresses sensory likes / dislikes' },
            { id: 'sp-1-2', code: '1.2', name: 'Understands own sensory needs' },
          ]
        },
        {
          id: 'responding-sensory-interventions',
          number: 2,
          name: 'Responding to sensory interventions',
          subcategories: [
            { id: 'sp-2-1', code: '2.1', name: 'Responds to sensory adaptations to the environment' },
            { id: 'sp-2-2', code: '2.2', name: 'Responds to sensory input from supporting adult' },
            { id: 'sp-2-3', code: '2.3', name: "Responds to input using sensory 'equipment'" },
            { id: 'sp-2-4', code: '2.4', name: 'Responds to regular sensory programmes' },
          ]
        },
        {
          id: 'increasing-tolerance',
          number: 3,
          name: 'Increasing tolerance of sensory input',
          subcategories: [
            { id: 'sp-3-1', code: '3.1', name: 'Shows increased tolerance of sensory input' },
          ]
        },
        {
          id: 'managing-sensory-needs',
          number: 4,
          name: 'Managing own sensory needs',
          subcategories: [
            { id: 'sp-4-1', code: '4.1', name: 'Accepts support to manage own behaviour in relation to sensory needs' },
            { id: 'sp-4-2', code: '4.2', name: "Requests others' help to manage sensory needs" },
            { id: 'sp-4-3', code: '4.3', name: 'Takes action to manage own sensory needs' },
            { id: 'sp-4-4', code: '4.4', name: 'Reflects on sensory needs and behaviour' },
          ]
        },
      ]
    },

    // Area 4: Interests, Routines and Processing
    {
      id: 'interests-routines',
      name: 'Interests, Routines and Processing',
      description: 'Managing change, transitions, interests and problem-solving',
      color: 'purple',
      categories: [
        {
          id: 'coping-with-change',
          number: 1,
          name: 'Coping with change',
          subcategories: [
            { id: 'ir-1-1', code: '1.1', name: 'Accepts change within familiar situations' },
            { id: 'ir-1-2', code: '1.2', name: 'Takes action to cope with change' },
          ]
        },
        {
          id: 'transitions',
          number: 2,
          name: 'Transitions',
          subcategories: [
            { id: 'ir-2-1', code: '2.1', name: "Makes successful transition in 'everyday' situation" },
            { id: 'ir-2-2', code: '2.2', name: 'Engages with preparation for transition to new setting' },
          ]
        },
        {
          id: 'special-interests',
          number: 3,
          name: 'Special interests',
          subcategories: [
            { id: 'ir-3-1', code: '3.1', name: 'Uses special interests to engage positively in activities / exchanges' },
            { id: 'ir-3-2', code: '3.2', name: 'Engages with a range of activities unrelated to special interests' },
          ]
        },
        {
          id: 'problem-solving',
          number: 4,
          name: 'Problem solving and thinking skills',
          subcategories: [
            { id: 'ir-4-1', code: '4.1', name: 'Makes a choice' },
            { id: 'ir-4-2', code: '4.2', name: 'Uses information available to make an appropriate choice' },
            { id: 'ir-4-3', code: '4.3', name: 'Sorts items into categories' },
            { id: 'ir-4-4', code: '4.4', name: 'Uses information to plan and predict' },
            { id: 'ir-4-5', code: '4.5', name: 'Makes deductions based on information available' },
            { id: 'ir-4-6', code: '4.6', name: 'Recognises and takes action to solve problems' },
            { id: 'ir-4-7', code: '4.7', name: 'Reflects on problems encountered and strategies used' },
          ]
        },
      ]
    },

    // Area 5: Emotional Understanding and Self-awareness
    {
      id: 'emotional-understanding',
      name: 'Emotional Understanding and Self-awareness',
      description: 'Understanding emotions, managing behaviour and self-awareness',
      color: 'green',
      categories: [
        {
          id: 'understanding-own-emotions',
          number: 1,
          name: 'Understanding and expressing own emotions',
          subcategories: [
            { id: 'eu-1-1', code: '1.1', name: 'Expresses a range of emotions' },
            { id: 'eu-1-2', code: '1.2', name: 'Identifies own emotions' },
            { id: 'eu-1-3', code: '1.3', name: 'Identifies cause of emotion' },
          ]
        },
        {
          id: 'managing-emotions',
          number: 2,
          name: 'Managing emotions and behaviour',
          subcategories: [
            { id: 'eu-2-1', code: '2.1', name: 'Responds to calming strategies of others' },
            { id: 'eu-2-2', code: '2.2', name: 'Uses own strategies to manage stress' },
            { id: 'eu-2-3', code: '2.3', name: 'Takes part in planning and preparing strategies to manage own emotions and behaviour' },
            { id: 'eu-2-4', code: '2.4', name: 'Uses taught strategies to manage emotions and behaviour' },
            { id: 'eu-2-5', code: '2.5', name: 'Reflects on behaviour' },
          ]
        },
        {
          id: 'understanding-others-emotions',
          number: 3,
          name: "Understanding others' emotions / intentions",
          subcategories: [
            { id: 'eu-3-1', code: '3.1', name: 'Recognises and responds to emotions in others' },
            { id: 'eu-3-2', code: '3.2', name: 'Identifies cause of emotions in others' },
            { id: 'eu-3-3', code: '3.3', name: "Makes judgements relating to other's behaviour" },
            { id: 'eu-3-4', code: '3.4', name: 'Identifies potential or actual risk within situations' },
            { id: 'eu-3-5', code: '3.5', name: "Is aware of difficulties with 'reading' others emotions / intentions" },
          ]
        },
        {
          id: 'self-awareness',
          number: 4,
          name: 'Self-awareness',
          subcategories: [
            { id: 'eu-4-1', code: '4.1', name: 'Identifies own characteristics' },
            { id: 'eu-4-2', code: '4.2', name: 'Identifies interests and strengths' },
            { id: 'eu-4-3', code: '4.3', name: 'Understands own diagnosis' },
            { id: 'eu-4-4', code: '4.4', name: 'Identifies difficulties' },
            { id: 'eu-4-5', code: '4.5', name: 'Is aware of change in relation to self' },
            { id: 'eu-4-6', code: '4.6', name: 'Participates in planning for own future' },
          ]
        },
        {
          id: 'developing-confidence',
          number: 5,
          name: 'Developing confidence and self-esteem',
          subcategories: [
            { id: 'eu-5-1', code: '5.1', name: 'Expresses preferences' },
            { id: 'eu-5-2', code: '5.2', name: 'Expresses opinions / ideas' },
            { id: 'eu-5-3', code: '5.3', name: 'Shows confidence within activities' },
            { id: 'eu-5-4', code: '5.4', name: 'Responds to negative behaviour' },
          ]
        },
      ]
    },

    // Area 6: Learning and Engagement
    {
      id: 'learning-engagement',
      name: 'Learning and Engagement',
      description: 'Play, motivation, organisation and evaluating learning',
      color: 'orange',
      categories: [
        {
          id: 'learning-through-play',
          number: 1,
          name: 'Learning through play',
          subcategories: [
            { id: 'le-1-1', code: '1.1', name: 'Explores toys / objects / materials' },
            { id: 'le-1-2', code: '1.2', name: 'Shows understanding of the purpose of toys / play items' },
            { id: 'le-1-3', code: '1.3', name: 'Engages in cause and effect play' },
            { id: 'le-1-4', code: '1.4', name: 'Engages in pretend / symbolic play' },
            { id: 'le-1-5', code: '1.5', name: 'Enacts story routine / play scenario' },
          ]
        },
        {
          id: 'motivation-engagement',
          number: 2,
          name: 'Motivation and engagement',
          subcategories: [
            { id: 'le-2-1', code: '2.1', name: 'Responds to sensory features of items, activities' },
            { id: 'le-2-2', code: '2.2', name: 'Responds to environment' },
            { id: 'le-2-3', code: '2.3', name: 'Responds to interaction from supporting adult or peer' },
            { id: 'le-2-4', code: '2.4', name: 'Anticipates / predicts what will happen' },
            { id: 'le-2-5', code: '2.5', name: 'Shows interest in items/activity/topic' },
            { id: 'le-2-6', code: '2.6', name: 'Explores / investigates items, activities' },
            { id: 'le-2-7', code: '2.7', name: 'Discovers new knowledge and understanding' },
            { id: 'le-2-8', code: '2.8', name: 'Attends to task, activity' },
            { id: 'le-2-9', code: '2.9', name: 'Persists with activity' },
            { id: 'le-2-10', code: '2.10', name: 'Shifts attention to another task / activity / request' },
            { id: 'le-2-11', code: '2.11', name: 'Initiates / makes request for activity' },
            { id: 'le-2-12', code: '2.12', name: 'Engages in negotiated tasks' },
          ]
        },
        {
          id: 'organisation-independent-learning',
          number: 3,
          name: 'Organisation and independent learning',
          subcategories: [
            { id: 'le-3-1', code: '3.1', name: 'Organises own belongings / resources' },
            { id: 'le-3-2', code: '3.2', name: 'Makes effective use of timetables / planners' },
            { id: 'le-3-3', code: '3.3', name: 'Shows awareness of time management' },
            { id: 'le-3-4', code: '3.4', name: 'Works independently' },
            { id: 'le-3-5', code: '3.5', name: 'Participates in planning own learning' },
            { id: 'le-3-6', code: '3.6', name: 'Plans work' },
            { id: 'le-3-7', code: '3.7', name: 'Carries out research into a topic' },
            { id: 'le-3-8', code: '3.8', name: 'Asks for help' },
          ]
        },
        {
          id: 'understanding-rules-routines',
          number: 4,
          name: 'Understanding and following rules, routines and expectations',
          subcategories: [
            { id: 'le-4-1', code: '4.1', name: 'Finds way around learning environment' },
            { id: 'le-4-2', code: '4.2', name: 'Copes with queueing / lining up' },
            { id: 'le-4-3', code: '4.3', name: 'Attracts attention in an appropriate manner' },
            { id: 'le-4-4', code: '4.4', name: 'Follows agreed strategies for movement within learning area' },
            { id: 'le-4-5', code: '4.5', name: 'Follows playtime/break time routines' },
            { id: 'le-4-6', code: '4.6', name: 'Shows increased tolerance in relation to expectations' },
          ]
        },
        {
          id: 'evaluating-own-learning',
          number: 5,
          name: 'Evaluating own learning',
          subcategories: [
            { id: 'le-5-1', code: '5.1', name: 'Evaluates own learning' },
            { id: 'le-5-2', code: '5.2', name: 'Applies understanding of own learning' },
            { id: 'le-5-3', code: '5.3', name: 'Knows and applies own strengths' },
            { id: 'le-5-4', code: '5.4', name: 'Recognises own difficulties' },
            { id: 'le-5-5', code: '5.5', name: 'Sets own learning goals' },
            { id: 'le-5-6', code: '5.6', name: 'Understands the consequences of own choices and actions' },
            { id: 'le-5-7', code: '5.7', name: 'Recognises own achievements' },
          ]
        },
      ]
    },

    // Area 7: Healthy Living
    {
      id: 'healthy-living',
      name: 'Healthy Living',
      description: 'Health, personal care and relationships education',
      color: 'blue',
      categories: [
        {
          id: 'keeping-healthy',
          number: 1,
          name: 'Keeping healthy',
          subcategories: [
            { id: 'hl-1-1', code: '1.1', name: 'Identifies own health needs' },
            { id: 'hl-1-2', code: '1.2', name: 'Copes with medical appointments' },
            { id: 'hl-1-3', code: '1.3', name: 'Understands benefits and risks of medicines' },
            { id: 'hl-1-4', code: '1.4', name: 'Knows how to limit spread of infection (coughs and colds)' },
            { id: 'hl-1-5', code: '1.5', name: 'Makes healthy choices in relation to food / drink' },
            { id: 'hl-1-6', code: '1.6', name: 'Tolerates an increasing range of foods' },
            { id: 'hl-1-7', code: '1.7', name: 'Makes healthy choices in relation to exercise' },
            { id: 'hl-1-8', code: '1.8', name: 'Makes healthy choices in relation to sleep' },
            { id: 'hl-1-9', code: '1.9', name: 'Understands the health risks associated with smoking and alcohol' },
            { id: 'hl-1-10', code: '1.10', name: 'Understands the law in relation to drugs, alcohol and smoking' },
          ]
        },
        {
          id: 'personal-care',
          number: 2,
          name: 'Personal care',
          subcategories: [
            { id: 'hl-2-1', code: '2.1', name: 'Use toilet independently in familiar setting' },
            { id: 'hl-2-2', code: '2.2', name: 'Uses public toilet' },
            { id: 'hl-2-3', code: '2.3', name: 'Maintains good hand hygiene' },
            { id: 'hl-2-4', code: '2.4', name: 'Maintains good bodily hygiene' },
            { id: 'hl-2-5', code: '2.5', name: 'Takes interest in own appearance' },
            { id: 'hl-2-6', code: '2.6', name: 'Identifies and manages sensory needs in relation to hygiene and clothing' },
            { id: 'hl-2-7', code: '2.7', name: 'Dresses self effectively' },
          ]
        },
        {
          id: 'relationships-sex-education',
          number: 3,
          name: 'Relationships and sex education',
          subcategories: [
            { id: 'hl-3-1', code: '3.1', name: 'Identifies personal characteristics' },
            { id: 'hl-3-2', code: '3.2', name: 'Recognises and accepts differences between people' },
            { id: 'hl-3-3', code: '3.3', name: 'Understands and accepts changes that occur at puberty' },
            { id: 'hl-3-4', code: '3.4', name: 'Understands personal space' },
            { id: 'hl-3-5', code: '3.5', name: "Distinguishes between 'public' and 'private'" },
            { id: 'hl-3-6', code: '3.6', name: 'Understands different types of relationships' },
            { id: 'hl-3-7', code: '3.7', name: 'Uses behaviour appropriate to relationship' },
            { id: 'hl-3-8', code: '3.8', name: 'Understands laws relating to consent in relationships' },
            { id: 'hl-3-9', code: '3.9', name: 'Keeps safe within relationships' },
            { id: 'hl-3-10', code: '3.10', name: 'Knows where to seek advice or help' },
          ]
        },
      ]
    },

    // Area 8: Independence and Community Participation
    {
      id: 'independence-community',
      name: 'Independence and Community Participation',
      description: 'Independent living, safety, travel and leisure',
      color: 'slate',
      categories: [
        {
          id: 'independent-living',
          number: 1,
          name: 'Independent living',
          subcategories: [
            { id: 'ic-1-1', code: '1.1', name: 'Manages own time / routines' },
            { id: 'ic-1-2', code: '1.2', name: 'Prepares a simple snack' },
            { id: 'ic-1-3', code: '1.3', name: 'Makes a drink for self and/or others' },
            { id: 'ic-1-4', code: '1.4', name: 'Prepares to make a meal' },
            { id: 'ic-1-5', code: '1.5', name: 'Prepares a meal' },
            { id: 'ic-1-6', code: '1.6', name: 'Participates in mealtime with others' },
            { id: 'ic-1-7', code: '1.7', name: 'Orders a meal' },
            { id: 'ic-1-8', code: '1.8', name: 'Prepares to go shopping' },
            { id: 'ic-1-9', code: '1.9', name: 'Shops for items' },
            { id: 'ic-1-10', code: '1.10', name: 'Pays for items in shop' },
            { id: 'ic-1-11', code: '1.11', name: 'Carries out household tasks' },
            { id: 'ic-1-12', code: '1.12', name: 'Manages own money' },
            { id: 'ic-1-13', code: '1.13', name: 'Uses a phone' },
            { id: 'ic-1-14', code: '1.14', name: 'Plans for the future' },
          ]
        },
        {
          id: 'personal-safety',
          number: 2,
          name: 'Personal safety',
          subcategories: [
            { id: 'ic-2-1', code: '2.1', name: 'Keeps safe in the home' },
            { id: 'ic-2-2', code: '2.2', name: 'Keeps safe at school' },
            { id: 'ic-2-3', code: '2.3', name: 'Keeps safe when out in the community' },
            { id: 'ic-2-4', code: '2.4', name: 'Knows how to get help in the community' },
            { id: 'ic-2-5', code: '2.5', name: 'Keeps safe on-line (e-safety)' },
          ]
        },
        {
          id: 'road-safety-travel',
          number: 3,
          name: 'Road safety and travel',
          subcategories: [
            { id: 'ic-3-1', code: '3.1', name: 'Walks safely by the side of road' },
            { id: 'ic-3-2', code: '3.2', name: 'Crosses road safely' },
            { id: 'ic-3-3', code: '3.3', name: 'Finds way / follows directions' },
            { id: 'ic-3-4', code: '3.4', name: 'Plans a journey / trip out' },
            { id: 'ic-3-5', code: '3.5', name: 'Prepares to use public transport' },
            { id: 'ic-3-6', code: '3.6', name: 'Uses public transport' },
            { id: 'ic-3-7', code: '3.7', name: 'Solves problems that may occur when travelling' },
          ]
        },
        {
          id: 'leisure',
          number: 4,
          name: 'Leisure',
          subcategories: [
            { id: 'ic-4-1', code: '4.1', name: 'Shows preference for particular leisure activities' },
            { id: 'ic-4-2', code: '4.2', name: 'Plans own leisure activity' },
            { id: 'ic-4-3', code: '4.3', name: 'Engages in social exchange within leisure activity' },
            { id: 'ic-4-4', code: '4.4', name: 'Takes account of others within leisure activities' },
            { id: 'ic-4-5', code: '4.5', name: 'Accepts and applies guidance within leisure activities' },
          ]
        },
      ]
    },
  ]
};

// Color classes for Tailwind CSS styling
export const COLOR_CLASSES: Record<string, {
  bg: string;
  bgDark: string;
  bgAccent: string;
  text: string;
  textDark: string;
  border: string;
}> = {
  blue: {
    bg: 'bg-blue-50',
    bgDark: 'bg-blue-100',
    bgAccent: 'bg-blue-500',
    text: 'text-blue-600',
    textDark: 'text-blue-800',
    border: 'border-blue-200',
  },
  navy: {
    bg: 'bg-indigo-50',
    bgDark: 'bg-indigo-100',
    bgAccent: 'bg-indigo-800',
    text: 'text-indigo-700',
    textDark: 'text-indigo-900',
    border: 'border-indigo-300',
  },
  red: {
    bg: 'bg-red-50',
    bgDark: 'bg-red-100',
    bgAccent: 'bg-red-500',
    text: 'text-red-600',
    textDark: 'text-red-800',
    border: 'border-red-200',
  },
  teal: {
    bg: 'bg-teal-50',
    bgDark: 'bg-teal-100',
    bgAccent: 'bg-teal-600',
    text: 'text-teal-600',
    textDark: 'text-teal-800',
    border: 'border-teal-200',
  },
  green: {
    bg: 'bg-green-50',
    bgDark: 'bg-green-100',
    bgAccent: 'bg-green-500',
    text: 'text-green-600',
    textDark: 'text-green-800',
    border: 'border-green-200',
  },
  purple: {
    bg: 'bg-purple-50',
    bgDark: 'bg-purple-100',
    bgAccent: 'bg-purple-700',
    text: 'text-purple-700',
    textDark: 'text-purple-900',
    border: 'border-purple-300',
  },
  slate: {
    bg: 'bg-slate-100',
    bgDark: 'bg-slate-200',
    bgAccent: 'bg-slate-700',
    text: 'text-slate-700',
    textDark: 'text-slate-900',
    border: 'border-slate-300',
  },
  amber: {
    bg: 'bg-amber-50',
    bgDark: 'bg-amber-100',
    bgAccent: 'bg-amber-500',
    text: 'text-amber-600',
    textDark: 'text-amber-800',
    border: 'border-amber-200',
  },
  rose: {
    bg: 'bg-rose-50',
    bgDark: 'bg-rose-100',
    bgAccent: 'bg-rose-500',
    text: 'text-rose-600',
    textDark: 'text-rose-800',
    border: 'border-rose-200',
  },
  cyan: {
    bg: 'bg-cyan-50',
    bgDark: 'bg-cyan-100',
    bgAccent: 'bg-cyan-500',
    text: 'text-cyan-600',
    textDark: 'text-cyan-800',
    border: 'border-cyan-200',
  },
  emerald: {
    bg: 'bg-emerald-50',
    bgDark: 'bg-emerald-100',
    bgAccent: 'bg-emerald-500',
    text: 'text-emerald-600',
    textDark: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  orange: {
    bg: 'bg-orange-50',
    bgDark: 'bg-orange-100',
    bgAccent: 'bg-orange-500',
    text: 'text-orange-600',
    textDark: 'text-orange-800',
    border: 'border-orange-200',
  },
};

// Progression levels (same for all subcategories)
export const PROGRESSION_LEVELS = [
  { level: 1, name: 'Not yet developed', shortName: 'NYD', color: 'bg-red-400', description: 'Skill is not yet developed and requires focused support' },
  { level: 2, name: 'Developing', shortName: 'Dev', color: 'bg-amber-400', description: 'Skill is developing with targeted support' },
  { level: 3, name: 'Established', shortName: 'Est', color: 'bg-green-500', description: 'Skill is established and consistent' },
  { level: 4, name: 'Generalised', shortName: 'Gen', color: 'bg-blue-500', description: 'Skill is generalised across different contexts' },
];

// Helper function to get total subcategory count
export function getTotalSubcategoryCount(): number {
  return AET_FRAMEWORK.areas.reduce((total, area) => 
    total + area.categories.reduce((catTotal, cat) => 
      catTotal + cat.subcategories.length, 0
    ), 0
  );
}

// Helper to find subcategory by ID
export function findSubcategoryById(id: string): { area: Area; category: Category; subcategory: Subcategory } | null {
  for (const area of AET_FRAMEWORK.areas) {
    for (const category of area.categories) {
      const subcategory = category.subcategories.find(s => s.id === id);
      if (subcategory) {
        return { area, category, subcategory };
      }
    }
  }
  return null;
}
