const awsIam = require('../../protocol/sasl/awsIam')
const { KafkaJSSASLAuthenticationError } = require('../../errors')
const {
  AuthenticationPayloadCreator,
} = require('./../../protocol/sasl/awsIam/authenticationPayloadCreator')

module.exports = class AWSIAMAuthenticator {
  constructor(connection, logger, saslAuthenticate) {
    this.connection = connection
    this.logger = logger.namespace('SASLAWSIAMAuthenticator')
    this.saslAuthenticate = saslAuthenticate
  }

  async authenticate() {
    const { host, port } = this.connection
    const broker = `${host}:${port}`
    const payloadFactory = new AuthenticationPayloadCreator({
      region: this.connection.sasl.region || process.env.AWS_REGION,
    })

    if (!this.connection.sasl.region && !process.env.AWS_REGION) {
      throw new KafkaJSSASLAuthenticationError('SASL AWS-IAM: Missing AWS region')
    }

    try {
      const payload = await payloadFactory.create({ brokerHost: host })
      const authenticateResponse = await this.saslAuthenticate({
        request: awsIam.request(payload),
        response: awsIam.response,
        authExpectResponse: true,
      })
      this.logger.info('Authentication response', { authenticateResponse })

      if (!authenticateResponse.version || !authenticateResponse) {
        throw new Error('Invalid response from broker')
      }

      this.logger.info('SASL Simon authentication successful', { broker })
    } catch (error) {
      this.logger.error(error.message, { broker })
      throw error
    }
  }
}
