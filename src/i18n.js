// İnterfeys mətnləri (AZ / RU / EN)
export const UI = {
  az: {
    title: 'İmtahan biletləri generatoru',
    subtitle: 'Suallar faylını yükləyin, məlumatları yoxlayın və biletləri Word faylı kimi yükləyin.',
    madeBy: 'Hazırladı:',
    authorName: 'Ənvər Xalid',
    s1: 'Suallar faylı',
    dropMain: 'Faylı bura atın',
    dropOr: 'və ya klikləyin',
    dropHint: 'Word (.docx) faylı. Köhnə .doc faylını əvvəlcə Word-də “.docx” kimi saxlayın.',
    pasteSummary: 'Faylsız: sualları mətn kimi yapışdırın',
    pastePh: 'Hər sətirdə bir sual. Nömrələr (1. 2. ...) olsa da olar.',
    pasteBtn: 'Mətndən sualları götür',
    seeQs: 'Tapılan suallara bax',
    s2: 'Sektor, fənn və qrup',
    sector: 'Sektor (biletin dili)',
    hours: 'Fənnin saatı',
    hoursUnit: 'saat',
    students: 'Qrupdakı tələbə sayı',
    totalByHours: 'Saata görə ümumi sual sayı',
    totalHint: 'Bu rəqəmlər brauzerdə yadda saxlanılır. Faylda bu saydan çox sual olarsa, ilk suallar götürülür.',
    statTickets: 'Bilet sayı',
    statPer: 'Biletdə sual',
    statUsed: 'İstifadə olunacaq sual',
    s3: 'Biletin başlığı və imzalar',
    f_uni: 'Universitet', f_fac: 'Fakültə', f_dep: 'Kafedra', f_spec: 'İxtisas', f_course: 'Kurs',
    f_group: 'Qrup', f_subject: 'Fənn', f_head: 'Kafedra müdiri', f_teacher: 'Fənn müəllimi', f_year: 'İl',
    gen: 'Biletləri yarat', regen: 'Yenidən qarışdır', dl: 'Word (.docx) yüklə', print: 'Çap et / PDF',
    preview: 'Önbaxış', previewN: 'Önbaxış — {n} bilet', showNums: 'Sualın fayldakı nömrəsini göstər',
    empty: 'Biletlər burada görünəcək.',
    m_found: '<b>{src}</b>: {n} sual tapıldı.',
    m_none: 'Faylda nömrələnmiş sual tapılmadı. Sualların nömrəli siyahı şəklində olduğunu yoxlayın.',
    m_doc: 'Köhnə .doc formatı brauzerdə oxunmur. Faylı Word-də açıb “Fərqli saxla → Word sənədi (.docx)” edin və yenidən yükləyin.',
    m_bad: 'Fayl oxunmadı. Bunun Word (.docx) faylı olduğundan əmin olun.',
    m_pasted: 'Yapışdırılmış mətn',
    m_noExp: '{h} saatlıq fənn üçün ümumi sual sayı daxil edilməyib. Fayldakı bütün {n} sual istifadə olunacaq.',
    m_less: '{h} saatlıq fənn üçün {exp} sual lazımdır, faylda isə {n} sual var. Mövcud suallar istifadə olunacaq.',
    m_more: 'Faylda {n} sual var, {h} saat üçün ilk {exp} sual götürüləcək.',
    m_enough: '{t} biletə {need} sual lazımdır, heç bir sual təkrarlanmayacaq.',
    m_cycle: '{t} biletə {need} sual lazımdır. Əvvəlcə {n} sualın hamısı bir dəfə istifadə olunacaq, yalnız bundan sonra təkrar başlayacaq.',
    m_min: 'Ən azı {k} sual lazımdır.',
    m_changed: 'Saylar dəyişdi, biletləri yenidən yaradın.',
    m_done: '{t} bilet yaradıldı ({s} tələbə + {e} əlavə). ',
    m_doneUnused: '{u} sual istifadə olundu, heç biri təkrarlanmadı.',
    m_doneAll: 'Bütün {n} sual istifadə olundu, bir sual ən çox {m} dəfə düşdü.',
    sec_az: 'Azərbaycan', sec_ru: 'Rus', sec_en: 'İngilis',
  },
  ru: {
    title: 'Генератор экзаменационных билетов',
    subtitle: 'Загрузите файл с вопросами, проверьте данные и скачайте билеты в формате Word.',
    madeBy: 'Автор:',
    authorName: 'Анвар Халид',
    s1: 'Файл с вопросами',
    dropMain: 'Перетащите файл сюда',
    dropOr: 'или нажмите',
    dropHint: 'Файл Word (.docx). Старый файл .doc сначала сохраните в Word как «.docx».',
    pasteSummary: 'Без файла: вставьте вопросы текстом',
    pastePh: 'Один вопрос в строке. Номера (1. 2. ...) допускаются.',
    pasteBtn: 'Взять вопросы из текста',
    seeQs: 'Показать найденные вопросы',
    s2: 'Сектор, предмет и группа',
    sector: 'Сектор (язык билета)',
    hours: 'Количество часов по предмету',
    hoursUnit: 'часов',
    students: 'Количество студентов в группе',
    totalByHours: 'Общее число вопросов по часам',
    totalHint: 'Эти значения сохраняются в браузере. Если в файле вопросов больше, берутся первые.',
    statTickets: 'Билетов',
    statPer: 'Вопросов в билете',
    statUsed: 'Будет использовано вопросов',
    s3: 'Шапка билета и подписи',
    f_uni: 'Университет', f_fac: 'Факультет', f_dep: 'Кафедра', f_spec: 'Специальность', f_course: 'Курс',
    f_group: 'Группа', f_subject: 'Предмет', f_head: 'Заведующий кафедрой', f_teacher: 'Преподаватель', f_year: 'Год',
    gen: 'Создать билеты', regen: 'Перемешать заново', dl: 'Скачать Word (.docx)', print: 'Печать / PDF',
    preview: 'Предпросмотр', previewN: 'Предпросмотр — {n} билетов', showNums: 'Показывать номер вопроса в файле',
    empty: 'Здесь появятся билеты.',
    m_found: '<b>{src}</b>: найдено вопросов — {n}.',
    m_none: 'В файле не найдено нумерованных вопросов. Проверьте, что вопросы оформлены нумерованным списком.',
    m_doc: 'Старый формат .doc не читается в браузере. Откройте файл в Word, выберите «Сохранить как → Документ Word (.docx)» и загрузите снова.',
    m_bad: 'Не удалось прочитать файл. Убедитесь, что это файл Word (.docx).',
    m_pasted: 'Вставленный текст',
    m_noExp: 'Для предмета на {h} часов не указано общее число вопросов. Будут использованы все {n} вопросов из файла.',
    m_less: 'Для предмета на {h} часов нужно {exp} вопросов, а в файле {n}. Будут использованы имеющиеся.',
    m_more: 'В файле {n} вопросов, для {h} часов будут взяты первые {exp}.',
    m_enough: 'Для {t} билетов нужно {need} вопросов, повторов не будет.',
    m_cycle: 'Для {t} билетов нужно {need} вопросов. Сначала все {n} вопросов будут использованы по одному разу, только потом начнутся повторы.',
    m_min: 'Нужно не менее {k} вопросов.',
    m_changed: 'Значения изменились, создайте билеты заново.',
    m_done: 'Создано билетов: {t} ({s} студентов + {e} дополнительно). ',
    m_doneUnused: 'Использовано вопросов: {u}, повторов нет.',
    m_doneAll: 'Использованы все {n} вопросов, один вопрос встречается не более {m} раз.',
    sec_az: 'Азербайджанский', sec_ru: 'Русский', sec_en: 'Английский',
  },
  en: {
    title: 'Exam ticket generator',
    subtitle: 'Upload the question file, check the details and download the tickets as a Word file.',
    madeBy: 'Made by',
    authorName: 'Anvar Khalid',
    s1: 'Question file',
    dropMain: 'Drop the file here',
    dropOr: 'or click',
    dropHint: 'Word (.docx) file. Save an old .doc file as “.docx” in Word first.',
    pasteSummary: 'No file: paste the questions as text',
    pastePh: 'One question per line. Numbers (1. 2. ...) are fine.',
    pasteBtn: 'Use questions from text',
    seeQs: 'Show the questions found',
    s2: 'Sector, subject and group',
    sector: 'Sector (ticket language)',
    hours: 'Subject hours',
    hoursUnit: 'hours',
    students: 'Number of students in the group',
    totalByHours: 'Total number of questions by hours',
    totalHint: 'These values are saved in the browser. If the file has more questions, the first ones are used.',
    statTickets: 'Tickets',
    statPer: 'Questions per ticket',
    statUsed: 'Questions to use',
    s3: 'Ticket header and signatures',
    f_uni: 'University', f_fac: 'Faculty', f_dep: 'Department', f_spec: 'Specialty', f_course: 'Course',
    f_group: 'Group', f_subject: 'Subject', f_head: 'Head of Department', f_teacher: 'Instructor', f_year: 'Year',
    gen: 'Generate tickets', regen: 'Shuffle again', dl: 'Download Word (.docx)', print: 'Print / PDF',
    preview: 'Preview', previewN: 'Preview — {n} tickets', showNums: 'Show the question number from the file',
    empty: 'Tickets will appear here.',
    m_found: '<b>{src}</b>: {n} questions found.',
    m_none: 'No numbered questions were found. Check that the questions are a numbered list.',
    m_doc: 'The old .doc format cannot be read in the browser. Open the file in Word, choose “Save as → Word Document (.docx)” and upload it again.',
    m_bad: 'The file could not be read. Make sure it is a Word (.docx) file.',
    m_pasted: 'Pasted text',
    m_noExp: 'No total question count is set for a {h}-hour subject. All {n} questions in the file will be used.',
    m_less: 'A {h}-hour subject needs {exp} questions, but the file has {n}. The available questions will be used.',
    m_more: 'The file has {n} questions; the first {exp} will be used for {h} hours.',
    m_enough: '{t} tickets need {need} questions; no question will repeat.',
    m_cycle: '{t} tickets need {need} questions. All {n} questions are used once before any repeats begin.',
    m_min: 'At least {k} questions are needed.',
    m_changed: 'The numbers changed; generate the tickets again.',
    m_done: '{t} tickets generated ({s} students + {e} extra). ',
    m_doneUnused: '{u} questions used, none repeated.',
    m_doneAll: 'All {n} questions used; no question appears more than {m} times.',
    sec_az: 'Azerbaijani', sec_ru: 'Russian', sec_en: 'English',
  },
};

