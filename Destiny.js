'use strict';

const Discord = require('discord.js');
const Logger = require('disnode-logger');

const bot = new Discord.Client();
const names = JSON.parse(process.env.NAMES);

bot.on('ready', () => {
	Logger.Success(bot.user.username, 'Launched', '');
	if (process.env.PRESENCE) {
		bot.user.setActivity(process.env.PRESENCE);
	}
});

bot.on('voiceStateUpdate', async (event) => {
	const channels = event.guild.channels;
	const fireOpen = channels.filter(c => c.type === 'voice' && c.name.startsWith('Fireteam') && c.members.size === 0);
	const fireUsed = channels.filter(c => c.type === 'voice' && c.name.startsWith('Fireteam') && c.members.size > 0);
	const raidOpen = channels.filter(c => c.type === 'voice' && c.name.startsWith('Raid') && c.members.size === 0);
	const raidUsed = channels.filter(c => c.type === 'voice' && c.name.startsWith('Raid') && c.members.size > 0);
	
	// Fireteam channels
	if (fireOpen.size === 0) {
		const fireNames = names.slice();
		fireUsed.forEach((item) => {
			const name = item.name.split('Fireteam ')[1];
			if (fireNames.indexOf(name) !== -1) {
				fireNames.splice(fireNames.indexOf(name), 1);
			}
		});
		try {
			const channel = await event.guild.createChannel(`Fireteam ${fireNames[Math.floor(Math.random() * (Math.floor(fireNames.length - 1) + 1))]}`, 'voice', [], 'No free Fireteam voice channels left');
			channel.setParent(process.env.FIRE);
			channel.setUserLimit(4);
		} catch(e) {
			console.error(e);
		}
	}
	if (fireOpen.size >= 2) {
		fireOpen.forEach((item, index, i) => {
			const keys = fireOpen.keyArray();
			if (keys.indexOf(index) < (keys.length - 1)) {
				item.delete('Removing extra Fireteam voice channel').catch(console.error);
			}	
		});
	}
	
	// Raid channels
	if (raidOpen.size === 0) {
		const raidNames = names.slice();
		raidUsed.forEach((item) => {
			const name = item.name.split('Raid ')[1];
			if (raidNames.indexOf(name) !== -1) {
				raidNames.splice(raidNames.indexOf(name), 1);
			}
		});
		try {
			const channel = await event.guild.createChannel(`Raid ${raidNames[Math.floor(Math.random() * (Math.floor(raidNames.length - 1) + 1))]}`, 'voice', [], 'No free Raid voice channels left');
			channel.setParent(process.env.RAID);
			channel.setUserLimit(6);
		} catch(e) {
			console.error(e);
		}
	}
	if (raidOpen.size >= 2) {
		raidOpen.forEach((item, index, i) => {
			const keys = raidOpen.keyArray();
			if (keys.indexOf(index) < (keys.length - 1)) {
				item.delete('Removing extra Raid voice channel').catch(console.error);
			}	
		});
	}
});

bot.login(process.env.TOKEN);
