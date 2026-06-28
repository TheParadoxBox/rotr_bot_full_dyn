// fully dynamic rotr bot functions
// written by paradox

// --- BATTLE FUNCTION ------------------------------------------------------ //
//
// Calculate a battle between two divisions.
//
// position key:
//      0: Regular/sea level hex
//      1: Hill hex
//      2: Mountain hex
//      3: Peak hex
// atkAdd and defAdd allow to add custom additive manpower modifiers. For
// example, the Freikorps' active ability adds 5% attack.
//
// -------------------------------------------------------------------------- //

function battle(atkStartTroops, defStartTroops, atkPos, defPos, atkAdd, defAdd, river) {
    // modifiers
    let atkMod = (river) ? -0.1 : 0 + atkAdd;
    switch(atkPos) {
        case 0: // regular
            break;
        case 1: // hill
            atkMod += 0.1;
            break;
        case 2: // mountain
            atkMod += 0.15;
            break;
        case 3: // peak
            atkMod += 0.2;
            break;
    }
    let defMod = defAdd;
    switch(defPos) {
        case 0: // regular
            break;
        case 1: // hill
            defMod += 0.1;
            break;
        case 2: // mountain
            defMod += 0.15;
            break;
        case 3: // peak
            defMod += 0.2;
            break;
    }

    const atkEffective = atkStartTroops * (1 + atkMod);
    const defEffective = defStartTroops * (1 + defMod);

    // beta coin flip; get a number between -defStartTroops and atkStartTroops.
    // if negative, def wins. If positive, atk wins.
    const coinflip = Math.floor(Math.random() * (atkEffective + defEffective));
    const atkWins = coinflip > defEffective;
    const loserTroops = (atkWins) ? defEffective : atkEffective;
    const winnerTroops = (atkWins) ? atkEffective : defEffective;

    let newLoserTroops = loserTroops * 0.9 - Math.round(Math.abs(atkStartTroops - defStartTroops) / 3);

    return [atkWins, Math.round(newLoserTroops)];
}

// --- ANALYZE FUNCTION ----------------------------------------------------- //
//
// Get the chance that either side wins a battle. Unlike V1 Redux, this uses a
// uniform distribution, so it's very easy to calculate without simulations.
//
// Returns the chance for attackers to win.
//
// -------------------------------------------------------------------------- //

function analyze(atkStartTroops, defStartTroops, atkPos, defPos, atkAdd, defAdd, river) {
    // this is copied from battle. hopefully i don't have to change it
    // modifiers
    let atkMod = (river) ? -0.1 : 0 + atkAdd;
    switch(atkPos) {
        case 0: // regular
            break;
        case 1: // hill
            atkMod += 0.1;
            break;
        case 2: // mountain
            atkMod += 0.15;
            break;
        case 3: // peak
            atkMod += 0.2;
            break;
    }
    let defMod = defAdd;
    switch(defPos) {
        case 0: // regular
            break;
        case 1: // hill
            defMod += 0.1;
            break;
        case 2: // mountain
            defMod += 0.15;
            break;
        case 3: // peak
            defMod += 0.2;
            break;
    }

    const atkEffective = atkStartTroops * (1 + atkMod);
    const defEffective = defStartTroops * (1 + defMod);

    return atkEffective / (atkEffective + defEffective);
}

module.exports = { battle, analyze };