// Biletin üzərindəki yazılar — sektora görə
export const TICKET = {
  az: {
    fac: 'Fakültə', dep: 'Kafedra', spec: 'İxtisas', course: 'Kurs', group: 'Qrup', subject: 'Fənn',
    ticket: 'Bilet №:', head: 'Kafedra müdiri:', teacher: 'Fənn müəllimi:', seal: 'M.Y.',
    date: y => `“__” __________ ${y}-${azYearSuffix(y)} il`,
    file: 'Biletlər',
  },
  ru: {
    fac: 'Факультет', dep: 'Кафедра', spec: 'Специальность', course: 'Курс', group: 'Группа', subject: 'Предмет',
    ticket: 'Билет №:', head: 'Зав. кафедрой:', teacher: 'Преподаватель:', seal: 'М.П.',
    date: y => `«__» __________ ${y} г.`,
    file: 'Билеты',
  },
  en: {
    fac: 'Faculty', dep: 'Department', spec: 'Specialty', course: 'Course', group: 'Group', subject: 'Subject',
    ticket: 'Ticket №:', head: 'Head of Department:', teacher: 'Instructor:', seal: 'Seal',
    date: y => `“__” __________ ${y}`,
    file: 'Tickets',
  },
};

// Sektora görə başlıq sahələrinin ilkin dəyərləri (formada dəyişdirilə bilər)
export const DEFAULTS = {
  az: {
    uni: 'Odlar Yurdu Universiteti', fac: 'Təbiət və texnologiyalar',
    dep: 'İnformasiya texnologiyaları və informasiya təhlükəsizliyi', spec: 'İnformasiya texnologiyaları',
    course: 'III', head: 'akad.Əli Abbasov',
  },
  ru: {
    uni: 'Университет Одлар Юрду', fac: 'Природа и технологии',
    dep: 'Информационные технологии и информационная безопасность', spec: 'Информационные технологии',
    course: 'III', head: 'акад. Али Аббасов',
  },
  en: {
    uni: 'Odlar Yurdu University', fac: 'Nature and Technologies',
    dep: 'Information Technologies and Information Security', spec: 'Information Technologies',
    course: 'III', head: 'acad. Ali Abbasov',
  },
};

