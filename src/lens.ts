export interface Lens<T, V> {
  get(x: T): V;
}

class Combine<T extends Lens<A, B>, Q extends Lens<B, C>, A, B, C>
  implements Lens<A, C>
{
  constructor(private t: T, private q: Q) {}

  get(x: A): C {
    return this.q.get(this.t.get(x));
  }
}

export function combine<T, Q, R>(x: Lens<T, Q>, other: Lens<Q, R>): Lens<T, R> {
  return new Combine(x, other);
}
