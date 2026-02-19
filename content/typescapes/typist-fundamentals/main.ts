import { is_, extends_, has_, t_ } from './typist.lib'

// here's a basic type assertion
// we can use is_ to assert that values belong to a given type, invalid assertions will produce TypeScript errors. We can leverage @ts-expect-error to write negative tests that ensure certain values do not conform to expected types.

type Positive = '👍' | '👌' | '🎉' | '😊'

is_<Positive>('🎉') // ✓

// @ts-expect-error ✓
// type '👎' is not assignable to type 'Positive'.
is_<Positive>('👎')

// let's try out different assignment behaviors

const smile = '😊'

is_<string>(smile) // ✓
is_<Positive>(smile) // ✓
is_<'😓'|'😊'>(smile) // ✓
// is_<'😓'|'👹'>(smile)

const party:string = '🎉' 

is_<string>(party) // ✓

// @ts-expect-error ✓
// type 'string' is not assignable to type 'Positive'.
is_<Positive>(party)

// Use extends_ to prove that one type is more specific than another.

type Reaction = '👍' | '👎' | '👌' | '🎉' | '😊' | '😢' | '❓' | '💡'

extends_<Positive, Reaction>() // ✓

// @ts-expect-error ✓
// type 'Reactions' does not satisfy the constraint 'Positive'
extends_<Reaction, Positive>()

// @ts-expect-error ✓
// type 'Positive' does not satisfy the constraint '👍'.
//  type '😊' is not assignable to type '👍'.
extends_<Positive, '👍'>()

// we can use runtime identifiers as either regular arguments `(t:T)`, or as type arguments `<T>` by extracting their types using 'typeof` 

export const random
  = <T>( arr: T[] ): T =>
  { const und = (v: unknown): v is undefined => v === void 0
    const between
      = (a1?: number, a2?: number): number =>
      { let min: number, max: number
        if (und(a1)) min = 0, max = 100
        else if (und(a2)) max = a1, min = 0
        else max = a2, min = a1
        const { floor, random } = Math
        return floor(random() * (max - min + 1)) + min }
    return arr[ between(0, arr.length - 1) ] as T }

const hand = random(['👍','👎','👌'] as const)

is_<Reaction>(hand) // ✓

// @ts-expect-error ✓
// type '👎' is not assignable to type 'Positive'
is_<Positive>(hand)

is_<typeof hand>('👍') // ✓
is_<typeof hand>('👎') // ✓

// likewise, we can use type identifiers as type arguments `<T>`, or as regular arguments `(t:T)` by creating a phantom value

type Hand = '👍' | '👎' | '👌'

extends_<Hand, Reaction>() // ✓
extends_(hand, t_<Reaction>()) // ✓

is_<Hand>(hand) // ✓
is_<typeof hand>(t_<Hand>()) // ✓

// Let's model a user system with different access levels. We can use typist to prove properties about these types both at the type level and with runtime objects.
// we can drill deeply into runtime and type-level structures following the same principles

type RegularUser = { name:string }
type PremiumUser = RegularUser & { premiumSince:Date }
type User = RegularUser | PremiumUser

has_<'name', string>(t_<User>()) // ✓

// @ts-expect-error ✓
// property 'premiumSince' is missing in type 'RegularUser'
has_<'premiumSince', string>(t_<User>()) // ✓

const alice = { name:'alice' } as const
const bob = { name:'bob', premiumSince:new Date('2022-01-01') } as const

has_<'name', string>(bob) // ✓
has_<'premiumSince', Date>(bob) // ✓

is_<typeof bob['premiumSince']>(t_<Date>()) // ✓

is_<PremiumUser>(bob) // ✓
extends_<typeof bob, RegularUser>() // ✓

is_<User['name']>(alice.name) // ✓
is_<'alice'>(alice.name) // ✓

// @ts-expect-error ✓
// type 'alice' is not assignable to type 'bob'
is_<'bob'>(alice.name) // ✓

// @ts-expect-error ✓
// property 'premiumSince' missing
has_<'premiumSince', Date>(alice)

// @ts-expect-error ✓
// property 'premiumSince' missing
is_<PremiumUser>(alice)

// we can make assert invariants that are contextual to our type guards and control flow logic

type ExclusiveReaction = '💎' | '🐸'

type PremiumFeedback 
  = { user:PremiumUser, 
      reaction:Reaction | ExclusiveReaction, 
      text:string }

type RegularFeedback
  = { user:RegularUser,
      reaction:Reaction,
      text:string }

type Feedback 
  = RegularFeedback | PremiumFeedback

const isPremiumUser 
  = (user:User): user is PremiumUser => 
    'premiumSince' in user

const isPremiumFeedback
  = (feedback:Feedback): feedback is PremiumFeedback => 
    isPremiumUser(feedback.user)

const getFeedback 
  = async (): Promise<Feedback> => t_<Feedback>()

const feedback0 = await getFeedback()

if (isPremiumFeedback(feedback0))
  { extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓
    is_<PremiumUser>(feedback0.user) // ✓ 
    has_<'premiumSince'>(feedback0.user) } // ✓
else 
  { // @ts-expect-error ✓ 
    // type '"💎"' is not assignable to type 'Reaction'
    extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓ 
    
    // @ts-expect-error ✓
    // type 'RegularUser' is not assignable to parameter of type 'PremiumUser'
    is_<PremiumUser>(feedback0.user) 

    is_<RegularUser>(feedback0.user) } // ✓