// 2026 → "cı", 2027 → "ci", 2029 → "cu", 2030 → "cu"
export function azYearSuffix(y) {
  const d = y % 10, t = Math.floor(y / 10) % 10;
  if (d) return { 1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü', 5: 'ci', 6: 'cı', 7: 'ci', 8: 'ci', 9: 'cu' }[d];
  if (t) return { 1: 'cu', 2: 'ci', 3: 'cu', 4: 'cı', 5: 'ci', 6: 'cı', 7: 'ci', 8: 'ci', 9: 'cı' }[t];
  return Math.floor(y / 100) % 10 ? 'cü' : 'ci';
}

export function fmt(str, params = {}) {
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in params ? params[k] : `{${k}}`));
}

/*
  Azərbaycan latın yazısını rus kiril yazısına çevirir (adlar üçün).
  Nümunə: "Mizanfarlı Ə.E" → "Мизанфарлы А.Э", "akad.Əli Abbasov" → "акад.Али Аббасов",
          "Rəfizadə Ü.R." → "Рафизаде Ю.Р.", "Həsənov Qasım" → "Гасанов Гасым"
*/
const AZ_RU = {
  a: 'а', b: 'б', c: 'дж', ç: 'ч', d: 'д', e: 'е', ə: 'а', f: 'ф', g: 'г', ğ: 'г', h: 'г', x: 'х',
  ı: 'ы', i: 'и', j: 'ж', k: 'к', q: 'г', l: 'л', m: 'м', n: 'н', o: 'о', ö: 'ё', p: 'п', r: 'р',
  s: 'с', ş: 'ш', t: 'т', u: 'у', ü: 'ю', v: 'в', y: 'й', z: 'з', w: 'в',
};
const Y_VOWEL = { a: 'я', ə: 'я', u: 'ю', ü: 'ю', e: 'е', o: 'ё' };

