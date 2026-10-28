export const PER_TICKET = 5;
export const EXTRA = 5;

// Sualın hansı mövzu blokuna düşdüyü (suallar ardıcıllıqla 5 bərabər hissəyə bölünür)
export const blockOf = (i, n) => Math.floor((i * PER_TICKET) / n);

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/*
  Qaydalar:
  - hər biletdə 5 sual, mümkün qədər hər mövzu blokundan bir sual;
  - bütün suallar bir dəfə istifadə olunmayınca heç bir sual təkrarlanmır;
  - bir biletin içində sual heç vaxt təkrarlanmır.
*/
export function buildTickets(n, count) {
  const all = () => new Set([...Array(n).keys()]);
  let unused = all();
  const result = [];
  for (let t = 0; t < count; t++) {
    const tk = [];
    for (let b = 0; b < PER_TICKET; b++) {
      const choose = () => {
        let c = [...unused].filter(i => blockOf(i, n) === b && !tk.includes(i));
        if (!c.length) c = [...unused].filter(i => !tk.includes(i));
        return c;
      };
      let cand = choose();
      if (!cand.length) { unused = all(); cand = choose(); } // yeni dövr
      const q = pick(cand);
      tk.push(q);
      unused.delete(q);
    }
    result.push(tk.sort((a, b) => a - b));
  }
  return result;
}
