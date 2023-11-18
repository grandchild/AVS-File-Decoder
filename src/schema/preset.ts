import { z } from 'zod';

import { EffectList } from './effect-list';
import { MiscEffects } from './misc';
import { RenderEffects } from './render';
import { TransEffects } from './trans';


const presetBase = z.object({
	name: z.string(),
	date: z.union([
		z.string().datetime(),
		z.undefined()
	]),
	clearFrame: z.boolean(),
}).required();

type PresetBase = z.infer<typeof presetBase>;

export type PresetComponents = EffectList | MiscEffects | RenderEffects | TransEffects;
export type Preset = PresetBase & {
	components: PresetComponents[]
};
