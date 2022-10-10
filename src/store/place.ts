export interface ChinaTotal {
	confirm: number;
	heal: number;
	dead: number;
	nowConfirm: number;
	suspect: number;
	nowSevere: number;
	importedCase: number;
	noInfect: number;
	showLocalConfirm: number;
	showlocalinfeciton: number;
	localConfirm: number;
	noInfectH5: number;
	localConfirmH5: number;
	local_acc_confirm: number;
}

export interface ChinaAdd {
	confirm: number;
	heal: number;
	dead: number;
	nowConfirm: number;
	suspect: number;
	nowSevere: number;
	importedCase: number;
	noInfect: number;
	localConfirm: number;
	noInfectH5: number;
	localConfirmH5: number;
}

export interface ShowAddSwitch {
	all: boolean;
	confirm: boolean;
	suspect: boolean;
	dead: boolean;
	heal: boolean;
	nowConfirm: boolean;
	nowSevere: boolean;
	importedCase: boolean;
	noInfect: boolean;
	localConfirm: boolean;
	localinfeciton: boolean;
}

export interface Today {
	confirm: number;
	isUpdated: boolean;
}

export interface Total {
	nowConfirm: number;
	confirm: number;
	dead: number;
	showRate: boolean;
	heal: number;
	showHeal: boolean;
	wzz: number;
	provinceLocalConfirm: number;
}

export interface Today {
	confirm: number;
	confirmCuts: number;
	isUpdated: boolean;
	tip: string;
	wzz_add: number;
}

export interface Total {
	nowConfirm: number;
	confirm: number;
	dead: number;
	showRate: boolean;
	heal: number;
	showHeal: boolean;
	wzz: number;
	provinceLocalConfirm: number;
}

export interface Today {
	confirm: number;
	confirmCuts: number;
	isUpdated: boolean;
}

export interface Total {
	nowConfirm: number;
	confirm: number;
	dead: number;
	showRate: boolean;
	heal: number;
	showHeal: boolean;
	wzz: number;
	provinceLocalConfirm: number;
}

export interface Children {
	name: string;
	today: Today;
	total: Total;
}

export interface Children {
	name: string;
	today: Today;
	total: Total;
	children: Children[];
}

export interface AreaTree {
	name: string;
	today: Today;
	total: Total;
	children: Children[];
}

export interface RootObject {
	lastUpdateTime: string;
	chinaTotal: ChinaTotal;
	chinaAdd: ChinaAdd;
	isShowAdd: boolean;
	showAddSwitch: ShowAddSwitch;
	areaTree: AreaTree[];
}