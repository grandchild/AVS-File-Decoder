declare namespace Webvsc {
	interface Arguments {
			verbose?: number;
			quiet?: boolean;
			minify?: boolean;
			name?: string;
			noDate?: boolean;
			hidden?: boolean;
	}

	interface CodeSection {
			enabled?: boolean;
			init: string;
			perFrame: string;
			onBeat?: string;
			perPoint?: string;
			_hidden?: string[];
	}

	interface ComponentDefinition {
			readonly name: string;
			readonly code: number|number[];
			readonly group: string;
			readonly func: string;
			readonly fields?: Record<string, unknown>;
	}

	type JSONPrimitive = string | number | boolean | null;
	type JSONValue = JSONPrimitive | JSONObject | JSONArray;
	type JSONObject = { [member: string]: JSONValue };
	type JSONArray = Array<JSONValue>;
}

export = Webvsc;
export as namespace Webvsc;
