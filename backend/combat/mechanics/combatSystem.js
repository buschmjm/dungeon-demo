/**
 * Combat System - Core combat mechanics and resolution
 * 
 * This module handles combat turns, attacks, damage calculation,
 * and combat resolution between the player and monsters.
 */

import { rollDice, randomInt } from '../../systems/utils/weightedRandom.js';

/**
 * Calculate attack roll for an entity
 * @param {Object} attacker - The attacking entity
 * @returns {Object} - Attack roll result
 */
export function calculateAttackRoll(attacker) {
    // Base attack roll is 1d20
    const roll = rollDice('1d20');
    
    // Add strength bonus
    const strengthMod = Math.floor((attacker.stats.strength - 10) / 2);
    
    // Add weapon bonus if equipped
    let weaponBonus = 0;
    if (attacker.equipment && attacker.equipment.weapon) {
        weaponBonus = attacker.equipment.weapon.attackBonus || 0;
    }
    
    // Add skill bonus
    const skillBonus = Math.floor((attacker.skills?.combat || 0) / 5);
    
    // Calculate total
    const total = roll + strengthMod + weaponBonus + skillBonus;
    
    return {
        roll,
        strengthMod,
        weaponBonus,
        skillBonus,
        total,
        critical: roll === 20
    };
}

/**
 * Calculate defense value for an entity
 * @param {Object} defender - The defending entity
 * @returns {Object} - Defense calculation
 */
export function calculateDefense(defender) {
    // Base defense value is 10
    let baseDefense = 10;
    
    // Add dexterity bonus
    const dexMod = Math.floor((defender.stats.dexterity - 10) / 2);
    
    // Add armor bonus if equipped
    let armorBonus = 0;
    if (defender.equipment && defender.equipment.armor) {
        armorBonus = defender.equipment.armor.protection || 0;
    }
    
    // Calculate total
    const total = baseDefense + dexMod + armorBonus;
    
    return {
        baseDefense,
        dexMod,
        armorBonus,
        total
    };
}

/**
 * Calculate damage for a successful attack
 * @param {Object} attacker - The attacking entity
 * @param {boolean} critical - Whether the attack was a critical hit
 * @returns {Object} - Damage calculation
 */
export function calculateDamage(attacker, critical = false) {
    // Determine damage dice based on weapon
    let damageDice = '1d4'; // Unarmed damage
    let weaponName = 'unarmed strike';
    
    if (attacker.equipment && attacker.equipment.weapon) {
        damageDice = attacker.equipment.weapon.damage || damageDice;
        weaponName = attacker.equipment.weapon.name;
    }
    
    // Roll damage
    let damageRoll = rollDice(damageDice);
    
    // Add strength modifier
    const strengthMod = Math.floor((attacker.stats.strength - 10) / 2);
    
    // Double dice damage on critical hit
    if (critical) {
        damageRoll *= 2;
    }
    
    // Calculate total
    const total = damageRoll + strengthMod;
    
    return {
        weapon: weaponName,
        damageDice,
        damageRoll,
        strengthMod,
        critical,
        total: Math.max(1, total) // Minimum 1 damage
    };
}

/**
 * Process a combat round between two entities
 * @param {Object} attacker - The attacking entity
 * @param {Object} defender - The defending entity
 * @returns {Object} - Combat round results
 */
export function processCombatRound(attacker, defender) {
    // Calculate attack roll
    const attackRoll = calculateAttackRoll(attacker);
    
    // Calculate defense
    const defense = calculateDefense(defender);
    
    // Check if attack hits
    const hit = attackRoll.total >= defense.total || attackRoll.critical;
    
    let damage = null;
    if (hit) {
        // Calculate damage
        damage = calculateDamage(attacker, attackRoll.critical);
        
        // Apply damage to defender
        defender.health -= damage.total;
        
        // Check if defender died
        if (defender.health <= 0) {
            defender.health = 0;
        }
    }
    
    // Return combat results
    return {
        hit,
        attackRoll,
        defense,
        damage,
        attackerName: attacker.name,
        defenderName: defender.name,
        defenderHealth: defender.health,
        defenderAlive: defender.health > 0,
        critical: attackRoll.critical
    };
}

