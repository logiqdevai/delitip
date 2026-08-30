import { FeedbackQuestionType, ReviewSentiment, StoreIndustry } from 'generated/prisma';

// Every value below is real, hand-authored text (no translation stub) for
// each of the 11 supported Language enum members, lowercased as keys to
// match the ReviewCategory.name / FeedbackQuestion.question Json shape.
export interface LocalizedText {
    [languageCode: string]: string;
    en: string;
    el: string;
    es: string;
    fr: string;
    de: string;
    it: string;
    pt: string;
    tr: string;
    ru: string;
    ar: string;
    zh: string;
}

export interface IndustryReviewExampleQuestion {
    text: LocalizedText;
    type: FeedbackQuestionType;
}

export interface IndustryReviewExampleTag {
    text: LocalizedText;
    sentiment?: ReviewSentiment;
}

// Seeded once at Store creation time (§ industry-based review config) so a
// new store starts with a ready-to-use "Reviews & feedback config" instead
// of the empty state. Exactly 3 examples per section, per industry.
export interface IndustryReviewExample {
    categories: LocalizedText[];
    questions: IndustryReviewExampleQuestion[];
    tags: IndustryReviewExampleTag[];
}

export const INDUSTRY_REVIEW_EXAMPLES: Record<StoreIndustry, IndustryReviewExample> = {
    RESTAURANT: {
        categories: [
            { en: 'Food Quality', el: 'Ποιότητα Φαγητού', es: 'Calidad de la Comida', fr: 'Qualité des Plats', de: 'Essensqualität', it: 'Qualità del Cibo', pt: 'Qualidade da Comida', tr: 'Yemek Kalitesi', ru: 'Качество еды', ar: 'جودة الطعام', zh: '食物质量' },
            { en: 'Service Speed', el: 'Ταχύτητα Εξυπηρέτησης', es: 'Rapidez del Servicio', fr: 'Rapidité du Service', de: 'Servicegeschwindigkeit', it: 'Velocità del Servizio', pt: 'Rapidez do Atendimento', tr: 'Servis Hızı', ru: 'Скорость обслуживания', ar: 'سرعة الخدمة', zh: '服务速度' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate the taste of your meal?', el: 'Πώς θα βαθμολογούσατε τη γεύση του γεύματός σας;', es: '¿Cómo calificarías el sabor de tu comida?', fr: 'Comment évalueriez-vous le goût de votre repas ?', de: 'Wie würden Sie den Geschmack Ihres Essens bewerten?', it: 'Come valuteresti il sapore del tuo pasto?', pt: 'Como classificaria o sabor da sua refeição?', tr: 'Yemeğinizin tadını nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили вкус вашего блюда?', ar: 'كيف تقيّم طعم وجبتك؟', zh: '您如何评价这道菜的味道？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'Was your order served in a timely manner?', el: 'Σας σερβίρισαν την παραγγελία σας έγκαιρα;', es: '¿Se sirvió tu pedido a tiempo?', fr: 'Votre commande a-t-elle été servie rapidement ?', de: 'Wurde Ihre Bestellung rechtzeitig serviert?', it: 'Il tuo ordine è stato servito in tempi rapidi?', pt: 'O seu pedido foi servido dentro do tempo esperado?', tr: 'Siparişiniz zamanında servis edildi mi?', ru: 'Ваш заказ подали вовремя?', ar: 'هل تم تقديم طلبك في الوقت المناسب؟', zh: '您的订单是否及时送达？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: "Any dishes you'd like to see on the menu?", el: 'Υπάρχουν πιάτα που θα θέλατε να δείτε στο μενού;', es: '¿Hay algún plato que te gustaría ver en el menú?', fr: 'Y a-t-il des plats que vous aimeriez voir au menu ?', de: 'Gibt es Gerichte, die Sie sich auf der Speisekarte wünschen?', it: "C'è qualche piatto che vorresti vedere nel menù?", pt: 'Há algum prato que gostaria de ver no menu?', tr: 'Menüde görmek istediğiniz bir yemek var mı?', ru: 'Есть ли блюда, которые вы хотели бы видеть в меню?', ar: 'هل هناك أطباق تودّ رؤيتها في القائمة؟', zh: '您希望菜单上增加哪些菜品吗？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Delicious food', el: 'Νόστιμο φαγητό', es: 'Comida deliciosa', fr: 'Plats délicieux', de: 'Leckeres Essen', it: 'Cibo delizioso', pt: 'Comida deliciosa', tr: 'Lezzetli yemek', ru: 'Вкусная еда', ar: 'طعام لذيذ', zh: '美味佳肴' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Slow service', el: 'Αργή εξυπηρέτηση', es: 'Servicio lento', fr: 'Service lent', de: 'Langsamer Service', it: 'Servizio lento', pt: 'Atendimento lento', tr: 'Yavaş servis', ru: 'Медленное обслуживание', ar: 'خدمة بطيئة', zh: '服务缓慢' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Great atmosphere', el: 'Υπέροχη ατμόσφαιρα', es: 'Excelente ambiente', fr: 'Ambiance excellente', de: 'Tolle Atmosphäre', it: 'Ottima atmosfera', pt: 'Ótimo ambiente', tr: 'Harika atmosfer', ru: 'Прекрасная атмосфера', ar: 'أجواء رائعة', zh: '氛围极佳' } },
        ],
    },
    CAFE: {
        categories: [
            { en: 'Coffee Quality', el: 'Ποιότητα Καφέ', es: 'Calidad del Café', fr: 'Qualité du Café', de: 'Kaffeequalität', it: 'Qualità del Caffè', pt: 'Qualidade do Café', tr: 'Kahve Kalitesi', ru: 'Качество кофе', ar: 'جودة القهوة', zh: '咖啡品质' },
            { en: 'Ambiance', el: 'Ατμόσφαιρα', es: 'Ambiente', fr: 'Ambiance', de: 'Ambiente', it: 'Atmosfera', pt: 'Ambiente', tr: 'Atmosfer', ru: 'Атмосфера', ar: 'الأجواء', zh: '氛围' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate your coffee or drink?', el: 'Πώς θα βαθμολογούσατε τον καφέ ή το ρόφημά σας;', es: '¿Cómo calificarías tu café o bebida?', fr: 'Comment évalueriez-vous votre café ou boisson ?', de: 'Wie würden Sie Ihren Kaffee oder Ihr Getränk bewerten?', it: 'Come valuteresti il tuo caffè o la tua bevanda?', pt: 'Como classificaria o seu café ou bebida?', tr: 'Kahvenizi veya içeceğinizi nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили ваш кофе или напиток?', ar: 'كيف تقيّم قهوتك أو مشروبك؟', zh: '您如何评价您的咖啡或饮品？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How comfortable was the seating area?', el: 'Πόσο άνετος ήταν ο χώρος καθισμάτων;', es: '¿Qué tan cómoda fue la zona de asientos?', fr: "L'espace assis était-il confortable ?", de: 'Wie angenehm war der Sitzbereich?', it: "Quanto era comoda l'area seduta?", pt: 'Quão confortável foi a área de assentos?', tr: 'Oturma alanı ne kadar rahattı?', ru: 'Насколько удобной была зона отдыха?', ar: 'ما مدى راحة منطقة الجلوس؟', zh: '座位区舒适吗？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'What could we add to our menu?', el: 'Τι θα μπορούσαμε να προσθέσουμε στο μενού μας;', es: '¿Qué podríamos añadir a nuestro menú?', fr: 'Que pourrions-nous ajouter à notre menu ?', de: 'Was könnten wir unserer Speisekarte hinzufügen?', it: 'Cosa potremmo aggiungere al nostro menù?', pt: 'O que poderíamos adicionar ao nosso menu?', tr: 'Menümüze ne eklemeliyiz?', ru: 'Что нам стоит добавить в меню?', ar: 'ما الذي يمكننا إضافته إلى قائمتنا؟', zh: '我们应该在菜单中增加什么？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Great coffee', el: 'Υπέροχος καφές', es: 'Excelente café', fr: 'Excellent café', de: 'Toller Kaffee', it: 'Ottimo caffè', pt: 'Ótimo café', tr: 'Harika kahve', ru: 'Отличный кофе', ar: 'قهوة رائعة', zh: '绝佳咖啡' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Cozy atmosphere', el: 'Ζεστή ατμόσφαιρα', es: 'Ambiente acogedor', fr: 'Ambiance chaleureuse', de: 'Gemütliche Atmosphäre', it: 'Atmosfera accogliente', pt: 'Ambiente aconchegante', tr: 'Sıcak atmosfer', ru: 'Уютная атмосфера', ar: 'أجواء دافئة', zh: '温馨氛围' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Long wait', el: 'Μεγάλη αναμονή', es: 'Espera larga', fr: 'Attente longue', de: 'Lange Wartezeit', it: 'Attesa lunga', pt: 'Espera longa', tr: 'Uzun bekleme', ru: 'Долгое ожидание', ar: 'انتظار طويل', zh: '等待时间长' } },
        ],
    },
    BAR: {
        categories: [
            { en: 'Drink Quality', el: 'Ποιότητα Ποτών', es: 'Calidad de las Bebidas', fr: 'Qualité des Boissons', de: 'Getränkequalität', it: 'Qualità dei Drink', pt: 'Qualidade das Bebidas', tr: 'İçecek Kalitesi', ru: 'Качество напитков', ar: 'جودة المشروبات', zh: '饮品质量' },
            { en: 'Atmosphere', el: 'Ατμόσφαιρα', es: 'Ambiente', fr: 'Ambiance', de: 'Atmosphäre', it: 'Atmosfera', pt: 'Ambiente', tr: 'Atmosfer', ru: 'Атмосфера', ar: 'الأجواء', zh: '氛围' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate your drink?', el: 'Πώς θα βαθμολογούσατε το ποτό σας;', es: '¿Cómo calificarías tu bebida?', fr: 'Comment évalueriez-vous votre boisson ?', de: 'Wie würden Sie Ihr Getränk bewerten?', it: 'Come valuteresti il tuo drink?', pt: 'Como classificaria a sua bebida?', tr: 'İçeceğinizi nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили ваш напиток?', ar: 'كيف تقيّم مشروبك؟', zh: '您如何评价您的饮品？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How was the overall vibe tonight?', el: 'Πώς ήταν η γενική ατμόσφαιρα απόψε;', es: '¿Cómo estuvo el ambiente en general esta noche?', fr: "Comment était l'ambiance générale ce soir ?", de: 'Wie war die allgemeine Stimmung heute Abend?', it: "Com'era l'atmosfera generale stasera?", pt: 'Como estava o ambiente geral esta noite?', tr: 'Bu geceki genel atmosfer nasıldı?', ru: 'Какая была общая атмосфера сегодня вечером?', ar: 'كيف كانت الأجواء العامة الليلة؟', zh: '今晚整体氛围如何？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'Any suggestions for our drink menu?', el: 'Έχετε προτάσεις για τη λίστα ποτών μας;', es: '¿Alguna sugerencia para nuestra carta de bebidas?', fr: 'Des suggestions pour notre carte de boissons ?', de: 'Haben Sie Vorschläge für unsere Getränkekarte?', it: 'Suggerimenti per la nostra carta dei drink?', pt: 'Alguma sugestão para a nossa carta de bebidas?', tr: 'İçecek menümüz için önerileriniz var mı?', ru: 'Есть предложения по нашей барной карте?', ar: 'هل لديك اقتراحات لقائمة مشروباتنا؟', zh: '对我们的酒水单有什么建议吗？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Great cocktails', el: 'Υπέροχα κοκτέιλ', es: 'Excelentes cócteles', fr: 'Excellents cocktails', de: 'Tolle Cocktails', it: 'Ottimi cocktail', pt: 'Ótimos cocktails', tr: 'Harika kokteyller', ru: 'Отличные коктейли', ar: 'كوكتيلات رائعة', zh: '绝佳鸡尾酒' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Fun atmosphere', el: 'Διασκεδαστική ατμόσφαιρα', es: 'Ambiente divertido', fr: 'Ambiance festive', de: 'Unterhaltsame Atmosphäre', it: 'Atmosfera divertente', pt: 'Ambiente divertido', tr: 'Eğlenceli atmosfer', ru: 'Веселая атмосфера', ar: 'أجواء ممتعة', zh: '氛围欢乐' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Too noisy', el: 'Πολύ θορυβώδες', es: 'Demasiado ruidoso', fr: 'Trop bruyant', de: 'Zu laut', it: 'Troppo rumoroso', pt: 'Demasiado barulhento', tr: 'Çok gürültülü', ru: 'Слишком шумно', ar: 'صاخب جدًا', zh: '过于嘈杂' } },
        ],
    },
    HOTEL: {
        categories: [
            { en: 'Room Cleanliness', el: 'Καθαριότητα Δωματίου', es: 'Limpieza de la Habitación', fr: 'Propreté de la Chambre', de: 'Sauberkeit des Zimmers', it: 'Pulizia della Camera', pt: 'Limpeza do Quarto', tr: 'Oda Temizliği', ru: 'Чистота номера', ar: 'نظافة الغرفة', zh: '客房清洁度' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
            { en: 'Check-in Experience', el: 'Εμπειρία Check-in', es: 'Experiencia de Check-in', fr: "Expérience d'Enregistrement", de: 'Check-in-Erlebnis', it: 'Esperienza di Check-in', pt: 'Experiência de Check-in', tr: 'Check-in Deneyimi', ru: 'Опыт заселения', ar: 'تجربة تسجيل الوصول', zh: '入住登记体验' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate the cleanliness of your room?', el: 'Πώς θα βαθμολογούσατε την καθαριότητα του δωματίου σας;', es: '¿Cómo calificarías la limpieza de tu habitación?', fr: 'Comment évalueriez-vous la propreté de votre chambre ?', de: 'Wie würden Sie die Sauberkeit Ihres Zimmers bewerten?', it: 'Come valuteresti la pulizia della tua camera?', pt: 'Como classificaria a limpeza do seu quarto?', tr: 'Odanızın temizliğini nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили чистоту вашего номера?', ar: 'كيف تقيّم نظافة غرفتك؟', zh: '您如何评价客房的清洁度？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How comfortable was your stay overall?', el: 'Πόσο άνετη ήταν συνολικά η διαμονή σας;', es: '¿Qué tan cómoda fue tu estancia en general?', fr: 'Votre séjour a-t-il été confortable dans l\'ensemble ?', de: 'Wie angenehm war Ihr Aufenthalt insgesamt?', it: 'Quanto è stato confortevole il tuo soggiorno in generale?', pt: 'Quão confortável foi a sua estadia em geral?', tr: 'Konaklamanız genel olarak ne kadar rahattı?', ru: 'Насколько комфортным было ваше пребывание в целом?', ar: 'ما مدى راحة إقامتك بشكل عام؟', zh: '您整体入住体验舒适吗？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'What could we improve about your stay?', el: 'Τι θα μπορούσαμε να βελτιώσουμε στη διαμονή σας;', es: '¿Qué podríamos mejorar de tu estancia?', fr: 'Que pourrions-nous améliorer concernant votre séjour ?', de: 'Was könnten wir an Ihrem Aufenthalt verbessern?', it: 'Cosa potremmo migliorare del tuo soggiorno?', pt: 'O que poderíamos melhorar na sua estadia?', tr: 'Konaklamanızla ilgili neyi geliştirebiliriz?', ru: 'Что нам стоит улучшить в вашем пребывании?', ar: 'ما الذي يمكننا تحسينه في إقامتك؟', zh: '我们在哪些方面可以改进您的入住体验？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Spotless room', el: 'Άψογα καθαρό δωμάτιο', es: 'Habitación impecable', fr: 'Chambre impeccable', de: 'Makelloses Zimmer', it: 'Camera impeccabile', pt: 'Quarto impecável', tr: 'Tertemiz oda', ru: 'Безупречно чистый номер', ar: 'غرفة نظيفة تمامًا', zh: '房间一尘不染' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Helpful staff', el: 'Εξυπηρετικό προσωπικό', es: 'Personal servicial', fr: 'Personnel serviable', de: 'Hilfsbereites Personal', it: 'Personale disponibile', pt: 'Equipa prestável', tr: 'Yardımsever personel', ru: 'Отзывчивый персонал', ar: 'موظفون متعاونون', zh: '员工乐于助人' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Noisy room', el: 'Θορυβώδες δωμάτιο', es: 'Habitación ruidosa', fr: 'Chambre bruyante', de: 'Lautes Zimmer', it: 'Camera rumorosa', pt: 'Quarto barulhento', tr: 'Gürültülü oda', ru: 'Шумный номер', ar: 'غرفة صاخبة', zh: '房间嘈杂' } },
        ],
    },
    SALON: {
        categories: [
            { en: 'Service Quality', el: 'Ποιότητα Υπηρεσίας', es: 'Calidad del Servicio', fr: 'Qualité du Service', de: 'Servicequalität', it: 'Qualità del Servizio', pt: 'Qualidade do Serviço', tr: 'Hizmet Kalitesi', ru: 'Качество услуги', ar: 'جودة الخدمة', zh: '服务质量' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
            { en: 'Cleanliness', el: 'Καθαριότητα', es: 'Limpieza', fr: 'Propreté', de: 'Sauberkeit', it: 'Pulizia', pt: 'Limpeza', tr: 'Temizlik', ru: 'Чистота', ar: 'النظافة', zh: '清洁度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How happy are you with your new look?', el: 'Πόσο ικανοποιημένοι είστε με τη νέα σας εμφάνιση;', es: '¿Qué tan feliz estás con tu nuevo look?', fr: 'Êtes-vous satisfait de votre nouveau look ?', de: 'Wie zufrieden sind Sie mit Ihrem neuen Look?', it: 'Quanto sei soddisfatto del tuo nuovo look?', pt: 'Está satisfeito com o seu novo visual?', tr: 'Yeni görünümünüzden ne kadar memnunsunuz?', ru: 'Насколько вы довольны своим новым образом?', ar: 'ما مدى سعادتك بمظهرك الجديد؟', zh: '您对新造型满意吗？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How was your overall salon experience?', el: 'Πώς ήταν η συνολική εμπειρία σας στο σαλόνι;', es: '¿Cómo fue tu experiencia general en el salón?', fr: "Comment s'est passée votre expérience globale au salon ?", de: 'Wie war Ihr Gesamterlebnis im Salon?', it: "Com'è stata la tua esperienza complessiva nel salone?", pt: 'Como foi a sua experiência geral no salão?', tr: 'Genel salon deneyiminiz nasıldı?', ru: 'Каким было ваше общее впечатление от салона?', ar: 'كيف كانت تجربتك العامة في الصالون؟', zh: '您对沙龙的整体体验如何？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: "Any stylist you'd like to thank by name?", el: 'Υπάρχει κάποιος στυλίστας που θα θέλατε να ευχαριστήσετε ονομαστικά;', es: '¿Hay algún estilista al que te gustaría agradecer por su nombre?', fr: 'Y a-t-il un coiffeur ou une coiffeuse que vous aimeriez remercier nommément ?', de: 'Möchten Sie einem Stylisten namentlich danken?', it: "C'è uno stylist che vorresti ringraziare per nome?", pt: 'Há algum cabeleireiro que gostaria de agradecer pelo nome?', tr: 'İsim vererek teşekkür etmek istediğiniz bir stilist var mı?', ru: 'Хотите поблагодарить кого-то из стилистов по имени?', ar: 'هل هناك مصفف تودّ شكره بالاسم؟', zh: '有想要点名感谢的造型师吗？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Amazing result', el: 'Εκπληκτικό αποτέλεσμα', es: 'Resultado increíble', fr: 'Résultat incroyable', de: 'Erstaunliches Ergebnis', it: 'Risultato incredibile', pt: 'Resultado incrível', tr: 'Harika sonuç', ru: 'Потрясающий результат', ar: 'نتيجة مذهلة', zh: '效果惊艳' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Friendly stylist', el: 'Φιλικός στυλίστας', es: 'Estilista amable', fr: 'Coiffeur aimable', de: 'Freundlicher Stylist', it: 'Stylist cordiale', pt: 'Cabeleireiro simpático', tr: 'Güleryüzlü stilist', ru: 'Дружелюбный стилист', ar: 'مصفف ودود', zh: '造型师亲切友善' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Long wait time', el: 'Μεγάλος χρόνος αναμονής', es: 'Tiempo de espera largo', fr: "Temps d'attente long", de: 'Lange Wartezeit', it: 'Tempo di attesa lungo', pt: 'Tempo de espera longo', tr: 'Uzun bekleme süresi', ru: 'Долгое время ожидания', ar: 'وقت انتظار طويل', zh: '等待时间过长' } },
        ],
    },
    SPA: {
        categories: [
            { en: 'Treatment Quality', el: 'Ποιότητα Θεραπείας', es: 'Calidad del Tratamiento', fr: 'Qualité du Soin', de: 'Behandlungsqualität', it: 'Qualità del Trattamento', pt: 'Qualidade do Tratamento', tr: 'Bakım Kalitesi', ru: 'Качество процедуры', ar: 'جودة العلاج', zh: '疗程质量' },
            { en: 'Relaxation', el: 'Χαλάρωση', es: 'Relajación', fr: 'Relaxation', de: 'Entspannung', it: 'Relax', pt: 'Relaxamento', tr: 'Rahatlama', ru: 'Расслабление', ar: 'الاسترخاء', zh: '放松程度' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate your treatment?', el: 'Πώς θα βαθμολογούσατε τη θεραπεία σας;', es: '¿Cómo calificarías tu tratamiento?', fr: 'Comment évalueriez-vous votre soin ?', de: 'Wie würden Sie Ihre Behandlung bewerten?', it: 'Come valuteresti il tuo trattamento?', pt: 'Como classificaria o seu tratamento?', tr: 'Bakımınızı nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили вашу процедуру?', ar: 'كيف تقيّم علاجك؟', zh: '您如何评价您的疗程？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How relaxed did you feel afterward?', el: 'Πόσο χαλαροί νιώσατε μετά;', es: '¿Qué tan relajado te sentiste después?', fr: "Vous êtes-vous senti(e) détendu(e) après ?", de: 'Wie entspannt haben Sie sich danach gefühlt?', it: 'Quanto ti sei sentito rilassato dopo?', pt: 'Quão relaxado se sentiu depois?', tr: 'Sonrasında ne kadar rahatladınız?', ru: 'Насколько расслабленным вы себя чувствовали после?', ar: 'ما مدى شعورك بالاسترخاء بعد ذلك؟', zh: '疗程后您感到放松吗？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'What treatment would you like us to add?', el: 'Ποια θεραπεία θα θέλατε να προσθέσουμε;', es: '¿Qué tratamiento te gustaría que añadiéramos?', fr: 'Quel soin aimeriez-vous que nous ajoutions ?', de: 'Welche Behandlung würden Sie sich wünschen?', it: 'Quale trattamento vorresti che aggiungessimo?', pt: 'Que tratamento gostaria que adicionássemos?', tr: 'Eklememizi istediğiniz bir bakım var mı?', ru: 'Какую процедуру вы хотели бы, чтобы мы добавили?', ar: 'ما العلاج الذي تودّ أن نضيفه؟', zh: '您希望我们增加哪种疗程？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Very relaxing', el: 'Πολύ χαλαρωτικό', es: 'Muy relajante', fr: 'Très relaxant', de: 'Sehr entspannend', it: 'Molto rilassante', pt: 'Muito relaxante', tr: 'Çok rahatlatıcı', ru: 'Очень расслабляюще', ar: 'مريح جدًا', zh: '非常放松' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Skilled therapist', el: 'Ικανός θεραπευτής', es: 'Terapeuta experto', fr: 'Thérapeute compétent', de: 'Erfahrener Therapeut', it: 'Terapista esperto', pt: 'Terapeuta habilidoso', tr: 'Yetenekli terapist', ru: 'Опытный специалист', ar: 'معالج ماهر', zh: '技师技艺精湛' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Rushed session', el: 'Βιαστική συνεδρία', es: 'Sesión apresurada', fr: 'Séance précipitée', de: 'Gehetzte Sitzung', it: 'Sessione affrettata', pt: 'Sessão apressada', tr: 'Aceleye getirilmiş seans', ru: 'Поспешная процедура', ar: 'جلسة متسرعة', zh: '疗程仓促' } },
        ],
    },
    RETAIL: {
        categories: [
            { en: 'Product Quality', el: 'Ποιότητα Προϊόντων', es: 'Calidad del Producto', fr: 'Qualité des Produits', de: 'Produktqualität', it: 'Qualità del Prodotto', pt: 'Qualidade do Produto', tr: 'Ürün Kalitesi', ru: 'Качество товара', ar: 'جودة المنتج', zh: '产品质量' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
            { en: 'Store Experience', el: 'Εμπειρία Καταστήματος', es: 'Experiencia en la Tienda', fr: 'Expérience en Magasin', de: 'Einkaufserlebnis', it: 'Esperienza in Negozio', pt: 'Experiência na Loja', tr: 'Mağaza Deneyimi', ru: 'Опыт посещения магазина', ar: 'تجربة المتجر', zh: '店铺体验' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate the products you purchased?', el: 'Πώς θα βαθμολογούσατε τα προϊόντα που αγοράσατε;', es: '¿Cómo calificarías los productos que compraste?', fr: 'Comment évalueriez-vous les produits achetés ?', de: 'Wie würden Sie die gekauften Produkte bewerten?', it: 'Come valuteresti i prodotti che hai acquistato?', pt: 'Como classificaria os produtos que comprou?', tr: 'Satın aldığınız ürünleri nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили приобретенные товары?', ar: 'كيف تقيّم المنتجات التي اشتريتها؟', zh: '您如何评价您购买的产品？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How helpful was our staff?', el: 'Πόσο εξυπηρετικό ήταν το προσωπικό μας;', es: '¿Qué tan servicial fue nuestro personal?', fr: 'Notre personnel a-t-il été serviable ?', de: 'Wie hilfsbereit war unser Personal?', it: 'Quanto è stato disponibile il nostro personale?', pt: 'Quão prestável foi a nossa equipa?', tr: 'Personelimiz ne kadar yardımcı oldu?', ru: 'Насколько полезен был наш персонал?', ar: 'ما مدى تعاون موظفينا؟', zh: '我们的员工是否乐于助人？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'What products would you like us to carry?', el: 'Ποια προϊόντα θα θέλατε να διαθέτουμε;', es: '¿Qué productos te gustaría que tuviéramos?', fr: 'Quels produits aimeriez-vous que nous proposions ?', de: 'Welche Produkte würden Sie sich in unserem Sortiment wünschen?', it: 'Quali prodotti vorresti che avessimo?', pt: 'Que produtos gostaria que tivéssemos?', tr: 'Bulundurmamızı istediğiniz ürünler var mı?', ru: 'Какие товары вы хотели бы у нас видеть?', ar: 'ما المنتجات التي تودّ أن نوفرها؟', zh: '您希望我们增加哪些产品？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Great selection', el: 'Υπέροχη ποικιλία', es: 'Excelente selección', fr: 'Excellente sélection', de: 'Tolle Auswahl', it: 'Ottima selezione', pt: 'Ótima seleção', tr: 'Harika seçenekler', ru: 'Отличный ассортимент', ar: 'تشكيلة رائعة', zh: '选择丰富' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Helpful staff', el: 'Εξυπηρετικό προσωπικό', es: 'Personal servicial', fr: 'Personnel serviable', de: 'Hilfsbereites Personal', it: 'Personale disponibile', pt: 'Equipa prestável', tr: 'Yardımsever personel', ru: 'Отзывчивый персонал', ar: 'موظفون متعاونون', zh: '员工乐于助人' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Long checkout line', el: 'Μεγάλη ουρά στο ταμείο', es: 'Fila larga en caja', fr: 'File d\'attente longue en caisse', de: 'Lange Warteschlange an der Kasse', it: 'Coda lunga alla cassa', pt: 'Fila longa na caixa', tr: 'Kasada uzun kuyruk', ru: 'Длинная очередь на кассе', ar: 'طابور طويل عند الدفع', zh: '结账排队时间长' } },
        ],
    },
    BARBERSHOP: {
        categories: [
            { en: 'Haircut Quality', el: 'Ποιότητα Κουρέματος', es: 'Calidad del Corte', fr: 'Qualité de la Coupe', de: 'Qualität des Haarschnitts', it: 'Qualità del Taglio', pt: 'Qualidade do Corte', tr: 'Saç Kesimi Kalitesi', ru: 'Качество стрижки', ar: 'جودة قصة الشعر', zh: '理发质量' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
            { en: 'Cleanliness', el: 'Καθαριότητα', es: 'Limpieza', fr: 'Propreté', de: 'Sauberkeit', it: 'Pulizia', pt: 'Limpeza', tr: 'Temizlik', ru: 'Чистота', ar: 'النظافة', zh: '清洁度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How happy are you with your haircut?', el: 'Πόσο ικανοποιημένοι είστε με το κούρεμά σας;', es: '¿Qué tan feliz estás con tu corte de pelo?', fr: 'Êtes-vous satisfait de votre coupe de cheveux ?', de: 'Wie zufrieden sind Sie mit Ihrem Haarschnitt?', it: 'Quanto sei soddisfatto del tuo taglio?', pt: 'Está satisfeito com o seu corte de cabelo?', tr: 'Saç kesiminizden ne kadar memnunsunuz?', ru: 'Насколько вы довольны своей стрижкой?', ar: 'ما مدى سعادتك بقصة شعرك؟', zh: '您对理发效果满意吗？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How was your overall experience today?', el: 'Πώς ήταν η συνολική εμπειρία σας σήμερα;', es: '¿Cómo fue tu experiencia general hoy?', fr: "Comment s'est passée votre expérience globale aujourd'hui ?", de: 'Wie war Ihr Gesamterlebnis heute?', it: "Com'è stata la tua esperienza complessiva oggi?", pt: 'Como foi a sua experiência geral hoje?', tr: 'Bugünkü genel deneyiminiz nasıldı?', ru: 'Каким было ваше общее впечатление сегодня?', ar: 'كيف كانت تجربتك العامة اليوم؟', zh: '您今天的整体体验如何？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: "Any barber you'd like to thank by name?", el: 'Υπάρχει κάποιος κουρέας που θα θέλατε να ευχαριστήσετε ονομαστικά;', es: '¿Hay algún barbero al que te gustaría agradecer por su nombre?', fr: 'Y a-t-il un barbier que vous aimeriez remercier nommément ?', de: 'Möchten Sie einem Barbier namentlich danken?', it: "C'è un barbiere che vorresti ringraziare per nome?", pt: 'Há algum barbeiro que gostaria de agradecer pelo nome?', tr: 'İsim vererek teşekkür etmek istediğiniz bir berber var mı?', ru: 'Хотите поблагодарить кого-то из барберов по имени?', ar: 'هل هناك حلاق تودّ شكره بالاسم؟', zh: '有想要点名感谢的理发师吗？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Perfect haircut', el: 'Τέλειο κούρεμα', es: 'Corte perfecto', fr: 'Coupe parfaite', de: 'Perfekter Haarschnitt', it: 'Taglio perfetto', pt: 'Corte perfeito', tr: 'Mükemmel kesim', ru: 'Идеальная стрижка', ar: 'قصة شعر مثالية', zh: '完美发型' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Friendly barber', el: 'Φιλικός κουρέας', es: 'Barbero amable', fr: 'Barbier aimable', de: 'Freundlicher Barbier', it: 'Barbiere cordiale', pt: 'Barbeiro simpático', tr: 'Güleryüzlü berber', ru: 'Дружелюбный барбер', ar: 'حلاق ودود', zh: '理发师亲切友善' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Long wait', el: 'Μεγάλη αναμονή', es: 'Espera larga', fr: 'Attente longue', de: 'Lange Wartezeit', it: 'Attesa lunga', pt: 'Espera longa', tr: 'Uzun bekleme', ru: 'Долгое ожидание', ar: 'انتظار طويل', zh: '等待时间长' } },
        ],
    },
    FITNESS: {
        categories: [
            { en: 'Class Quality', el: 'Ποιότητα Μαθήματος', es: 'Calidad de la Clase', fr: 'Qualité du Cours', de: 'Kursqualität', it: 'Qualità del Corso', pt: 'Qualidade da Aula', tr: 'Ders Kalitesi', ru: 'Качество занятия', ar: 'جودة الحصة', zh: '课程质量' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
            { en: 'Facility Cleanliness', el: 'Καθαριότητα Εγκαταστάσεων', es: 'Limpieza de las Instalaciones', fr: 'Propreté des Installations', de: 'Sauberkeit der Einrichtung', it: 'Pulizia della Struttura', pt: 'Limpeza das Instalações', tr: 'Tesis Temizliği', ru: 'Чистота помещения', ar: 'نظافة المرفق', zh: '设施清洁度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: "How would you rate today's class or session?", el: 'Πώς θα βαθμολογούσατε το σημερινό μάθημα ή τη σημερινή προπόνηση;', es: '¿Cómo calificarías la clase o sesión de hoy?', fr: "Comment évalueriez-vous le cours ou la séance d'aujourd'hui ?", de: 'Wie würden Sie den heutigen Kurs oder die heutige Einheit bewerten?', it: "Come valuteresti la lezione o la sessione di oggi?", pt: 'Como classificaria a aula ou sessão de hoje?', tr: 'Bugünkü dersi veya seansı nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили сегодняшнее занятие?', ar: 'كيف تقيّم حصة أو جلسة اليوم؟', zh: '您如何评价今天的课程或训练？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How clean and well-maintained was the facility?', el: 'Πόσο καθαρές και καλά συντηρημένες ήταν οι εγκαταστάσεις;', es: '¿Qué tan limpias y bien mantenidas estaban las instalaciones?', fr: "Les installations étaient-elles propres et bien entretenues ?", de: 'Wie sauber und gepflegt war die Einrichtung?', it: 'Quanto era pulita e ben tenuta la struttura?', pt: 'Quão limpas e bem cuidadas estavam as instalações?', tr: 'Tesis ne kadar temiz ve bakımlıydı?', ru: 'Насколько чистым и ухоженным было помещение?', ar: 'ما مدى نظافة المرفق وصيانته؟', zh: '设施是否干净整洁、维护良好？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'What class or equipment would you like us to add?', el: 'Ποιο μάθημα ή εξοπλισμό θα θέλατε να προσθέσουμε;', es: '¿Qué clase o equipo te gustaría que añadiéramos?', fr: 'Quel cours ou équipement aimeriez-vous que nous ajoutions ?', de: 'Welchen Kurs oder welches Gerät würden Sie sich wünschen?', it: 'Quale corso o attrezzatura vorresti che aggiungessimo?', pt: 'Que aula ou equipamento gostaria que adicionássemos?', tr: 'Eklememizi istediğiniz bir ders veya ekipman var mı?', ru: 'Какое занятие или оборудование вы хотели бы, чтобы мы добавили?', ar: 'ما الحصة أو المعدات التي تودّ أن نضيفها؟', zh: '您希望我们增加哪种课程或器材？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Great workout', el: 'Υπέροχη προπόνηση', es: 'Excelente entrenamiento', fr: 'Excellent entraînement', de: 'Tolles Training', it: 'Ottimo allenamento', pt: 'Ótimo treino', tr: 'Harika antrenman', ru: 'Отличная тренировка', ar: 'تمرين رائع', zh: '锻炼效果极佳' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Motivating trainer', el: 'Παρακινητικός προπονητής', es: 'Entrenador motivador', fr: 'Entraîneur motivant', de: 'Motivierender Trainer', it: 'Istruttore motivante', pt: 'Treinador motivador', tr: 'Motive edici eğitmen', ru: 'Мотивирующий тренер', ar: 'مدرب محفّز', zh: '教练很有激励力' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Crowded equipment', el: 'Συνωστισμός στον εξοπλισμό', es: 'Equipos abarrotados', fr: 'Équipements surchargés', de: 'Überfüllte Geräte', it: 'Attrezzature affollate', pt: 'Equipamentos lotados', tr: 'Kalabalık ekipman alanı', ru: 'Переполненные тренажеры', ar: 'ازدحام في المعدات', zh: '器材区拥挤' } },
        ],
    },
    FOOD_TRUCK: {
        categories: [
            { en: 'Food Quality', el: 'Ποιότητα Φαγητού', es: 'Calidad de la Comida', fr: 'Qualité des Plats', de: 'Essensqualität', it: 'Qualità del Cibo', pt: 'Qualidade da Comida', tr: 'Yemek Kalitesi', ru: 'Качество еды', ar: 'جودة الطعام', zh: '食物质量' },
            { en: 'Order Speed', el: 'Ταχύτητα Παραγγελίας', es: 'Rapidez del Pedido', fr: 'Rapidité de la Commande', de: 'Bestellgeschwindigkeit', it: "Velocità dell'Ordine", pt: 'Rapidez do Pedido', tr: 'Sipariş Hızı', ru: 'Скорость заказа', ar: 'سرعة الطلب', zh: '点餐速度' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate your meal?', el: 'Πώς θα βαθμολογούσατε το γεύμα σας;', es: '¿Cómo calificarías tu comida?', fr: 'Comment évalueriez-vous votre repas ?', de: 'Wie würden Sie Ihr Essen bewerten?', it: 'Come valuteresti il tuo pasto?', pt: 'Como classificaria a sua refeição?', tr: 'Yemeğinizi nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили вашу еду?', ar: 'كيف تقيّم وجبتك؟', zh: '您如何评价这道餐点？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How was your wait time?', el: 'Πώς ήταν ο χρόνος αναμονής σας;', es: '¿Cómo fue tu tiempo de espera?', fr: "Comment était votre temps d'attente ?", de: 'Wie war Ihre Wartezeit?', it: "Com'è stato il tuo tempo di attesa?", pt: 'Como foi o seu tempo de espera?', tr: 'Bekleme süreniz nasıldı?', ru: 'Каким было ваше время ожидания?', ar: 'كيف كان وقت انتظارك؟', zh: '您的等待时间如何？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: "Any dishes you'd like us to add to the menu?", el: 'Υπάρχουν πιάτα που θα θέλατε να προσθέσουμε στο μενού;', es: '¿Hay algún plato que te gustaría que añadiéramos al menú?', fr: 'Y a-t-il des plats que vous aimeriez voir ajoutés au menu ?', de: 'Gibt es Gerichte, die wir zur Speisekarte hinzufügen sollten?', it: "C'è qualche piatto che vorresti aggiungessimo al menù?", pt: 'Há algum prato que gostaria que adicionássemos ao menu?', tr: 'Menüye eklememizi istediğiniz bir yemek var mı?', ru: 'Есть блюда, которые вы хотели бы видеть в меню?', ar: 'هل هناك أطباق تودّ أن نضيفها إلى القائمة؟', zh: '您希望我们在菜单中增加哪些菜品？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Delicious food', el: 'Νόστιμο φαγητό', es: 'Comida deliciosa', fr: 'Plats délicieux', de: 'Leckeres Essen', it: 'Cibo delizioso', pt: 'Comida deliciosa', tr: 'Lezzetli yemek', ru: 'Вкусная еда', ar: 'طعام لذيذ', zh: '美味佳肴' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Fast service', el: 'Γρήγορη εξυπηρέτηση', es: 'Servicio rápido', fr: 'Service rapide', de: 'Schneller Service', it: 'Servizio rapido', pt: 'Atendimento rápido', tr: 'Hızlı servis', ru: 'Быстрое обслуживание', ar: 'خدمة سريعة', zh: '服务迅速' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Long wait', el: 'Μεγάλη αναμονή', es: 'Espera larga', fr: 'Attente longue', de: 'Lange Wartezeit', it: 'Attesa lunga', pt: 'Espera longa', tr: 'Uzun bekleme', ru: 'Долгое ожидание', ar: 'انتظار طويل', zh: '等待时间长' } },
        ],
    },
    CLEANING: {
        categories: [
            { en: 'Cleaning Quality', el: 'Ποιότητα Καθαρισμού', es: 'Calidad de la Limpieza', fr: 'Qualité du Nettoyage', de: 'Reinigungsqualität', it: 'Qualità della Pulizia', pt: 'Qualidade da Limpeza', tr: 'Temizlik Kalitesi', ru: 'Качество уборки', ar: 'جودة التنظيف', zh: '清洁质量' },
            { en: 'Staff Professionalism', el: 'Επαγγελματισμός Προσωπικού', es: 'Profesionalismo del Personal', fr: 'Professionnalisme du Personnel', de: 'Professionalität des Personals', it: 'Professionalità del Personale', pt: 'Profissionalismo da Equipa', tr: 'Personel Profesyonelliği', ru: 'Профессионализм персонала', ar: 'احترافية الموظفين', zh: '员工专业度' },
            { en: 'Punctuality', el: 'Συνέπεια στο Ωράριο', es: 'Puntualidad', fr: 'Ponctualité', de: 'Pünktlichkeit', it: 'Puntualità', pt: 'Pontualidade', tr: 'Dakiklik', ru: 'Пунктуальность', ar: 'الالتزام بالمواعيد', zh: '准时度' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate the quality of the cleaning?', el: 'Πώς θα βαθμολογούσατε την ποιότητα του καθαρισμού;', es: '¿Cómo calificarías la calidad de la limpieza?', fr: 'Comment évalueriez-vous la qualité du nettoyage ?', de: 'Wie würden Sie die Qualität der Reinigung bewerten?', it: 'Come valuteresti la qualità della pulizia?', pt: 'Como classificaria a qualidade da limpeza?', tr: 'Temizlik kalitesini nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили качество уборки?', ar: 'كيف تقيّم جودة التنظيف؟', zh: '您如何评价清洁质量？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'Was the cleaner punctual and professional?', el: 'Ήταν ο καθαριστής συνεπής και επαγγελματίας;', es: '¿El personal de limpieza fue puntual y profesional?', fr: 'Le professionnel du nettoyage était-il ponctuel et professionnel ?', de: 'War die Reinigungskraft pünktlich und professionell?', it: "L'addetto alle pulizie è stato puntuale e professionale?", pt: 'O profissional de limpeza foi pontual e profissional?', tr: 'Temizlikçi dakik ve profesyonel miydi?', ru: 'Был ли клинер пунктуальным и профессиональным?', ar: 'هل كان عامل التنظيف منضبطًا ومحترفًا؟', zh: '清洁人员是否准时且专业？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'Anything we should pay extra attention to next time?', el: 'Υπάρχει κάτι στο οποίο θα έπρεπε να δώσουμε ιδιαίτερη προσοχή την επόμενη φορά;', es: '¿Hay algo a lo que deberíamos prestar más atención la próxima vez?', fr: 'Y a-t-il quelque chose à quoi nous devrions prêter plus attention la prochaine fois ?', de: 'Sollten wir beim nächsten Mal auf etwas besonders achten?', it: 'C\'è qualcosa a cui dovremmo prestare più attenzione la prossima volta?', pt: 'Há algo a que devêssemos dar mais atenção da próxima vez?', tr: 'Bir dahaki sefere ekstra dikkat etmemiz gereken bir şey var mı?', ru: 'Есть что-то, на что нам стоит обратить особое внимание в следующий раз?', ar: 'هل هناك شيء يجب أن نوليه اهتمامًا إضافيًا في المرة القادمة؟', zh: '下次我们应该特别注意什么吗？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Spotless clean', el: 'Άψογα καθαρό', es: 'Impecablemente limpio', fr: 'Impeccablement propre', de: 'Makellos sauber', it: 'Pulizia impeccabile', pt: 'Impecavelmente limpo', tr: 'Tertemiz', ru: 'Безупречная чистота', ar: 'نظافة تامة', zh: '一尘不染' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Professional service', el: 'Επαγγελματική εξυπηρέτηση', es: 'Servicio profesional', fr: 'Service professionnel', de: 'Professioneller Service', it: 'Servizio professionale', pt: 'Serviço profissional', tr: 'Profesyonel hizmet', ru: 'Профессиональное обслуживание', ar: 'خدمة احترافية', zh: '服务专业' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Missed spots', el: 'Παραλείψεις σε σημεία', es: 'Zonas sin limpiar', fr: 'Zones oubliées', de: 'Übersehene Stellen', it: 'Zone trascurate', pt: 'Zonas por limpar', tr: 'Atlanan bölgeler', ru: 'Пропущенные места', ar: 'أماكن مهملة', zh: '有遗漏区域' } },
        ],
    },
    OTHER: {
        categories: [
            { en: 'Overall Quality', el: 'Συνολική Ποιότητα', es: 'Calidad General', fr: 'Qualité Générale', de: 'Gesamtqualität', it: 'Qualità Complessiva', pt: 'Qualidade Geral', tr: 'Genel Kalite', ru: 'Общее качество', ar: 'الجودة العامة', zh: '整体质量' },
            { en: 'Staff Friendliness', el: 'Φιλικότητα Προσωπικού', es: 'Amabilidad del Personal', fr: 'Amabilité du Personnel', de: 'Freundlichkeit des Personals', it: 'Cortesia del Personale', pt: 'Simpatia da Equipa', tr: 'Personel Güleryüzlülüğü', ru: 'Дружелюбие персонала', ar: 'ود الموظفين', zh: '员工友善度' },
            { en: 'Value for Money', el: 'Σχέση Ποιότητας-Τιμής', es: 'Relación Calidad-Precio', fr: 'Rapport Qualité-Prix', de: 'Preis-Leistungs-Verhältnis', it: 'Rapporto Qualità-Prezzo', pt: 'Relação Qualidade-Preço', tr: 'Fiyat Performans', ru: 'Соотношение цены и качества', ar: 'القيمة مقابل السعر', zh: '性价比' },
        ],
        questions: [
            { type: FeedbackQuestionType.RATING, text: { en: 'How would you rate your overall experience?', el: 'Πώς θα βαθμολογούσατε τη συνολική εμπειρία σας;', es: '¿Cómo calificarías tu experiencia general?', fr: 'Comment évalueriez-vous votre expérience globale ?', de: 'Wie würden Sie Ihr Gesamterlebnis bewerten?', it: 'Come valuteresti la tua esperienza complessiva?', pt: 'Como classificaria a sua experiência geral?', tr: 'Genel deneyiminizi nasıl değerlendirirsiniz?', ru: 'Как бы вы оценили ваш общий опыт?', ar: 'كيف تقيّم تجربتك العامة؟', zh: '您如何评价整体体验？' } },
            { type: FeedbackQuestionType.RATING, text: { en: 'How friendly and helpful was our staff?', el: 'Πόσο φιλικό και εξυπηρετικό ήταν το προσωπικό μας;', es: '¿Qué tan amable y servicial fue nuestro personal?', fr: 'Notre personnel a-t-il été aimable et serviable ?', de: 'Wie freundlich und hilfsbereit war unser Personal?', it: 'Quanto è stato cordiale e disponibile il nostro personale?', pt: 'Quão simpática e prestável foi a nossa equipa?', tr: 'Personelimiz ne kadar güler yüzlü ve yardımseverdi?', ru: 'Насколько дружелюбным и полезным был наш персонал?', ar: 'ما مدى ود وتعاون موظفينا؟', zh: '我们的员工是否友善且乐于助人？' } },
            { type: FeedbackQuestionType.TEXT, text: { en: 'What could we do better next time?', el: 'Τι θα μπορούσαμε να κάνουμε καλύτερα την επόμενη φορά;', es: '¿Qué podríamos hacer mejor la próxima vez?', fr: 'Que pourrions-nous faire de mieux la prochaine fois ?', de: 'Was könnten wir beim nächsten Mal besser machen?', it: 'Cosa potremmo fare meglio la prossima volta?', pt: 'O que poderíamos fazer melhor da próxima vez?', tr: 'Bir dahaki sefere neyi daha iyi yapabiliriz?', ru: 'Что нам стоит сделать лучше в следующий раз?', ar: 'ما الذي يمكننا فعله بشكل أفضل في المرة القادمة؟', zh: '下次我们可以做得更好的地方是什么？' } },
        ],
        tags: [
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Great experience', el: 'Υπέροχη εμπειρία', es: 'Excelente experiencia', fr: 'Excellente expérience', de: 'Tolle Erfahrung', it: 'Esperienza fantastica', pt: 'Ótima experiência', tr: 'Harika deneyim', ru: 'Отличный опыт', ar: 'تجربة رائعة', zh: '体验极佳' } },
            { sentiment: ReviewSentiment.POSITIVE, text: { en: 'Friendly staff', el: 'Φιλικό προσωπικό', es: 'Personal amable', fr: 'Personnel aimable', de: 'Freundliches Personal', it: 'Personale cordiale', pt: 'Equipa simpática', tr: 'Güleryüzlü personel', ru: 'Дружелюбный персонал', ar: 'موظفون ودودون', zh: '员工友善' } },
            { sentiment: ReviewSentiment.NEGATIVE, text: { en: 'Needs improvement', el: 'Χρειάζεται βελτίωση', es: 'Necesita mejorar', fr: 'À améliorer', de: 'Verbesserungsbedürftig', it: 'Da migliorare', pt: 'Precisa de melhorias', tr: 'Geliştirilmesi gerekiyor', ru: 'Требует улучшения', ar: 'يحتاج إلى تحسين', zh: '有待改进' } },
        ],
    },
};
