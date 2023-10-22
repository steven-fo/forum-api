/* eslint-disable class-methods-use-this */
class NewReply {
  constructor(payload, credentialId, threadId, commentId) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
    this.credentialId = credentialId;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