/**
 * Generate a text description of a combat round
 * @param {Object} roundResult - Result from processCombatRound
 * @returns {Array<string>} - Text descriptions of what happened
 */
export function describeCombatRound(roundResult) {
    const messages = [];
    
    if (roundResult.hit) {
        if (roundResult.critical) {
            messages.push(`${roundResult.attackerName} lands a critical hit on ${roundResult.defenderName} with ${roundResult.damage.weapon}!`);
        } else {
            messages.push(`${roundResult.attackerName} hits ${roundResult.defenderName} with ${roundResult.damage.weapon}.`);
        }
        
        messages.push(`${roundResult.defenderName} takes ${roundResult.damage.total} damage.`);
        
        if (!roundResult.defenderAlive) {
            messages.push(`${roundResult.defenderName} has been defeated!`);
        } else {
            messages.push(`${roundResult.defenderName} has ${roundResult.defenderHealth} health remaining.`);
        }
    } else {
        messages.push(`${roundResult.attackerName} misses ${roundResult.defenderName}!`);
    }
    
    return messages;
}

/**
 * Generate a monster based on difficulty level
 * @param {number} difficulty - Difficulty level
 * @returns {Object} - Monster data
 */
export function generateMonster(difficulty = 1) {
    // Scale stats based on difficulty
    const baseHealth = 20 + (difficulty * 10);
    const baseStrength = 10 + Math.floor(difficulty / 2);
    const baseDexterity = 10 + Math.floor(difficulty / 3);
    
    // Monster types with name templates
    const monsterTypes = [
        { name: 'Goblin', healthMod: -5, strMod: -1, dexMod: 2 },
        { name: 'Orc', healthMod: 5, strMod: 2, dexMod: 0 },
        { name: 'Skeleton', healthMod: -10, strMod: 0, dexMod: 1 },
        { name: 'Zombie', healthMod: 10, strMod: 1, dexMod: -2 },
        { name: 'Troll', healthMod: 15, strMod: 3, dexMod: -1 },
        { name: 'Giant Rat', healthMod: -15, strMod: -2, dexMod: 3 }
    ];
    
    // Select a random monster type
    const monsterType = monsterTypes[randomInt(0, monsterTypes.length - 1)];
    
    // Monster adjectives for more variety
    const adjectives = [
        'Fierce', 'Savage', 'Wild', 'Rabid', 'Crazed',
        'Battle-scarred', 'Wounded', 'Enraged', 'Ancient', 'Young'
    ];
    
    // Create the monster
    const monster = {
        id: `monster_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: `${adjectives[randomInt(0, adjectives.length - 1)]} ${monsterType.name}`,
        health: baseHealth + monsterType.healthMod,
        maxHealth: baseHealth + monsterType.healthMod,
        stats: {
            strength: baseStrength + monsterType.strMod,
            dexterity: baseDexterity + monsterType.dexMod,
            intelligence: 8,
            constitution: 8
        },
        equipment: {
            weapon: {
                name: 'Claws',
                damage: `1d${4 + Math.floor(difficulty / 2)}`,
                attackBonus: Math.floor(difficulty / 2)
            }
        },
        level: difficulty,
        experience: 10 * difficulty,
        monsterType: monsterType.name
    };
    
    return monster;
}

/**
 * Award experience to player after combat
 * @param {Object} player - Player object
 * @param {Object} monster - Defeated monster
 * @returns {Object} - Experience results
 */
export function awardExperience(player, monster) {
    // Base XP from monster
    const baseXP = monster.experience || 10;
    
    // Scale by monster level vs player level
    const levelDiff = (monster.level || 1) - player.level;
    let xpMultiplier = 1.0;
    
    if (levelDiff > 0) {
        // Bonus XP for defeating higher-level monsters
        xpMultiplier = 1.0 + (levelDiff * 0.2);
    } else if (levelDiff < -2) {
        // Reduced XP for defeating much lower-level monsters
        xpMultiplier = 0.5;
    }
    
    const xpAwarded = Math.floor(baseXP * xpMultiplier);
    
    // Add XP to player
    const leveledUp = player.addExperience(xpAwarded);
    
    return {
        xpAwarded,
        leveledUp
    };
}
