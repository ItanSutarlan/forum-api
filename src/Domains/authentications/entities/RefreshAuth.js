class RefreshAuth {
  constructor({ refreshToken }) {
    this._verifyPayload(refreshToken);
    this.refreshToken = refreshToken;
  }

  _verifyPayload(refreshToken) {
    if (!refreshToken) throw new Error('REFRESH_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof refreshToken !== 'string') throw new Error('REFRESH_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = RefreshAuth;