export const hasLatin = s => /[a-zəğıöüçş]/i.test(s);

export function azToRu(text) {
  return text.replace(/[A-Za-zƏəĞğİıÖöÜüÇçŞş]+/g, word => {
    const lower = word.toLocaleLowerCase('az');
    let out = '';
    for (let i = 0; i < lower.length; i++) {
      const c = lower[i], next = lower[i + 1];
      if (lower.startsWith('zadə', i) && i + 4 === lower.length) { out += 'заде'; break; }
      if (c === 'y' && next && Y_VOWEL[next]) { out += Y_VOWEL[next]; i++; continue; }
      if (c === 'e' && (i === 0)) { out += 'э'; continue; }
      const prev = lower[i - 1];
      if ((c === 'ü' || c === 'ö') && 'şçjc'.includes(prev || '-')) { out += c === 'ü' ? 'у' : 'о'; continue; }
      out += AZ_RU[c] ?? c;
    }
    // böyük hərf saxlanılır: ilk hərf və ya bütün söz (abreviatura)
    if (word.length > 1 && word === word.toLocaleUpperCase('az')) return out.toLocaleUpperCase('ru');
    if (word[0] === word[0].toLocaleUpperCase('az')) return out[0].toLocaleUpperCase('ru') + out.slice(1);
    return out;
  });
}
