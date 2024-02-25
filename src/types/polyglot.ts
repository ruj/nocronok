import type Polyglot from 'node-polyglot'

export type PolyglotExtended = Polyglot & { yn: (condition: boolean) => string }
