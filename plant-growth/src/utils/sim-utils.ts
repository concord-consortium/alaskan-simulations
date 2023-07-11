// TODO: add simulation constants here

export function linearMap(a:number, b:number, c:number, d:number, t:number){
  const scale = (d-c)/(b-a);
  const offset = -a*(d-c)/(b-a)+c;
  return (t*scale)+offset;
}
