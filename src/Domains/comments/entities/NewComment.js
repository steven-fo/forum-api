/* eslint-disable class-methods-use-this */
class NewComment {
  constructor(payload, credentialId, threadId) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
    this.credentialId = credentialId;
    this.threadId = threadId;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
