import chalk from 'chalk';
import SlackAPI from 'node-slack';
import { Meteor } from 'meteor/meteor';

chalk.enabled = true;

class Gromit {
 constructor() {
   this.environment = process.env.NODE_ENV;
 }

 slackMessageColor(type) {
   return {
     danger: '#DA5847',
     success: '#00D490',
     warning: '#FFCF50',
     info: '#4285F4'
   }[type];
 }

 request(options) {
   const message = {
     text: `${options.title} - ${options.message}`,
     username: `[Gromit] ${this.environment}`,
     attachments: [
       {
         fallback: options.title,
         color: this.slackMessageColor(options.type),
         fields: [],
       },
     ],
   };

   if (options.payload && options.payload instanceof Array) {
     options.payload.forEach(item => message.attachments[0].fields.push(item));
   }

   this.slack.send(message);
 }

 initializeSlack(channelToHook) {
   const channel = channelToHook || 'beaconzoneadminlogs';
   this.slack = new SlackAPI(Meteor.settings.private.slack.hooks[channel]);
 }

 timestamp() {
   return (new Date()).toISOString();
 }

 error(options) {
   this.initializeSlack(options.channel);
   options.type = 'danger';
   options.date = this.timestamp();
   return this.request(options);
 }

 warning(options) {
   this.initializeSlack(options.channel);
   options.type = 'warning';
   options.date = this.timestamp();
   return this.request(options);
 }

 info(options) {
   this.initializeSlack(options.channel);
   options.type = 'info';
   options.date = this.timestamp();
   return this.request(options);
 }

 success(options) {
   this.initializeSlack(options.channel);
   options.type = 'success';
   options.date = this.timestamp();
   return this.request(options);
 }

 watch() {
   this.initializeSlack();
   process.on('uncaughtException', Meteor.bindEnvironment(error =>
     this.request({
       type: 'danger',
       title: '[500] Internal Server Error',
       message: error.message,
       date: this.timestamp(),
       payload: [
         { title: 'Stack Trace', value: error.stack },
       ],
     }),
   ));

   // This just lets us know that Gromit's watch process started up without issue.
   console.log(chalk.yellow(`[Gromit] Everything's under control! (${this.timestamp()})`));
 }
}

export default new Gromit();
