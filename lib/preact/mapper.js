
/**
 * Module dependencies.
 */

var time = require('unix-time');
var extend = require('extend');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  return {
    person: person(track.identify()),
    event: event(track),
    source: "segmentio-server"
  };
};

/**
 * Map `identify`.
 *
 * @param {Identify} identify
 * @return {Object}
 * @api private
 */

exports.identify = function(identify){
  return {
    person: person(identify),
    event: {
      name: "___identify"
    },
    source: "segmentio-server"
  };
};


/**
 * Format `identify` to `person`.
 *
 * @param {Identify} identify
 * @return {Object}
 * @api private
 */

function person(identify){
  return clean({
    created_at: identify.created(),
    uid: identify.userId() || identify.sessionId(),
    email: identify.email(),
    properties: identify.traits(),
    twitter_id: identify.proxy('traits.twitterId'),
    facebook_id: identify.proxy('traits.facebookId'),
    stripe_id: identify.proxy('traits.stripeId'),
  });
};

/**
 * Format `track` to `event`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

function event(track){
  return clean({
    name: track.event(),
    timestamp: time(track.timestamp()),
    extras: clean(extend(track.properties(), {
      _ip: track.ip()
    })),
    note: track.proxy('properties.note'),
    account: track.proxy('properties.account'),
    target_id: track.proxy('properties.targetId'),
    link_url: track.proxy('properties.linkUrl'),
    thumb_url: track.proxy('properties.thumbUrl'),
    revenue: 100 * track.revenue(),
    userAgent: track.userAgent(),
    _referer: track.referrer(),
    _url: track.proxy('properties.url'),
    _page_title: track.proxy('properties.pageTitle')
  });
}

/**
 * Remove all nulls of `obj`.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function clean(obj){
  return Object.keys(obj).reduce(function(ret, key){
    if (null == obj[key]) return ret;
    ret[key] = obj[key];
    return ret;
  }, {});
}
