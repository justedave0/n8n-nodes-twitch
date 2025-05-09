import { IHookFunctions, IWebhookFunctions } from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeCredentialTestResult,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { twitchApiRequest } from './GenericFunctions';

export class TwitchTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twitch Trigger',
		name: 'twitchTrigger',
		icon: 'file:twitch.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Twitch events via webhooks',
		defaults: {
			name: 'Twitch Trigger',
			color: '#5A3E85',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'twitchApi',
				required: true,
				testedBy: 'testTwitchAuth',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'stream.online',
				options: [
					{
						name: 'Channel Ban',
						value: 'channel.ban',
					},
					{
						name: 'Channel Channel Points Custom Reward Add',
						value: 'channel.channel_points_custom_reward.add',
					},
					{
						name: 'Channel Channel Points Custom Reward Redemption Add',
						value: 'channel.channel_points_custom_reward_redemption.add',
					},
					{
						name: 'Channel Channel Points Custom Reward Redemption Update',
						value: 'channel.channel_points_custom_reward_redemption.update',
					},
					{
						name: 'Channel Channel Points Custom Reward Remove',
						value: 'channel.channel_points_custom_reward.remove',
					},
					{
						name: 'Channel Channel Points Custom Reward Update',
						value: 'channel.channel_points_custom_reward.update',
					},
					{
						name: 'Channel Charity Campaign Donate',
						value: 'channel.charity_campaign.donate',
					},
					{
						name: 'Channel Charity Campaign Progress',
						value: 'channel.charity_campaign.progress',
					},
					{
						name: 'Channel Charity Campaign Start',
						value: 'channel.charity_campaign.start',
					},
					{
						name: 'Channel Charity Campaign Stop',
						value: 'channel.charity_campaign.stop',
					},
					{
						name: 'Channel Cheer',
						value: 'channel.cheer',
					},
					{
						name: 'Channel Follow',
						value: 'channel.follow',
					},
					{
						name: 'Channel Goal Begin',
						value: 'channel.goal.begin',
					},
					{
						name: 'Channel Goal End',
						value: 'channel.goal.end',
					},
					{
						name: 'Channel Goal Progress',
						value: 'channel.goal.progress',
					},
					{
						name: 'Channel Hype Train Begin',
						value: 'channel.hype_train.begin',
					},
					{
						name: 'Channel Hype Train End',
						value: 'channel.hype_train.end',
					},
					{
						name: 'Channel Hype Train Progress',
						value: 'channel.hype_train.progress',
					},
					{
						name: 'Channel Moderator Add',
						value: 'channel.moderator.add',
					},
					{
						name: 'Channel Moderator Remove',
						value: 'channel.moderator.remove',
					},
					{
						name: 'Channel Poll Begin',
						value: 'channel.poll.begin',
					},
					{
						name: 'Channel Poll End',
						value: 'channel.poll.end',
					},
					{
						name: 'Channel Poll Progress',
						value: 'channel.poll.progress',
					},
					{
						name: 'Channel Prediction Begin',
						value: 'channel.prediction.begin',
					},
					{
						name: 'Channel Prediction End',
						value: 'channel.prediction.end',
					},
					{
						name: 'Channel Prediction Lock',
						value: 'channel.prediction.lock',
					},
					{
						name: 'Channel Prediction Progress',
						value: 'channel.prediction.progress',
					},
					{
						name: 'Channel Raid',
						value: 'channel.raid',
					},
					{
						name: 'Channel Shield Mode Begin',
						value: 'channel.shield_mode.begin',
					},
					{
						name: 'Channel Shield Mode End',
						value: 'channel.shield_mode.end',
					},
					{
						name: 'Channel Shoutout Create',
						value: 'channel.shoutout.create',
					},
					{
						name: 'Channel Shoutout Receive',
						value: 'channel.shoutout.receive',
					},
					{
						name: 'Channel Subscribe',
						value: 'channel.subscribe',
					},
					{
						name: 'Channel Subscription End',
						value: 'channel.subscription.end',
					},
					{
						name: 'Channel Subscription Gift',
						value: 'channel.subscription.gift',
					},
					{
						name: 'Channel Subscription Message',
						value: 'channel.subscription.message',
					},
					{
						name: 'Channel Unban',
						value: 'channel.unban',
					},
					{
						name: 'Channel Update',
						value: 'channel.update',
					},
					{
						name: 'Stream Offline',
						value: 'stream.offline',
					},
					{
						name: 'Stream Online',
						value: 'stream.online',
					},
					{
						name: 'User Authorization Grant',
						value: 'user.authorization.grant',
					},
					{
						name: 'User Authorization Revoke',
						value: 'user.authorization.revoke',
					},
					{
						name: 'User Update',
						value: 'user.update',
					},
				],
			},
			{
				displayName: 'Channel',
				name: 'channel_name',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: 'Additional Configuration',
				name: 'additionalConfiguration',
				type: 'collection',
				default: {},
				placeholder: 'Add Configuration',
				displayOptions: {
					show: {
						event: [
							'channel.channel_points_custom_reward.add',
							'channel.channel_points_custom_reward.remove',
							'channel.channel_points_custom_reward.update',
							'channel.channel_points_custom_reward_redemption.add',
							'channel.channel_points_custom_reward_redemption.update',
							'channel.raid',
						],
					},
				},
				options: [
					{
						displayName: 'Channel Points Custom Reward ID',
						name: 'rewardId',
						type: 'string',
						default: '',
						description: 'ID of the custom reward to get events for',
						displayOptions: {
							show: {
								'/event': [
									'channel.channel_points_custom_reward.remove',
									'channel.channel_points_custom_reward.update',
									'channel.channel_points_custom_reward_redemption.add',
									'channel.channel_points_custom_reward_redemption.update',
								],
							},
						},
					},
					{
						displayName: 'Raid Direction',
						name: 'raidDirection',
						type: 'options',
						default: 'to',
						options: [
							{
								name: 'From (When Channel Starts a Raid)',
								value: 'from',
							},
							{
								name: 'To (When Channel Receives a Raid)',
								value: 'to',
							},
						],
						description: 'The direction of the raid to trigger on',
						displayOptions: {
							show: {
								'/event': [
									'channel.raid',
								],
							},
						},
					},
				],
			},
		],
	};

	methods = {
		credentialTest: {
			async testTwitchAuth(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data;

				const optionsForAppToken = {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					qs: {
						client_id: credentials!.clientId,
						client_secret: credentials!.clientSecret,
						grant_type: 'client_credentials',
					},
					uri: 'https://id.twitch.tv/oauth2/token',
					json: true,
				};

				try {
					const response = await this.helpers.request(optionsForAppToken);
					if (!response.access_token) {
						return {
							status: 'Error',
							message: 'AccessToken not received',
						};
					}
				} catch (err: unknown) {
					if (err instanceof Error) {
						return {
							status: 'Error',
							message: `Error getting access token; ${err.message}`,
						};
					}
				}

				return {
					status: 'OK',
					message: 'Authentication successful!',
				};
			},
		},
	};

	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const { data: webhooks } = await twitchApiRequest.call(
					this,
					'GET',
					'/eventsub/subscriptions',
				);
				for (const webhook of webhooks) {
					if (
						webhook.transport.callback === webhookUrl &&
						webhook.type === event
					) {
						webhookData.webhookId = webhook.id;
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const event = this.getNodeParameter('event');
				const channel = this.getNodeParameter('channel_name') as string;
				const userData = await twitchApiRequest.call(
					this,
					'GET',
					'/users',
					{},
					{ login: channel },
				);
				const body = {
					type: event,
					version: '1',
					condition: {
						broadcaster_user_id: userData.data[0].id ?? '',
					},
					transport: {
						method: 'webhook',
						callback: webhookUrl,
						secret: 'n8ncreatedSecret',
					},
				};
				const webhook = await twitchApiRequest.call(
					this,
					'POST',
					'/eventsub/subscriptions',
					body,
				);
				webhookData.webhookId = webhook.data[0].id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				try {
					await twitchApiRequest.call(
						this,
						'DELETE',
						'/eventsub/subscriptions',
						{},
						{ id: webhookData.webhookId },
					);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const res = this.getResponseObject();
		const req = this.getRequestObject();

		// Check if we're getting twitch challenge request to validate the webhook that has been created.
		if (bodyData['challenge']) {
			res.status(200).send(bodyData['challenge']).end();
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(req.body)],
		};
	}
}
