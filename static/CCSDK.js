"undefined" == typeof Paho && (Paho = {}), Paho.MQTT = function (a) {
    function u(e, t, n) {
        return t[n++] = e >> 8, t[n++] = e % 256, n
    }

    function l(e, t, n, r) {
        return s(e, n, r = u(t, n, r)), r + t
    }

    function p(e) {
        for (var t = 0, n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            2047 < r ? (55296 <= r && r <= 56319 && (n++, t++), t += 3) : 127 < r ? t += 2 : t++
        }
        return t
    }

    function s(e, t, n) {
        for (var r = 0; r < e.length; r++) {
            var i = e.charCodeAt(r);
            if (55296 <= i && i <= 56319) {
                var o = e.charCodeAt(++r);
                if (isNaN(o)) throw Error(b(S.MALFORMED_UNICODE, [i, o]));
                i = o - 56320 + (i - 55296 << 10) + 65536
            }
            i <= 127 ? t[n++] = i : (i <= 2047 ? t[n++] = i >> 6 & 31 | 192 : (i <= 65535 ? t[n++] = i >> 12 & 15 | 224 : (t[n++] = i >> 18 & 7 | 240, t[n++] = i >> 12 & 63 | 128), t[n++] = i >> 6 & 63 | 128), t[n++] = 63 & i | 128)
        }
        return t
    }

    function y(e, t, n) {
        for (var r, i = "", o = t; o < t + n;) {
            if (!((r = e[o++]) < 128)) {
                var a = e[o++] - 128;
                if (a < 0) throw Error(b(S.MALFORMED_UTF, [r.toString(16), a.toString(16), ""]));
                if (r < 224) r = 64 * (r - 192) + a; else {
                    var s = e[o++] - 128;
                    if (s < 0) throw Error(b(S.MALFORMED_UTF, [r.toString(16), a.toString(16), s.toString(16)]));
                    if (r < 240) r = 4096 * (r - 224) + 64 * a + s; else {
                        var c = e[o++] - 128;
                        if (c < 0) throw Error(b(S.MALFORMED_UTF, [r.toString(16), a.toString(16), s.toString(16), c.toString(16)]));
                        if (!(r < 248)) throw Error(b(S.MALFORMED_UTF, [r.toString(16), a.toString(16), s.toString(16), c.toString(16)]));
                        r = 262144 * (r - 240) + 4096 * a + 64 * s + c
                    }
                }
            }
            65535 < r && (r -= 65536, i += String.fromCharCode(55296 + (r >> 10)), r = 56320 + (1023 & r)), i += String.fromCharCode(r)
        }
        return i
    }

    var d = function (e, t) {
        for (var n in e) if (e.hasOwnProperty(n)) {
            if (!t.hasOwnProperty(n)) {
                var r = "Unknown property, " + n + ". Valid properties are:";
                for (n in t) t.hasOwnProperty(n) && (r = r + " " + n);
                throw Error(r)
            }
            if (typeof e[n] !== t[n]) throw Error(b(S.INVALID_TYPE, [typeof e[n], n]))
        }
    }, t = function (e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }, S = {
        OK: {code: 0, text: "AMQJSC0000I OK."},
        CONNECT_TIMEOUT: {code: 1, text: "AMQJSC0001E Connect timed out."},
        SUBSCRIBE_TIMEOUT: {code: 2, text: "AMQJS0002E Subscribe timed out."},
        UNSUBSCRIBE_TIMEOUT: {code: 3, text: "AMQJS0003E Unsubscribe timed out."},
        PING_TIMEOUT: {code: 4, text: "AMQJS0004E Ping timed out."},
        INTERNAL_ERROR: {code: 5, text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"},
        CONNACK_RETURNCODE: {code: 6, text: "AMQJS0006E Bad Connack return code:{0} {1}."},
        SOCKET_ERROR: {code: 7, text: "AMQJS0007E Socket error:{0}."},
        SOCKET_CLOSE: {code: 8, text: "AMQJS0008I Socket closed."},
        MALFORMED_UTF: {code: 9, text: "AMQJS0009E Malformed UTF data:{0} {1} {2}."},
        UNSUPPORTED: {code: 10, text: "AMQJS0010E {0} is not supported by this browser."},
        INVALID_STATE: {code: 11, text: "AMQJS0011E Invalid state {0}."},
        INVALID_TYPE: {code: 12, text: "AMQJS0012E Invalid type {0} for {1}."},
        INVALID_ARGUMENT: {code: 13, text: "AMQJS0013E Invalid argument {0} for {1}."},
        UNSUPPORTED_OPERATION: {code: 14, text: "AMQJS0014E Unsupported operation."},
        INVALID_STORED_DATA: {code: 15, text: "AMQJS0015E Invalid data in local storage key={0} value={1}."},
        INVALID_MQTT_MESSAGE_TYPE: {code: 16, text: "AMQJS0016E Invalid MQTT message type {0}."},
        MALFORMED_UNICODE: {code: 17, text: "AMQJS0017E Malformed Unicode string:{0} {1}."}
    }, c = {
        0: "Connection Accepted",
        1: "Connection Refused: unacceptable protocol version",
        2: "Connection Refused: identifier rejected",
        3: "Connection Refused: server unavailable",
        4: "Connection Refused: bad user name or password",
        5: "Connection Refused: not authorized"
    }, b = function (e, t) {
        var n = e.text;
        if (t) for (var r, i, o = 0; o < t.length; o++) if (r = "{" + o + "}", 0 < (i = n.indexOf(r))) {
            var a = n.substring(0, i);
            n = n.substring(i + r.length), n = a + t[o] + n
        }
        return n
    }, f = [0, 6, 77, 81, 73, 115, 100, 112, 3], m = [0, 4, 77, 81, 84, 84, 4], _ = function (e, t) {
        for (var n in this.type = e, t) t.hasOwnProperty(n) && (this[n] = t[n])
    }, n = function (e, t, n) {
        this._client = e, this._window = t, this._keepAliveInterval = 1e3 * n, this.isReset = !1;
        var r = new _(12).encode(), i = function (e) {
            return function () {
                return o.apply(e)
            }
        }, o = function () {
            this.isReset ? (this.isReset = !1, this._client._trace("Pinger.doPing", "send PINGREQ"), this._client.socket.send(r), this.timeout = this._window.setTimeout(i(this), this._keepAliveInterval)) : (this._client._trace("Pinger.doPing", "Timed out"), this._client._disconnected(S.PING_TIMEOUT.code, b(S.PING_TIMEOUT)))
        };
        this.reset = function () {
            this.isReset = !0, this._window.clearTimeout(this.timeout), 0 < this._keepAliveInterval && (this.timeout = setTimeout(i(this), this._keepAliveInterval))
        }, this.cancel = function () {
            this._window.clearTimeout(this.timeout)
        }
    }, r = function (e, t, n, r, i) {
        var o, a, s;
        this._window = t, n || (n = 30), this.timeout = setTimeout((o = r, a = e, s = i, function () {
            return o.apply(a, s)
        }), 1e3 * n), this.cancel = function () {
            this._window.clearTimeout(this.timeout)
        }
    }, h = function (e, t, n, r, i) {
        if (!("WebSocket" in a && null !== a.WebSocket)) throw Error(b(S.UNSUPPORTED, ["WebSocket"]));
        if (!("localStorage" in a && null !== a.localStorage)) throw Error(b(S.UNSUPPORTED, ["localStorage"]));
        if (!("ArrayBuffer" in a && null !== a.ArrayBuffer)) throw Error(b(S.UNSUPPORTED, ["ArrayBuffer"]));
        for (var o in this._trace("Paho.MQTT.Client", e, t, n, r, i), this.host = t, this.port = n, this.path = r, this.uri = e, this.clientId = i, this._localKey = t + ":" + n + ("/mqtt" != r ? ":" + r : "") + ":" + i + ":", this._msg_queue = [], this._sentMessages = {}, this._receivedMessages = {}, this._notify_msg_sent = {}, this._message_identifier = 1, this._sequence = 0, localStorage) 0 != o.indexOf("Sent:" + this._localKey) && 0 != o.indexOf("Received:" + this._localKey) || this.restore(o)
    };
    h.prototype.connected = !(_.prototype.encode = function () {
        var e = (15 & this.type) << 4, t = 0, n = [], r = 0;
        switch (null != this.messageIdentifier && (t += 2), this.type) {
            case 1:
                switch (this.mqttVersion) {
                    case 3:
                        t += f.length + 3;
                        break;
                    case 4:
                        t += m.length + 3
                }
                if (t += p(this.clientId) + 2, null != this.willMessage) {
                    t = t + (p(this.willMessage.destinationName) + 2);
                    var i = this.willMessage.payloadBytes;
                    i instanceof Uint8Array || (i = new Uint8Array(a)), t += i.byteLength + 2
                }
                null != this.userName && (t += p(this.userName) + 2), null != this.password && (t += p(this.password) + 2);
                break;
            case 8:
                e = 2 | e;
                for (var o = 0; o < this.topics.length; o++) n[o] = p(this.topics[o]), t += n[o] + 2;
                t += this.requestedQos.length;
                break;
            case 10:
                for (e |= 2, o = 0; o < this.topics.length; o++) n[o] = p(this.topics[o]), t += n[o] + 2;
                break;
            case 6:
                e |= 2;
                break;
            case 3:
                this.payloadMessage.duplicate && (e |= 8), e = e |= this.payloadMessage.qos << 1, this.payloadMessage.retained && (e |= 1);
                r = p(this.payloadMessage.destinationName);
                var a = this.payloadMessage.payloadBytes;
                t = t + (r + 2) + a.byteLength;
                a instanceof ArrayBuffer ? a = new Uint8Array(a) : a instanceof Uint8Array || (a = new Uint8Array(a.buffer))
        }
        var s = t, c = (o = Array(1), 0);
        do {
            var d = s % 128;
            0 < (s = s >> 7) && (d |= 128), o[c++] = d
        } while (0 < s && c < 4);
        if (s = o.length + 1, t = new ArrayBuffer(t + s), (c = new Uint8Array(t))[0] = e, c.set(o, 1), 3 == this.type) s = l(this.payloadMessage.destinationName, r, c, s); else if (1 == this.type) {
            switch (this.mqttVersion) {
                case 3:
                    c.set(f, s), s += f.length;
                    break;
                case 4:
                    c.set(m, s), s += m.length
            }
            e = 0, this.cleanSession && (e = 2), null != this.willMessage && (e = 4 | e | this.willMessage.qos << 3, this.willMessage.retained && (e |= 32)), null != this.userName && (e |= 128), null != this.password && (e |= 64), c[s++] = e, s = u(this.keepAliveInterval, c, s)
        }
        switch (null != this.messageIdentifier && (s = u(this.messageIdentifier, c, s)), this.type) {
            case 1:
                s = l(this.clientId, p(this.clientId), c, s), null != this.willMessage && (s = l(this.willMessage.destinationName, p(this.willMessage.destinationName), c, s), s = u(i.byteLength, c, s), c.set(i, s), s += i.byteLength), null != this.userName && (s = l(this.userName, p(this.userName), c, s)), null != this.password && l(this.password, p(this.password), c, s);
                break;
            case 3:
                c.set(a, s);
                break;
            case 8:
                for (o = 0; o < this.topics.length; o++) s = l(this.topics[o], n[o], c, s), c[s++] = this.requestedQos[o];
                break;
            case 10:
                for (o = 0; o < this.topics.length; o++) s = l(this.topics[o], n[o], c, s)
        }
        return t
    }), h.prototype.maxMessageIdentifier = 65536, h.prototype._msg_queue = null, h.prototype.sendPinger = null, h.prototype.receivePinger = null, h.prototype.receiveBuffer = null, h.prototype._traceBuffer = null, h.prototype._MAX_TRACE_ENTRIES = 100, h.prototype.connect = function (e) {
        var t = this._traceMask(e, "password");
        if (this._trace("Client.connect", t, this.socket, this.connected), this.connected) throw Error(b(S.INVALID_STATE, ["already connected"]));
        if (this.socket) throw Error(b(S.INVALID_STATE, ["already connected"]));
        (this.connectOptions = e).uris ? (this.hostIndex = 0, this._doConnect(e.uris[0])) : this._doConnect(this.uri)
    }, h.prototype.subscribe = function (e, t) {
        if (this._trace("Client.subscribe", e, t), !this.connected) throw Error(b(S.INVALID_STATE, ["not connected"]));
        var n = new _(8);
        n.topics = [e], n.requestedQos = null != t.qos ? [t.qos] : [0], t.onSuccess && (n.onSuccess = function (e) {
            t.onSuccess({invocationContext: t.invocationContext, grantedQos: e})
        }), t.onFailure && (n.onFailure = function (e) {
            t.onFailure({invocationContext: t.invocationContext, errorCode: e})
        }), t.timeout && (n.timeOut = new r(this, window, t.timeout, t.onFailure, [{
            invocationContext: t.invocationContext,
            errorCode: S.SUBSCRIBE_TIMEOUT.code,
            errorMessage: b(S.SUBSCRIBE_TIMEOUT)
        }])), this._requires_ack(n), this._schedule_message(n)
    }, h.prototype.unsubscribe = function (e, t) {
        if (this._trace("Client.unsubscribe", e, t), !this.connected) throw Error(b(S.INVALID_STATE, ["not connected"]));
        var n = new _(10);
        n.topics = [e], t.onSuccess && (n.callback = function () {
            t.onSuccess({invocationContext: t.invocationContext})
        }), t.timeout && (n.timeOut = new r(this, window, t.timeout, t.onFailure, [{
            invocationContext: t.invocationContext,
            errorCode: S.UNSUBSCRIBE_TIMEOUT.code,
            errorMessage: b(S.UNSUBSCRIBE_TIMEOUT)
        }])), this._requires_ack(n), this._schedule_message(n)
    }, h.prototype.send = function (e) {
        if (this._trace("Client.send", e), !this.connected) throw Error(b(S.INVALID_STATE, ["not connected"]));
        wireMessage = new _(3), 0 < (wireMessage.payloadMessage = e).qos ? this._requires_ack(wireMessage) : this.onMessageDelivered && (this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage)), this._schedule_message(wireMessage)
    }, h.prototype.disconnect = function () {
        if (this._trace("Client.disconnect"), !this.socket) throw Error(b(S.INVALID_STATE, ["not connecting or connected"]));
        wireMessage = new _(14), this._notify_msg_sent[wireMessage] = t(this._disconnected, this), this._schedule_message(wireMessage)
    }, h.prototype.getTraceLog = function () {
        if (null !== this._traceBuffer) {
            for (var e in this._trace("Client.getTraceLog", new Date), this._trace("Client.getTraceLog in flight messages", this._sentMessages.length), this._sentMessages) this._trace("_sentMessages ", e, this._sentMessages[e]);
            for (e in this._receivedMessages) this._trace("_receivedMessages ", e, this._receivedMessages[e]);
            return this._traceBuffer
        }
    }, h.prototype.startTrace = function () {
        null === this._traceBuffer && (this._traceBuffer = []), this._trace("Client.startTrace", new Date, "@VERSION@")
    }, h.prototype.stopTrace = function () {
        delete this._traceBuffer
    }, h.prototype._doConnect = function (e) {
        this.connectOptions.useSSL && ((e = e.split(":"))[0] = "wss", e = e.join(":")), this.connected = !1, this.socket = this.connectOptions.mqttVersion < 4 ? new WebSocket(e, ["mqttv3.1"]) : new WebSocket(e, ["mqtt"]), this.socket.binaryType = "arraybuffer", this.socket.onopen = t(this._on_socket_open, this), this.socket.onmessage = t(this._on_socket_message, this), this.socket.onerror = t(this._on_socket_error, this), this.socket.onclose = t(this._on_socket_close, this), this.sendPinger = new n(this, window, this.connectOptions.keepAliveInterval), this.receivePinger = new n(this, window, this.connectOptions.keepAliveInterval), this._connectTimeout = new r(this, window, this.connectOptions.timeout, this._disconnected, [S.CONNECT_TIMEOUT.code, b(S.CONNECT_TIMEOUT)])
    }, h.prototype._schedule_message = function (e) {
        this._msg_queue.push(e), this.connected && this._process_queue()
    }, h.prototype.store = function (e, t) {
        var n = {type: t.type, messageIdentifier: t.messageIdentifier, version: 1};
        switch (t.type) {
            case 3:
                t.pubRecReceived && (n.pubRecReceived = !0), n.payloadMessage = {};
                for (var r = "", i = t.payloadMessage.payloadBytes, o = 0; o < i.length; o++) r = i[o] <= 15 ? r + "0" + i[o].toString(16) : r + i[o].toString(16);
                n.payloadMessage.payloadHex = r, n.payloadMessage.qos = t.payloadMessage.qos, n.payloadMessage.destinationName = t.payloadMessage.destinationName, t.payloadMessage.duplicate && (n.payloadMessage.duplicate = !0), t.payloadMessage.retained && (n.payloadMessage.retained = !0), 0 == e.indexOf("Sent:") && (void 0 === t.sequence && (t.sequence = ++this._sequence), n.sequence = t.sequence);
                break;
            default:
                throw Error(b(S.INVALID_STORED_DATA, [key, n]))
        }
        localStorage.setItem(e + this._localKey + t.messageIdentifier, JSON.stringify(n))
    }, h.prototype.restore = function (e) {
        var t = localStorage.getItem(e), n = JSON.parse(t), r = new _(n.type, n);
        switch (n.type) {
            case 3:
                t = n.payloadMessage.payloadHex;
                for (var i = new ArrayBuffer(t.length / 2), o = (i = new Uint8Array(i), 0); 2 <= t.length;) {
                    var a = parseInt(t.substring(0, 2), 16);
                    t = t.substring(2, t.length);
                    i[o++] = a
                }
                (t = new Paho.MQTT.Message(i)).qos = n.payloadMessage.qos, t.destinationName = n.payloadMessage.destinationName, n.payloadMessage.duplicate && (t.duplicate = !0), n.payloadMessage.retained && (t.retained = !0), r.payloadMessage = t;
                break;
            default:
                throw Error(b(S.INVALID_STORED_DATA, [e, t]))
        }
        0 == e.indexOf("Sent:" + this._localKey) ? (r.payloadMessage.duplicate = !0, this._sentMessages[r.messageIdentifier] = r) : 0 == e.indexOf("Received:" + this._localKey) && (this._receivedMessages[r.messageIdentifier] = r)
    }, h.prototype._process_queue = function () {
        for (var e = null, t = this._msg_queue.reverse(); e = t.pop();) this._socket_send(e), this._notify_msg_sent[e] && (this._notify_msg_sent[e](), delete this._notify_msg_sent[e])
    }, h.prototype._requires_ack = function (e) {
        var t = Object.keys(this._sentMessages).length;
        if (t > this.maxMessageIdentifier) throw Error("Too many messages:" + t);
        for (; void 0 !== this._sentMessages[this._message_identifier];) this._message_identifier++;
        e.messageIdentifier = this._message_identifier, 3 === (this._sentMessages[e.messageIdentifier] = e).type && this.store("Sent:", e), this._message_identifier === this.maxMessageIdentifier && (this._message_identifier = 1)
    }, h.prototype._on_socket_open = function () {
        var e = new _(1, this.connectOptions);
        e.clientId = this.clientId, this._socket_send(e)
    }, h.prototype._on_socket_message = function (e) {
        this._trace("Client._on_socket_message", e.data), this.receivePinger.reset(), e = this._deframeMessages(e.data);
        for (var t = 0; t < e.length; t += 1) this._handleMessage(e[t])
    }, h.prototype._deframeMessages = function (e) {
        (e = new Uint8Array(e), this.receiveBuffer) && ((t = new Uint8Array(this.receiveBuffer.length + e.length)).set(this.receiveBuffer), t.set(e, this.receiveBuffer.length), e = t, delete this.receiveBuffer);
        try {
            for (var t = 0, n = []; t < e.length;) {
                var r;
                e:{
                    var i = e, o = d = t, a = i[d], s = a >> 4, c = 15 & a, d = d + 1, u = void 0, l = 0, p = 1;
                    do {
                        if (d == i.length) {
                            r = [null, o];
                            break e
                        }
                        l += (127 & (u = i[d++])) * p, p *= 128
                    } while (0 != (128 & u));
                    if ((u = d + l) > i.length) r = [null, o]; else {
                        var f = new _(s);
                        switch (s) {
                            case 2:
                                1 & i[d++] && (f.sessionPresent = !0), f.returnCode = i[d++];
                                break;
                            case 3:
                                o = c >> 1 & 3;
                                var m = 256 * i[d] + i[d + 1], h = y(i, d = d + 2, m);
                                d = d + m;
                                0 < o && (f.messageIdentifier = 256 * i[d] + i[d + 1], d += 2);
                                var v = new Paho.MQTT.Message(i.subarray(d, u));
                                1 == (1 & c) && (v.retained = !0), 8 == (8 & c) && (v.duplicate = !0), v.qos = o, v.destinationName = h, f.payloadMessage = v;
                                break;
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 11:
                                f.messageIdentifier = 256 * i[d] + i[d + 1];
                                break;
                            case 9:
                                f.messageIdentifier = 256 * i[d] + i[d + 1], d += 2, f.returnCode = i.subarray(d, u)
                        }
                        r = [f, u]
                    }
                }
                var g = r[0];
                t = r[1];
                if (null === g) break;
                n.push(g)
            }
            t < e.length && (this.receiveBuffer = e.subarray(t))
        } catch (e) {
            return void this._disconnected(S.INTERNAL_ERROR.code, b(S.INTERNAL_ERROR, [e.message, e.stack.toString()]))
        }
        return n
    }, h.prototype._handleMessage = function (e) {
        this._trace("Client._handleMessage", e);
        try {
            switch (e.type) {
                case 2:
                    if (this._connectTimeout.cancel(), this.connectOptions.cleanSession) {
                        for (var t in this._sentMessages) {
                            var n = this._sentMessages[t];
                            localStorage.removeItem("Sent:" + this._localKey + n.messageIdentifier)
                        }
                        for (t in this._sentMessages = {}, this._receivedMessages) {
                            var r = this._receivedMessages[t];
                            localStorage.removeItem("Received:" + this._localKey + r.messageIdentifier)
                        }
                        this._receivedMessages = {}
                    }
                    if (0 !== e.returnCode) {
                        this._disconnected(S.CONNACK_RETURNCODE.code, b(S.CONNACK_RETURNCODE, [e.returnCode, c[e.returnCode]]));
                        break
                    }
                    for (var i in this.connected = !0, this.connectOptions.uris && (this.hostIndex = this.connectOptions.uris.length), e = [], this._sentMessages) this._sentMessages.hasOwnProperty(i) && e.push(this._sentMessages[i]);
                    e = e.sort(function (e, t) {
                        return e.sequence - t.sequence
                    }), i = 0;
                    for (var o = e.length; i < o; i++) if (3 == (n = e[i]).type && n.pubRecReceived) {
                        var a = new _(6, {messageIdentifier: n.messageIdentifier});
                        this._schedule_message(a)
                    } else this._schedule_message(n);
                    this.connectOptions.onSuccess && this.connectOptions.onSuccess({invocationContext: this.connectOptions.invocationContext}), this._process_queue();
                    break;
                case 3:
                    this._receivePublish(e);
                    break;
                case 4:
                    (n = this._sentMessages[e.messageIdentifier]) && (delete this._sentMessages[e.messageIdentifier], localStorage.removeItem("Sent:" + this._localKey + e.messageIdentifier), this.onMessageDelivered && this.onMessageDelivered(n.payloadMessage));
                    break;
                case 5:
                    (n = this._sentMessages[e.messageIdentifier]) && (n.pubRecReceived = !0, a = new _(6, {messageIdentifier: e.messageIdentifier}), this.store("Sent:", n), this._schedule_message(a));
                    break;
                case 6:
                    r = this._receivedMessages[e.messageIdentifier], localStorage.removeItem("Received:" + this._localKey + e.messageIdentifier), r && (this._receiveMessage(r), delete this._receivedMessages[e.messageIdentifier]);
                    var s = new _(7, {messageIdentifier: e.messageIdentifier});
                    this._schedule_message(s);
                    break;
                case 7:
                    n = this._sentMessages[e.messageIdentifier], delete this._sentMessages[e.messageIdentifier], localStorage.removeItem("Sent:" + this._localKey + e.messageIdentifier), this.onMessageDelivered && this.onMessageDelivered(n.payloadMessage);
                    break;
                case 9:
                    (n = this._sentMessages[e.messageIdentifier]) && (n.timeOut && n.timeOut.cancel(), e.returnCode.indexOf = Array.prototype.indexOf, -1 !== e.returnCode.indexOf(128) ? n.onFailure && n.onFailure(e.returnCode) : n.onSuccess && n.onSuccess(e.returnCode), delete this._sentMessages[e.messageIdentifier]);
                    break;
                case 11:
                    (n = this._sentMessages[e.messageIdentifier]) && (n.timeOut && n.timeOut.cancel(), n.callback && n.callback(), delete this._sentMessages[e.messageIdentifier]);
                    break;
                case 13:
                    this.sendPinger.reset();
                    break;
                case 14:
                    this._disconnected(S.INVALID_MQTT_MESSAGE_TYPE.code, b(S.INVALID_MQTT_MESSAGE_TYPE, [e.type]));
                    break;
                default:
                    this._disconnected(S.INVALID_MQTT_MESSAGE_TYPE.code, b(S.INVALID_MQTT_MESSAGE_TYPE, [e.type]))
            }
        } catch (e) {
            this._disconnected(S.INTERNAL_ERROR.code, b(S.INTERNAL_ERROR, [e.message, e.stack.toString()]))
        }
    }, h.prototype._on_socket_error = function (e) {
        this._disconnected(S.SOCKET_ERROR.code, b(S.SOCKET_ERROR, [e.data]))
    }, h.prototype._on_socket_close = function () {
        this._disconnected(S.SOCKET_CLOSE.code, b(S.SOCKET_CLOSE))
    }, h.prototype._socket_send = function (e) {
        if (1 == e.type) {
            var t = this._traceMask(e, "password");
            this._trace("Client._socket_send", t)
        } else this._trace("Client._socket_send", e);
        this.socket.send(e.encode()), this.sendPinger.reset()
    }, h.prototype._receivePublish = function (e) {
        switch (e.payloadMessage.qos) {
            case"undefined":
            case 0:
                this._receiveMessage(e);
                break;
            case 1:
                var t = new _(4, {messageIdentifier: e.messageIdentifier});
                this._schedule_message(t), this._receiveMessage(e);
                break;
            case 2:
                this._receivedMessages[e.messageIdentifier] = e, this.store("Received:", e), e = new _(5, {messageIdentifier: e.messageIdentifier}), this._schedule_message(e);
                break;
            default:
                throw Error("Invaild qos=" + wireMmessage.payloadMessage.qos)
        }
    }, h.prototype._receiveMessage = function (e) {
        this.onMessageArrived && this.onMessageArrived(e.payloadMessage)
    }, h.prototype._disconnected = function (e, t) {
        this._trace("Client._disconnected", e, t), this.sendPinger.cancel(), this.receivePinger.cancel(), this._connectTimeout && this._connectTimeout.cancel(), this._msg_queue = [], this._notify_msg_sent = {}, this.socket && (this.socket.onopen = null, this.socket.onmessage = null, this.socket.onerror = null, this.socket.onclose = null, 1 === this.socket.readyState && this.socket.close(), delete this.socket), this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1 ? (this.hostIndex++, this._doConnect(this.connectOptions.uris[this.hostIndex])) : (void 0 === e && (e = S.OK.code, t = b(S.OK)), this.connected ? (this.connected = !1, this.onConnectionLost && this.onConnectionLost({
            errorCode: e,
            errorMessage: t
        })) : 4 === this.connectOptions.mqttVersion && !1 === this.connectOptions.mqttVersionExplicit ? (this._trace("Failed to connect V4, dropping back to V3"), this.connectOptions.mqttVersion = 3, this.connectOptions.uris ? (this.hostIndex = 0, this._doConnect(this.connectOptions.uris[0])) : this._doConnect(this.uri)) : this.connectOptions.onFailure && this.connectOptions.onFailure({
            invocationContext: this.connectOptions.invocationContext,
            errorCode: e,
            errorMessage: t
        }))
    }, h.prototype._trace = function () {
        if (this.traceFunction) {
            for (var e in arguments) void 0 !== arguments[e] && (arguments[e] = JSON.stringify(arguments[e]));
            e = Array.prototype.slice.call(arguments).join(""), this.traceFunction({severity: "Debug", message: e})
        }
        if (null !== this._traceBuffer) {
            e = 0;
            for (var t = arguments.length; e < t; e++) this._traceBuffer.length == this._MAX_TRACE_ENTRIES && this._traceBuffer.shift(), 0 === e ? this._traceBuffer.push(arguments[e]) : void 0 === arguments[e] ? this._traceBuffer.push(arguments[e]) : this._traceBuffer.push("  " + JSON.stringify(arguments[e]))
        }
    }, h.prototype._traceMask = function (e, t) {
        var n, r = {};
        for (n in e) e.hasOwnProperty(n) && (r[n] = n == t ? "******" : e[n]);
        return r
    };
    var e = function (e, t, i, n) {
        var o;
        if ("string" != typeof e) throw Error(b(S.INVALID_TYPE, [typeof e, "host"]));
        if (2 == arguments.length) {
            n = t;
            var r = (o = e).match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
            if (!r) throw Error(b(S.INVALID_ARGUMENT, [e, "host"]));
            e = r[4] || r[2], t = parseInt(r[7]), i = r[8]
        } else {
            if (3 == arguments.length && (n = i, i = "/mqtt"), "number" != typeof t || t < 0) throw Error(b(S.INVALID_TYPE, [typeof t, "port"]));
            if ("string" != typeof i) throw Error(b(S.INVALID_TYPE, [typeof i, "path"]));
            o = "ws://" + (-1 != e.indexOf(":") && "[" != e.slice(0, 1) && "]" != e.slice(-1) ? "[" + e + "]" : e) + ":" + t + i
        }
        for (var a = r = 0; a < n.length; a++) {
            var s = n.charCodeAt(a);
            55296 <= s && s <= 56319 && a++, r++
        }
        if ("string" != typeof n || 65535 < r) throw Error(b(S.INVALID_ARGUMENT, [n, "clientId"]));
        var c = new h(o, e, t, i, n);
        this._getHost = function () {
            return e
        }, this._setHost = function () {
            throw Error(b(S.UNSUPPORTED_OPERATION))
        }, this._getPort = function () {
            return t
        }, this._setPort = function () {
            throw Error(b(S.UNSUPPORTED_OPERATION))
        }, this._getPath = function () {
            return i
        }, this._setPath = function () {
            throw Error(b(S.UNSUPPORTED_OPERATION))
        }, this._getURI = function () {
            return o
        }, this._setURI = function () {
            throw Error(b(S.UNSUPPORTED_OPERATION))
        }, this._getClientId = function () {
            return c.clientId
        }, this._setClientId = function () {
            throw Error(b(S.UNSUPPORTED_OPERATION))
        }, this._getOnConnectionLost = function () {
            return c.onConnectionLost
        }, this._setOnConnectionLost = function (e) {
            if ("function" != typeof e) throw Error(b(S.INVALID_TYPE, [typeof e, "onConnectionLost"]));
            c.onConnectionLost = e
        }, this._getOnMessageDelivered = function () {
            return c.onMessageDelivered
        }, this._setOnMessageDelivered = function (e) {
            if ("function" != typeof e) throw Error(b(S.INVALID_TYPE, [typeof e, "onMessageDelivered"]));
            c.onMessageDelivered = e
        }, this._getOnMessageArrived = function () {
            return c.onMessageArrived
        }, this._setOnMessageArrived = function (e) {
            if ("function" != typeof e) throw Error(b(S.INVALID_TYPE, [typeof e, "onMessageArrived"]));
            c.onMessageArrived = e
        }, this._getTrace = function () {
            return c.traceFunction
        }, this._setTrace = function (e) {
            if ("function" != typeof e) throw Error(b(S.INVALID_TYPE, [typeof e, "onTrace"]));
            c.traceFunction = e
        }, this.connect = function (e) {
            if (d(e = e || {}, {
                timeout: "number",
                userName: "string",
                password: "string",
                willMessage: "object",
                keepAliveInterval: "number",
                cleanSession: "boolean",
                useSSL: "boolean",
                invocationContext: "object",
                onSuccess: "function",
                onFailure: "function",
                hosts: "object",
                ports: "object",
                mqttVersion: "number"
            }), void 0 === e.keepAliveInterval && (e.keepAliveInterval = 60), 4 < e.mqttVersion || e.mqttVersion < 3) throw Error(b(S.INVALID_ARGUMENT, [e.mqttVersion, "connectOptions.mqttVersion"]));
            if (void 0 === e.mqttVersion ? (e.mqttVersionExplicit = !1, e.mqttVersion = 4) : e.mqttVersionExplicit = !0, void 0 === e.password && void 0 !== e.userName) throw Error(b(S.INVALID_ARGUMENT, [e.password, "connectOptions.password"]));
            if (e.willMessage) {
                if (!(e.willMessage instanceof v)) throw Error(b(S.INVALID_TYPE, [e.willMessage, "connectOptions.willMessage"]));
                if (e.willMessage.stringPayload, void 0 === e.willMessage.destinationName) throw Error(b(S.INVALID_TYPE, [typeof e.willMessage.destinationName, "connectOptions.willMessage.destinationName"]))
            }
            if (void 0 === e.cleanSession && (e.cleanSession = !0), e.hosts) {
                if (!(e.hosts instanceof Array)) throw Error(b(S.INVALID_ARGUMENT, [e.hosts, "connectOptions.hosts"]));
                if (e.hosts.length < 1) throw Error(b(S.INVALID_ARGUMENT, [e.hosts, "connectOptions.hosts"]));
                for (var t = !1, n = 0; n < e.hosts.length; n++) {
                    if ("string" != typeof e.hosts[n]) throw Error(b(S.INVALID_TYPE, [typeof e.hosts[n], "connectOptions.hosts[" + n + "]"]));
                    if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(e.hosts[n])) {
                        if (0 == n) t = !0; else if (!t) throw Error(b(S.INVALID_ARGUMENT, [e.hosts[n], "connectOptions.hosts[" + n + "]"]))
                    } else if (t) throw Error(b(S.INVALID_ARGUMENT, [e.hosts[n], "connectOptions.hosts[" + n + "]"]))
                }
                if (t) e.uris = e.hosts; else {
                    if (!e.ports) throw Error(b(S.INVALID_ARGUMENT, [e.ports, "connectOptions.ports"]));
                    if (!(e.ports instanceof Array)) throw Error(b(S.INVALID_ARGUMENT, [e.ports, "connectOptions.ports"]));
                    if (e.hosts.length != e.ports.length) throw Error(b(S.INVALID_ARGUMENT, [e.ports, "connectOptions.ports"]));
                    for (e.uris = [], n = 0; n < e.hosts.length; n++) {
                        if ("number" != typeof e.ports[n] || e.ports[n] < 0) throw Error(b(S.INVALID_TYPE, [typeof e.ports[n], "connectOptions.ports[" + n + "]"]));
                        t = e.hosts[n];
                        var r = e.ports[n];
                        o = "ws://" + (-1 != t.indexOf(":") ? "[" + t + "]" : t) + ":" + r + i, e.uris.push(o)
                    }
                }
            }
            c.connect(e)
        }, this.subscribe = function (e, t) {
            if ("string" != typeof e) throw Error("Invalid argument:" + e);
            if (d(t = t || {}, {
                qos: "number",
                invocationContext: "object",
                onSuccess: "function",
                onFailure: "function",
                timeout: "number"
            }), t.timeout && !t.onFailure) throw Error("subscribeOptions.timeout specified with no onFailure callback.");
            if (void 0 !== t.qos && 0 !== t.qos && 1 !== t.qos && 2 !== t.qos) throw Error(b(S.INVALID_ARGUMENT, [t.qos, "subscribeOptions.qos"]));
            c.subscribe(e, t)
        }, this.unsubscribe = function (e, t) {
            if ("string" != typeof e) throw Error("Invalid argument:" + e);
            if (d(t = t || {}, {
                invocationContext: "object",
                onSuccess: "function",
                onFailure: "function",
                timeout: "number"
            }), t.timeout && !t.onFailure) throw Error("unsubscribeOptions.timeout specified with no onFailure callback.");
            c.unsubscribe(e, t)
        }, this.send = function (e, t, n, r) {
            var i;
            if (0 == arguments.length) throw Error("Invalid argument.length");
            if (1 == arguments.length) {
                if (!(e instanceof v) && "string" != typeof e) throw Error("Invalid argument:" + typeof e);
                if (void 0 === (i = e).destinationName) throw Error(b(S.INVALID_ARGUMENT, [i.destinationName, "Message.destinationName"]))
            } else (i = new v(t)).destinationName = e, 3 <= arguments.length && (i.qos = n), 4 <= arguments.length && (i.retained = r);
            c.send(i)
        }, this.disconnect = function () {
            c.disconnect()
        }, this.getTraceLog = function () {
            return c.getTraceLog()
        }, this.startTrace = function () {
            c.startTrace()
        }, this.stopTrace = function () {
            c.stopTrace()
        }, this.isConnected = function () {
            return c.connected
        }
    };
    e.prototype = {
        get host() {
            return this._getHost()
        }, set host(e) {
            this._setHost(e)
        }, get port() {
            return this._getPort()
        }, set port(e) {
            this._setPort(e)
        }, get path() {
            return this._getPath()
        }, set path(e) {
            this._setPath(e)
        }, get clientId() {
            return this._getClientId()
        }, set clientId(e) {
            this._setClientId(e)
        }, get onConnectionLost() {
            return this._getOnConnectionLost()
        }, set onConnectionLost(e) {
            this._setOnConnectionLost(e)
        }, get onMessageDelivered() {
            return this._getOnMessageDelivered()
        }, set onMessageDelivered(e) {
            this._setOnMessageDelivered(e)
        }, get onMessageArrived() {
            return this._getOnMessageArrived()
        }, set onMessageArrived(e) {
            this._setOnMessageArrived(e)
        }, get trace() {
            return this._getTrace()
        }, set trace(e) {
            this._setTrace(e)
        }
    };
    var v = function (e) {
        var t;
        if (!("string" == typeof e || e instanceof ArrayBuffer || e instanceof Int8Array || e instanceof Uint8Array || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array)) throw b(S.INVALID_ARGUMENT, [e, "newPayload"]);
        t = e, this._getPayloadString = function () {
            return "string" == typeof t ? t : y(t, 0, t.length)
        }, this._getPayloadBytes = function () {
            if ("string" != typeof t) return t;
            var e = new ArrayBuffer(p(t));
            e = new Uint8Array(e);
            return s(t, e, 0), e
        };
        var n = void 0;
        this._getDestinationName = function () {
            return n
        }, this._setDestinationName = function (e) {
            if ("string" != typeof e) throw Error(b(S.INVALID_ARGUMENT, [e, "newDestinationName"]));
            n = e
        };
        var r = 0;
        this._getQos = function () {
            return r
        };
        var i = !(this._setQos = function (e) {
            if (0 !== e && 1 !== e && 2 !== e) throw Error("Invalid argument:" + e);
            r = e
        });
        this._getRetained = function () {
            return i
        };
        var o = !(this._setRetained = function (e) {
            if ("boolean" != typeof e) throw Error(b(S.INVALID_ARGUMENT, [e, "newRetained"]));
            i = e
        });
        this._getDuplicate = function () {
            return o
        }, this._setDuplicate = function (e) {
            o = e
        }
    };
    return v.prototype = {
        get payloadString() {
            return this._getPayloadString()
        }, get payloadBytes() {
            return this._getPayloadBytes()
        }, get destinationName() {
            return this._getDestinationName()
        }, set destinationName(e) {
            this._setDestinationName(e)
        }, get qos() {
            return this._getQos()
        }, set qos(e) {
            this._setQos(e)
        }, get retained() {
            return this._getRetained()
        }, set retained(e) {
            this._setRetained(e)
        }, get duplicate() {
            return this._getDuplicate()
        }, set duplicate(e) {
            this._setDuplicate(e)
        }
    }, {Client: e, Message: v}
}(window), function o(a, s, c) {
    function d(n, e) {
        if (!s[n]) {
            if (!a[n]) {
                var t = "function" == typeof require && require;
                if (!e && t) return t(n, !0);
                if (u) return u(n, !0);
                var r = new Error("Cannot find module '" + n + "'");
                throw r.code = "MODULE_NOT_FOUND", r
            }
            var i = s[n] = {exports: {}};
            a[n][0].call(i.exports, function (e) {
                var t = a[n][1][e];
                return d(t || e)
            }, i, i.exports, o, a, s, c)
        }
        return s[n].exports
    }

    for (var u = "function" == typeof require && require, e = 0; e < c.length; e++) d(c[e]);
    return d
}({
    1: [function (e, t, n) {
        "use strict";
        var u = {
            generateIdentifier: function () {
                return Math.random().toString(36).substr(2, 10)
            }
        };
        u.localCName = u.generateIdentifier(), u.splitLines = function (e) {
            return e.trim().split("\n").map(function (e) {
                return e.trim()
            })
        }, u.splitSections = function (e) {
            return e.split("\nm=").map(function (e, t) {
                return (0 < t ? "m=" + e : e).trim() + "\r\n"
            })
        }, u.matchPrefix = function (e, t) {
            return u.splitLines(e).filter(function (e) {
                return 0 === e.indexOf(t)
            })
        }, u.parseCandidate = function (e) {
            for (var t, n = {
                foundation: (t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" "))[0],
                component: parseInt(t[1], 10),
                protocol: t[2].toLowerCase(),
                priority: parseInt(t[3], 10),
                ip: t[4],
                port: parseInt(t[5], 10),
                type: t[7]
            }, r = 8; r < t.length; r += 2) switch (t[r]) {
                case"raddr":
                    n.relatedAddress = t[r + 1];
                    break;
                case"rport":
                    n.relatedPort = parseInt(t[r + 1], 10);
                    break;
                case"tcptype":
                    n.tcpType = t[r + 1];
                    break;
                default:
                    n[t[r]] = t[r + 1]
            }
            return n
        }, u.writeCandidate = function (e) {
            var t = [];
            t.push(e.foundation), t.push(e.component), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.ip), t.push(e.port);
            var n = e.type;
            return t.push("typ"), t.push(n), "host" !== n && e.relatedAddress && e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), e.ufrag && (t.push("ufrag"), t.push(e.ufrag)), "candidate:" + t.join(" ")
        }, u.parseIceOptions = function (e) {
            return e.substr(14).split(" ")
        }, u.parseRtpMap = function (e) {
            var t = e.substr(9).split(" "), n = {payloadType: parseInt(t.shift(), 10)};
            return t = t[0].split("/"), n.name = t[0], n.clockRate = parseInt(t[1], 10), n.numChannels = 3 === t.length ? parseInt(t[2], 10) : 1, n
        }, u.writeRtpMap = function (e) {
            var t = e.payloadType;
            return void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType), "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== e.numChannels ? "/" + e.numChannels : "") + "\r\n"
        }, u.parseExtmap = function (e) {
            var t = e.substr(9).split(" ");
            return {id: parseInt(t[0], 10), direction: 0 < t[0].indexOf("/") ? t[0].split("/")[1] : "sendrecv", uri: t[1]}
        }, u.writeExtmap = function (e) {
            return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + "\r\n"
        }, u.parseFmtp = function (e) {
            for (var t, n = {}, r = e.substr(e.indexOf(" ") + 1).split(";"), i = 0; i < r.length; i++) n[(t = r[i].trim().split("="))[0].trim()] = t[1];
            return n
        }, u.writeFmtp = function (t) {
            var e = "", n = t.payloadType;
            if (void 0 !== t.preferredPayloadType && (n = t.preferredPayloadType), t.parameters && Object.keys(t.parameters).length) {
                var r = [];
                Object.keys(t.parameters).forEach(function (e) {
                    r.push(e + "=" + t.parameters[e])
                }), e += "a=fmtp:" + n + " " + r.join(";") + "\r\n"
            }
            return e
        }, u.parseRtcpFb = function (e) {
            var t = e.substr(e.indexOf(" ") + 1).split(" ");
            return {type: t.shift(), parameter: t.join(" ")}
        }, u.writeRtcpFb = function (e) {
            var t = "", n = e.payloadType;
            return void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(function (e) {
                t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
            }), t
        }, u.parseSsrcMedia = function (e) {
            var t = e.indexOf(" "), n = {ssrc: parseInt(e.substr(7, t - 7), 10)}, r = e.indexOf(":", t);
            return -1 < r ? (n.attribute = e.substr(t + 1, r - t - 1), n.value = e.substr(r + 1)) : n.attribute = e.substr(t + 1), n
        }, u.getMid = function (e) {
            var t = u.matchPrefix(e, "a=mid:")[0];
            if (t) return t.substr(6)
        }, u.parseFingerprint = function (e) {
            var t = e.substr(14).split(" ");
            return {algorithm: t[0].toLowerCase(), value: t[1]}
        }, u.getDtlsParameters = function (e, t) {
            return {role: "auto", fingerprints: u.matchPrefix(e + t, "a=fingerprint:").map(u.parseFingerprint)}
        }, u.writeDtlsParameters = function (e, t) {
            var n = "a=setup:" + t + "\r\n";
            return e.fingerprints.forEach(function (e) {
                n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
            }), n
        }, u.getIceParameters = function (e, t) {
            var n = u.splitLines(e);
            return {
                usernameFragment: (n = n.concat(u.splitLines(t))).filter(function (e) {
                    return 0 === e.indexOf("a=ice-ufrag:")
                })[0].substr(12), password: n.filter(function (e) {
                    return 0 === e.indexOf("a=ice-pwd:")
                })[0].substr(10)
            }
        }, u.writeIceParameters = function (e) {
            return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n"
        }, u.parseRtpParameters = function (e) {
            for (var t = {
                codecs: [],
                headerExtensions: [],
                fecMechanisms: [],
                rtcp: []
            }, n = u.splitLines(e)[0].split(" "), r = 3; r < n.length; r++) {
                var i = n[r], o = u.matchPrefix(e, "a=rtpmap:" + i + " ")[0];
                if (o) {
                    var a = u.parseRtpMap(o), s = u.matchPrefix(e, "a=fmtp:" + i + " ");
                    switch (a.parameters = s.length ? u.parseFmtp(s[0]) : {}, a.rtcpFeedback = u.matchPrefix(e, "a=rtcp-fb:" + i + " ").map(u.parseRtcpFb), t.codecs.push(a), a.name.toUpperCase()) {
                        case"RED":
                        case"ULPFEC":
                            t.fecMechanisms.push(a.name.toUpperCase())
                    }
                }
            }
            return u.matchPrefix(e, "a=extmap:").forEach(function (e) {
                t.headerExtensions.push(u.parseExtmap(e))
            }), t
        }, u.writeRtpDescription = function (e, t) {
            var n = "";
            n += "m=" + e + " ", n += 0 < t.codecs.length ? "9" : "0", n += " UDP/TLS/RTP/SAVPF ", n += t.codecs.map(function (e) {
                return void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType
            }).join(" ") + "\r\n", n += "c=IN IP4 0.0.0.0\r\n", n += "a=rtcp:9 IN IP4 0.0.0.0\r\n", t.codecs.forEach(function (e) {
                n += u.writeRtpMap(e), n += u.writeFmtp(e), n += u.writeRtcpFb(e)
            });
            var r = 0;
            return t.codecs.forEach(function (e) {
                e.maxptime > r && (r = e.maxptime)
            }), 0 < r && (n += "a=maxptime:" + r + "\r\n"), n += "a=rtcp-mux\r\n", t.headerExtensions.forEach(function (e) {
                n += u.writeExtmap(e)
            }), n
        }, u.parseRtpEncodingParameters = function (e) {
            var n, r = [], t = u.parseRtpParameters(e), i = -1 !== t.fecMechanisms.indexOf("RED"), o = -1 !== t.fecMechanisms.indexOf("ULPFEC"),
                a = u.matchPrefix(e, "a=ssrc:").map(function (e) {
                    return u.parseSsrcMedia(e)
                }).filter(function (e) {
                    return "cname" === e.attribute
                }), s = 0 < a.length && a[0].ssrc, c = u.matchPrefix(e, "a=ssrc-group:FID").map(function (e) {
                    var t = e.split(" ");
                    return t.shift(), t.map(function (e) {
                        return parseInt(e, 10)
                    })
                });
            0 < c.length && 1 < c[0].length && c[0][0] === s && (n = c[0][1]), t.codecs.forEach(function (e) {
                if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                    var t = {ssrc: s, codecPayloadType: parseInt(e.parameters.apt, 10), rtx: {ssrc: n}};
                    r.push(t), i && ((t = JSON.parse(JSON.stringify(t))).fec = {ssrc: n, mechanism: o ? "red+ulpfec" : "red"}, r.push(t))
                }
            }), 0 === r.length && s && r.push({ssrc: s});
            var d = u.matchPrefix(e, "b=");
            return d.length && (d = 0 === d[0].indexOf("b=TIAS:") ? parseInt(d[0].substr(7), 10) : 0 === d[0].indexOf("b=AS:") ? 1e3 * parseInt(d[0].substr(5), 10) * .95 - 16e3 : void 0, r.forEach(function (e) {
                e.maxBitrate = d
            })), r
        }, u.parseRtcpParameters = function (e) {
            var t = {}, n = u.matchPrefix(e, "a=ssrc:").map(function (e) {
                return u.parseSsrcMedia(e)
            }).filter(function (e) {
                return "cname" === e.attribute
            })[0];
            n && (t.cname = n.value, t.ssrc = n.ssrc);
            var r = u.matchPrefix(e, "a=rtcp-rsize");
            t.reducedSize = 0 < r.length, t.compound = 0 === r.length;
            var i = u.matchPrefix(e, "a=rtcp-mux");
            return t.mux = 0 < i.length, t
        }, u.parseMsid = function (e) {
            var t, n = u.matchPrefix(e, "a=msid:");
            if (1 === n.length) return {stream: (t = n[0].substr(7).split(" "))[0], track: t[1]};
            var r = u.matchPrefix(e, "a=ssrc:").map(function (e) {
                return u.parseSsrcMedia(e)
            }).filter(function (e) {
                return "msid" === e.attribute
            });
            return 0 < r.length ? {stream: (t = r[0].value.split(" "))[0], track: t[1]} : void 0
        }, u.generateSessionId = function () {
            return Math.random().toString().substr(2, 21)
        }, u.writeSessionBoilerplate = function (e, t) {
            var n = void 0 !== t ? t : 2;
            return "v=0\r\no=thisisadapterortc " + (e || u.generateSessionId()) + " " + n + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
        }, u.writeMediaSection = function (e, t, n, r) {
            var i = u.writeRtpDescription(e.kind, t);
            if (i += u.writeIceParameters(e.iceGatherer.getLocalParameters()), i += u.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : "active"), i += "a=mid:" + e.mid + "\r\n", e.direction ? i += "a=" + e.direction + "\r\n" : e.rtpSender && e.rtpReceiver ? i += "a=sendrecv\r\n" : e.rtpSender ? i += "a=sendonly\r\n" : e.rtpReceiver ? i += "a=recvonly\r\n" : i += "a=inactive\r\n", e.rtpSender) {
                var o = "msid:" + r.id + " " + e.rtpSender.track.id + "\r\n";
                i += "a=" + o, i += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + o, e.sendEncodingParameters[0].rtx && (i += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + o, i += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
            }
            return i += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + u.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (i += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + u.localCName + "\r\n"), i
        }, u.getDirection = function (e, t) {
            for (var n = u.splitLines(e), r = 0; r < n.length; r++) switch (n[r]) {
                case"a=sendrecv":
                case"a=sendonly":
                case"a=recvonly":
                case"a=inactive":
                    return n[r].substr(2)
            }
            return t ? u.getDirection(t) : "sendrecv"
        }, u.getKind = function (e) {
            return u.splitLines(e)[0].split(" ")[0].substr(2)
        }, u.isRejected = function (e) {
            return "0" === e.split(" ", 2)[1]
        }, t.exports = u
    }, {}],
    2: [function (n, r, e) {
        (function (e) {
            "use strict";
            var t = n("./adapter_factory.js");
            r.exports = t({window: e.window})
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {"./adapter_factory.js": 3}],
    3: [function (u, e, t) {
        "use strict";
        e.exports = function (e) {
            var t = e && e.window, n = u("./utils"), r = n.log, i = n.detectBrowser(t),
                o = {browserDetails: i, extractVersion: n.extractVersion, disableLog: n.disableLog, disableWarnings: n.disableWarnings},
                a = u("./chrome/chrome_shim") || null, s = u("./edge/edge_shim") || null, c = u("./firefox/firefox_shim") || null,
                d = u("./safari/safari_shim") || null;
            switch (i.browser) {
                case"chrome":
                    if (!a || !a.shimPeerConnection) return r("Chrome shim is not included in this adapter release."), o;
                    r("adapter.js shimming chrome."), (o.browserShim = a).shimGetUserMedia(t), a.shimMediaStream(t), n.shimCreateObjectURL(t), a.shimSourceObject(t), a.shimPeerConnection(t), a.shimOnTrack(t), a.shimGetSendersWithDtmf(t);
                    break;
                case"firefox":
                    if (!c || !c.shimPeerConnection) return r("Firefox shim is not included in this adapter release."), o;
                    r("adapter.js shimming firefox."), (o.browserShim = c).shimGetUserMedia(t), n.shimCreateObjectURL(t), c.shimSourceObject(t), c.shimPeerConnection(t), c.shimOnTrack(t);
                    break;
                case"edge":
                    if (!s || !s.shimPeerConnection) return r("MS edge shim is not included in this adapter release."), o;
                    r("adapter.js shimming edge."), (o.browserShim = s).shimGetUserMedia(t), n.shimCreateObjectURL(t), s.shimPeerConnection(t), s.shimReplaceTrack(t);
                    break;
                case"safari":
                    if (!d) return r("Safari shim is not included in this adapter release."), o;
                    r("adapter.js shimming safari."), o.browserShim = d, n.shimCreateObjectURL(t), d.shimRTCIceServerUrls(t), d.shimCallbacksAPI(t), d.shimLocalStreamsAPI(t), d.shimRemoteStreamsAPI(t), d.shimGetUserMedia(t);
                    break;
                default:
                    r("Unsupported browser!")
            }
            return o
        }
    }, {"./chrome/chrome_shim": 4, "./edge/edge_shim": 6, "./firefox/firefox_shim": 9, "./safari/safari_shim": 11, "./utils": 12}],
    4: [function (e, t, n) {
        "use strict";
        var r = e("../utils.js"), i = r.log, o = {
            shimMediaStream: function (e) {
                e.MediaStream = e.MediaStream || e.webkitMediaStream
            }, shimOnTrack: function (o) {
                "object" != typeof o || !o.RTCPeerConnection || "ontrack" in o.RTCPeerConnection.prototype || Object.defineProperty(o.RTCPeerConnection.prototype, "ontrack", {
                    get: function () {
                        return this._ontrack
                    }, set: function (e) {
                        var i = this;
                        this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly)), this.addEventListener("track", this._ontrack = e), this.addEventListener("addstream", this._ontrackpoly = function (r) {
                            r.stream.addEventListener("addtrack", function (t) {
                                var e;
                                e = o.RTCPeerConnection.prototype.getReceivers ? i.getReceivers().find(function (e) {
                                    return e.track.id === t.track.id
                                }) : {track: t.track};
                                var n = new Event("track");
                                n.track = t.track, n.receiver = e, n.streams = [r.stream], i.dispatchEvent(n)
                            }), r.stream.getTracks().forEach(function (t) {
                                var e;
                                e = o.RTCPeerConnection.prototype.getReceivers ? i.getReceivers().find(function (e) {
                                    return e.track.id === t.id
                                }) : {track: t};
                                var n = new Event("track");
                                n.track = t, n.receiver = e, n.streams = [r.stream], this.dispatchEvent(n)
                            }.bind(this))
                        }.bind(this))
                    }
                })
            }, shimGetSendersWithDtmf: function (s) {
                if ("object" == typeof s && s.RTCPeerConnection && !("getSenders" in s.RTCPeerConnection.prototype) && "createDTMFSender" in s.RTCPeerConnection.prototype) {
                    s.RTCPeerConnection.prototype.getSenders = function () {
                        return this._senders || []
                    };
                    var n = s.RTCPeerConnection.prototype.addStream, t = s.RTCPeerConnection.prototype.removeStream;
                    s.RTCPeerConnection.prototype.addTrack || (s.RTCPeerConnection.prototype.addTrack = function (t, e) {
                        var n = this;
                        if ("closed" === n.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                        var r = [].slice.call(arguments, 1);
                        if (1 !== r.length || !r[0].getTracks().find(function (e) {
                            return e === t
                        })) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
                        if (n._senders = n._senders || [], n._senders.find(function (e) {
                            return e.track === t
                        })) throw new DOMException("Track already exists.", "InvalidAccessError");
                        n._streams = n._streams || {};
                        var i = n._streams[e.id];
                        if (i) i.addTrack(t), n.removeStream(i), n.addStream(i); else {
                            var o = new s.MediaStream([t]);
                            n._streams[e.id] = o, n.addStream(o)
                        }
                        var a = {
                            track: t, get dtmf() {
                                return void 0 === this._dtmf && ("audio" === t.kind ? this._dtmf = n.createDTMFSender(t) : this._dtmf = null), this._dtmf
                            }
                        };
                        return n._senders.push(a), a
                    }), s.RTCPeerConnection.prototype.addStream = function (e) {
                        var t = this;
                        t._senders = t._senders || [], n.apply(t, [e]), e.getTracks().forEach(function (e) {
                            t._senders.push({
                                track: e, get dtmf() {
                                    return void 0 === this._dtmf && ("audio" === e.kind ? this._dtmf = t.createDTMFSender(e) : this._dtmf = null), this._dtmf
                                }
                            })
                        })
                    }, s.RTCPeerConnection.prototype.removeStream = function (e) {
                        var n = this;
                        n._senders = n._senders || [], t.apply(n, [e]), e.getTracks().forEach(function (t) {
                            var e = n._senders.find(function (e) {
                                return e.track === t
                            });
                            e && n._senders.splice(n._senders.indexOf(e), 1)
                        })
                    }
                } else if ("object" == typeof s && s.RTCPeerConnection && "getSenders" in s.RTCPeerConnection.prototype && "createDTMFSender" in s.RTCPeerConnection.prototype && s.RTCRtpSender && !("dtmf" in s.RTCRtpSender.prototype)) {
                    var r = s.RTCPeerConnection.prototype.getSenders;
                    s.RTCPeerConnection.prototype.getSenders = function () {
                        var t = this, e = r.apply(t, []);
                        return e.forEach(function (e) {
                            e._pc = t
                        }), e
                    }, Object.defineProperty(s.RTCRtpSender.prototype, "dtmf", {
                        get: function () {
                            return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf
                        }
                    })
                }
            }, shimSourceObject: function (e) {
                var n = e && e.URL;
                "object" == typeof e && (!e.HTMLMediaElement || "srcObject" in e.HTMLMediaElement.prototype || Object.defineProperty(e.HTMLMediaElement.prototype, "srcObject", {
                    get: function () {
                        return this._srcObject
                    }, set: function (e) {
                        var t = this;
                        this._srcObject = e, this.src && n.revokeObjectURL(this.src), e ? (this.src = n.createObjectURL(e), e.addEventListener("addtrack", function () {
                            t.src && n.revokeObjectURL(t.src), t.src = n.createObjectURL(e)
                        }), e.addEventListener("removetrack", function () {
                            t.src && n.revokeObjectURL(t.src), t.src = n.createObjectURL(e)
                        })) : this.src = ""
                    }
                }))
            }, shimPeerConnection: function (n) {
                var e = r.detectBrowser(n);
                if (n.RTCPeerConnection) {
                    var o = n.RTCPeerConnection;
                    n.RTCPeerConnection = function (e, t) {
                        if (e && e.iceServers) {
                            for (var n = [], r = 0; r < e.iceServers.length; r++) {
                                var i = e.iceServers[r];
                                !i.hasOwnProperty("urls") && i.hasOwnProperty("url") ? (console.warn("RTCIceServer.url is deprecated! Use urls instead."), (i = JSON.parse(JSON.stringify(i))).urls = i.url, n.push(i)) : n.push(e.iceServers[r])
                            }
                            e.iceServers = n
                        }
                        return new o(e, t)
                    }, n.RTCPeerConnection.prototype = o.prototype, Object.defineProperty(n.RTCPeerConnection, "generateCertificate", {
                        get: function () {
                            return o.generateCertificate
                        }
                    })
                } else n.RTCPeerConnection = function (e, t) {
                    return i("PeerConnection"), e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy), new n.webkitRTCPeerConnection(e, t)
                }, n.RTCPeerConnection.prototype = n.webkitRTCPeerConnection.prototype, n.webkitRTCPeerConnection.generateCertificate && Object.defineProperty(n.RTCPeerConnection, "generateCertificate", {
                    get: function () {
                        return n.webkitRTCPeerConnection.generateCertificate
                    }
                });
                var s = n.RTCPeerConnection.prototype.getStats;
                n.RTCPeerConnection.prototype.getStats = function (e, t, n) {
                    var r = this, i = arguments;
                    if (0 < arguments.length && "function" == typeof e) return s.apply(this, arguments);
                    var o = function (e) {
                        var r = {};
                        return e.result().forEach(function (t) {
                            var n = {
                                id: t.id,
                                timestamp: t.timestamp,
                                type: {localcandidate: "local-candidate", remotecandidate: "remote-candidate"}[t.type] || t.type
                            };
                            t.names().forEach(function (e) {
                                n[e] = t.stat(e)
                            }), r[n.id] = n
                        }), r
                    }, a = function (t) {
                        return new Map(Object.keys(t).map(function (e) {
                            return [e, t[e]]
                        }))
                    };
                    if (2 <= arguments.length) {
                        return s.apply(this, [function (e) {
                            i[1](a(o(e)))
                        }, e])
                    }
                    return new Promise(function (t, e) {
                        s.apply(r, [function (e) {
                            t(a(o(e)))
                        }, e])
                    }).then(t, n)
                }, e.version < 51 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                    var i = n.RTCPeerConnection.prototype[e];
                    n.RTCPeerConnection.prototype[e] = function () {
                        var n = arguments, r = this, e = new Promise(function (e, t) {
                            i.apply(r, [n[0], e, t])
                        });
                        return n.length < 2 ? e : e.then(function () {
                            n[1].apply(null, [])
                        }, function (e) {
                            3 <= n.length && n[2].apply(null, [e])
                        })
                    }
                }), e.version < 52 && ["createOffer", "createAnswer"].forEach(function (e) {
                    var i = n.RTCPeerConnection.prototype[e];
                    n.RTCPeerConnection.prototype[e] = function () {
                        var n = this;
                        if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) {
                            var r = 1 === arguments.length ? arguments[0] : void 0;
                            return new Promise(function (e, t) {
                                i.apply(n, [e, t, r])
                            })
                        }
                        return i.apply(this, arguments)
                    }
                }), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                    var t = n.RTCPeerConnection.prototype[e];
                    n.RTCPeerConnection.prototype[e] = function () {
                        return arguments[0] = new ("addIceCandidate" === e ? n.RTCIceCandidate : n.RTCSessionDescription)(arguments[0]), t.apply(this, arguments)
                    }
                });
                var t = n.RTCPeerConnection.prototype.addIceCandidate;
                n.RTCPeerConnection.prototype.addIceCandidate = function () {
                    return arguments[0] ? t.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                }
            }
        };
        t.exports = {
            shimMediaStream: o.shimMediaStream,
            shimOnTrack: o.shimOnTrack,
            shimGetSendersWithDtmf: o.shimGetSendersWithDtmf,
            shimSourceObject: o.shimSourceObject,
            shimPeerConnection: o.shimPeerConnection,
            shimGetUserMedia: e("./getusermedia")
        }
    }, {"../utils.js": 12, "./getusermedia": 5}],
    5: [function (e, t, n) {
        "use strict";
        var o = e("../utils.js"), d = o.log;
        t.exports = function (e) {
            var a = o.detectBrowser(e), s = e && e.navigator, c = function (i) {
                if ("object" != typeof i || i.mandatory || i.optional) return i;
                var o = {};
                return Object.keys(i).forEach(function (t) {
                    if ("require" !== t && "advanced" !== t && "mediaSource" !== t) {
                        var n = "object" == typeof i[t] ? i[t] : {ideal: i[t]};
                        void 0 !== n.exact && "number" == typeof n.exact && (n.min = n.max = n.exact);
                        var r = function (e, t) {
                            return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                        };
                        if (void 0 !== n.ideal) {
                            o.optional = o.optional || [];
                            var e = {};
                            "number" == typeof n.ideal ? (e[r("min", t)] = n.ideal, o.optional.push(e), (e = {})[r("max", t)] = n.ideal) : e[r("", t)] = n.ideal, o.optional.push(e)
                        }
                        void 0 !== n.exact && "number" != typeof n.exact ? (o.mandatory = o.mandatory || {}, o.mandatory[r("", t)] = n.exact) : ["min", "max"].forEach(function (e) {
                            void 0 !== n[e] && (o.mandatory = o.mandatory || {}, o.mandatory[r(e, t)] = n[e])
                        })
                    }
                }), i.advanced && (o.optional = (o.optional || []).concat(i.advanced)), o
            }, r = function (n, r) {
                if ((n = JSON.parse(JSON.stringify(n))) && "object" == typeof n.audio) {
                    var e = function (e, t, n) {
                        t in e && !(n in e) && (e[n] = e[t], delete e[t])
                    };
                    e((n = JSON.parse(JSON.stringify(n))).audio, "autoGainControl", "googAutoGainControl"), e(n.audio, "noiseSuppression", "googNoiseSuppression"), n.audio = c(n.audio)
                }
                if (n && "object" == typeof n.video) {
                    var i = n.video.facingMode;
                    i = i && ("object" == typeof i ? i : {ideal: i});
                    var o, t = a.version < 61;
                    if (i && ("user" === i.exact || "environment" === i.exact || "user" === i.ideal || "environment" === i.ideal) && (!s.mediaDevices.getSupportedConstraints || !s.mediaDevices.getSupportedConstraints().facingMode || t)) if (delete n.video.facingMode, "environment" === i.exact || "environment" === i.ideal ? o = ["back", "rear"] : "user" !== i.exact && "user" !== i.ideal || (o = ["front"]), o) return s.mediaDevices.enumerateDevices().then(function (e) {
                        var t = (e = e.filter(function (e) {
                            return "videoinput" === e.kind
                        })).find(function (t) {
                            return o.some(function (e) {
                                return -1 !== t.label.toLowerCase().indexOf(e)
                            })
                        });
                        return !t && e.length && -1 !== o.indexOf("back") && (t = e[e.length - 1]), t && (n.video.deviceId = i.exact ? {exact: t.deviceId} : {ideal: t.deviceId}), n.video = c(n.video), d("chrome: " + JSON.stringify(n)), r(n)
                    });
                    n.video = c(n.video)
                }
                return d("chrome: " + JSON.stringify(n)), r(n)
            }, i = function (e) {
                return {
                    name: {
                        PermissionDeniedError: "NotAllowedError",
                        InvalidStateError: "NotReadableError",
                        DevicesNotFoundError: "NotFoundError",
                        ConstraintNotSatisfiedError: "OverconstrainedError",
                        TrackStartError: "NotReadableError",
                        MediaDeviceFailedDueToShutdown: "NotReadableError",
                        MediaDeviceKillSwitchOn: "NotReadableError"
                    }[e.name] || e.name, message: e.message, constraint: e.constraintName, toString: function () {
                        return this.name + (this.message && ": ") + this.message
                    }
                }
            };
            s.getUserMedia = function (e, t, n) {
                r(e, function (e) {
                    s.webkitGetUserMedia(e, t, function (e) {
                        n(i(e))
                    })
                })
            };
            var t = function (n) {
                return new Promise(function (e, t) {
                    s.getUserMedia(n, e, t)
                })
            };
            if (s.mediaDevices || (s.mediaDevices = {
                getUserMedia: t, enumerateDevices: function () {
                    return new Promise(function (t) {
                        var n = {audio: "audioinput", video: "videoinput"};
                        return e.MediaStreamTrack.getSources(function (e) {
                            t(e.map(function (e) {
                                return {label: e.label, kind: n[e.kind], deviceId: e.id, groupId: ""}
                            }))
                        })
                    })
                }, getSupportedConstraints: function () {
                    return {deviceId: !0, echoCancellation: !0, facingMode: !0, frameRate: !0, height: !0, width: !0}
                }
            }), s.mediaDevices.getUserMedia) {
                var n = s.mediaDevices.getUserMedia.bind(s.mediaDevices);
                s.mediaDevices.getUserMedia = function (e) {
                    return r(e, function (t) {
                        return n(t).then(function (e) {
                            if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(function (e) {
                                e.stop()
                            }), new DOMException("", "NotFoundError");
                            return e
                        }, function (e) {
                            return Promise.reject(i(e))
                        })
                    })
                }
            } else s.mediaDevices.getUserMedia = function (e) {
                return t(e)
            };
            void 0 === s.mediaDevices.addEventListener && (s.mediaDevices.addEventListener = function () {
                d("Dummy mediaDevices.addEventListener called.")
            }), void 0 === s.mediaDevices.removeEventListener && (s.mediaDevices.removeEventListener = function () {
                d("Dummy mediaDevices.removeEventListener called.")
            })
        }
    }, {"../utils.js": 12}],
    6: [function (e, t, n) {
        "use strict";
        var r = e("../utils"), i = e("./rtcpeerconnection_shim");
        t.exports = {
            shimGetUserMedia: e("./getusermedia"), shimPeerConnection: function (e) {
                var t = r.detectBrowser(e);
                if (e.RTCIceGatherer && (e.RTCIceCandidate || (e.RTCIceCandidate = function (e) {
                    return e
                }), e.RTCSessionDescription || (e.RTCSessionDescription = function (e) {
                    return e
                }), t.version < 15025)) {
                    var n = Object.getOwnPropertyDescriptor(e.MediaStreamTrack.prototype, "enabled");
                    Object.defineProperty(e.MediaStreamTrack.prototype, "enabled", {
                        set: function (e) {
                            n.set.call(this, e);
                            var t = new Event("enabled");
                            t.enabled = e, this.dispatchEvent(t)
                        }
                    })
                }
                e.RTCPeerConnection = i(e, t.version)
            }, shimReplaceTrack: function (e) {
                !e.RTCRtpSender || "replaceTrack" in e.RTCRtpSender.prototype || (e.RTCRtpSender.prototype.replaceTrack = e.RTCRtpSender.prototype.setTrack)
            }
        }
    }, {"../utils": 12, "./getusermedia": 7, "./rtcpeerconnection_shim": 8}],
    7: [function (e, t, n) {
        "use strict";
        t.exports = function (e) {
            var t = e && e.navigator, n = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
            t.mediaDevices.getUserMedia = function (e) {
                return n(e).catch(function (e) {
                    return Promise.reject(function (e) {
                        return {
                            name: {PermissionDeniedError: "NotAllowedError"}[e.name] || e.name,
                            message: e.message,
                            constraint: e.constraint,
                            toString: function () {
                                return this.name
                            }
                        }
                    }(e))
                })
            }
        }
    }, {}],
    8: [function (e, t, n) {
        "use strict";
        var P = e("sdp");

        function m(d, u) {
            var l = {codecs: [], headerExtensions: [], fecMechanisms: []}, p = function (e, t) {
                e = parseInt(e, 10);
                for (var n = 0; n < t.length; n++) if (t[n].payloadType === e || t[n].preferredPayloadType === e) return t[n]
            };
            return d.codecs.forEach(function (n) {
                for (var e = 0; e < u.codecs.length; e++) {
                    var t = u.codecs[e];
                    if (n.name.toLowerCase() === t.name.toLowerCase() && n.clockRate === t.clockRate) {
                        if ("rtx" === n.name.toLowerCase() && n.parameters && t.parameters.apt && (r = n, i = t, o = d.codecs, a = u.codecs, c = s = void 0, s = p(r.parameters.apt, o), c = p(i.parameters.apt, a), !s || !c || s.name.toLowerCase() !== c.name.toLowerCase())) continue;
                        (t = JSON.parse(JSON.stringify(t))).numChannels = Math.min(n.numChannels, t.numChannels), l.codecs.push(t), t.rtcpFeedback = t.rtcpFeedback.filter(function (e) {
                            for (var t = 0; t < n.rtcpFeedback.length; t++) if (n.rtcpFeedback[t].type === e.type && n.rtcpFeedback[t].parameter === e.parameter) return !0;
                            return !1
                        });
                        break
                    }
                }
                var r, i, o, a, s, c
            }), d.headerExtensions.forEach(function (e) {
                for (var t = 0; t < u.headerExtensions.length; t++) {
                    var n = u.headerExtensions[t];
                    if (e.uri === n.uri) {
                        l.headerExtensions.push(n);
                        break
                    }
                }
            }), l
        }

        function a(e, t, n) {
            return -1 !== {
                offer: {setLocalDescription: ["stable", "have-local-offer"], setRemoteDescription: ["stable", "have-remote-offer"]},
                answer: {
                    setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
                    setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
                }
            }[t][e].indexOf(n)
        }

        t.exports = function (R, A) {
            var e = function (e) {
                var t = this, n = document.createDocumentFragment();
                if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function (e) {
                    t[e] = n[e].bind(n)
                }), this.needNegotiation = !1, this.onicecandidate = null, this.onaddstream = null, this.ontrack = null, this.onremovestream = null, this.onsignalingstatechange = null, this.oniceconnectionstatechange = null, this.onicegatheringstatechange = null, this.onnegotiationneeded = null, this.ondatachannel = null, this.canTrickleIceCandidates = null, this.localStreams = [], this.remoteStreams = [], this.getLocalStreams = function () {
                    return t.localStreams
                }, this.getRemoteStreams = function () {
                    return t.remoteStreams
                }, this.localDescription = new R.RTCSessionDescription({
                    type: "",
                    sdp: ""
                }), this.remoteDescription = new R.RTCSessionDescription({
                    type: "",
                    sdp: ""
                }), this.signalingState = "stable", this.iceConnectionState = "new", this.iceGatheringState = "new", this.iceOptions = {
                    gatherPolicy: "all",
                    iceServers: []
                }, e && e.iceTransportPolicy) switch (e.iceTransportPolicy) {
                    case"all":
                    case"relay":
                        this.iceOptions.gatherPolicy = e.iceTransportPolicy
                }
                this.usingBundle = e && "max-bundle" === e.bundlePolicy, e && e.iceServers && (this.iceOptions.iceServers = function (e, r) {
                    var i = !1;
                    return (e = JSON.parse(JSON.stringify(e))).filter(function (e) {
                        if (e && (e.urls || e.url)) {
                            var t = e.urls || e.url;
                            e.url && !e.urls && console.warn("RTCIceServer.url is deprecated! Use urls instead.");
                            var n = "string" == typeof t;
                            return n && (t = [t]), t = t.filter(function (e) {
                                return 0 !== e.indexOf("turn:") || -1 === e.indexOf("transport=udp") || -1 !== e.indexOf("turn:[") || i ? 0 === e.indexOf("stun:") && 14393 <= r : i = !0
                            }), delete e.url, e.urls = n ? t[0] : t, !!t.length
                        }
                        return !1
                    })
                }(e.iceServers, A)), this._config = e || {}, this.transceivers = [], this._localIceCandidatesBuffer = [], this._sdpSessionId = P.generateSessionId()
            };
            return e.prototype._emitGatheringStateChange = function () {
                var e = new Event("icegatheringstatechange");
                this.dispatchEvent(e), null !== this.onicegatheringstatechange && this.onicegatheringstatechange(e)
            }, e.prototype._emitBufferedCandidates = function () {
                var n = this, r = P.splitSections(n.localDescription.sdp);
                this._localIceCandidatesBuffer.forEach(function (e) {
                    if (!e.candidate || 0 === Object.keys(e.candidate).length) for (var t = 1; t < r.length; t++) -1 === r[t].indexOf("\r\na=end-of-candidates\r\n") && (r[t] += "a=end-of-candidates\r\n"); else r[e.candidate.sdpMLineIndex + 1] += "a=" + e.candidate.candidate + "\r\n";
                    (n.localDescription.sdp = r.join(""), n.dispatchEvent(e), null !== n.onicecandidate && n.onicecandidate(e), e.candidate || "complete" === n.iceGatheringState) || n.transceivers.every(function (e) {
                        return e.iceGatherer && "completed" === e.iceGatherer.state
                    }) && "complete" !== n.iceGatheringStateChange && (n.iceGatheringState = "complete", n._emitGatheringStateChange())
                }), this._localIceCandidatesBuffer = []
            }, e.prototype.getConfiguration = function () {
                return this._config
            }, e.prototype._createTransceiver = function (e) {
                var t = 0 < this.transceivers.length, n = {
                    track: null,
                    iceGatherer: null,
                    iceTransport: null,
                    dtlsTransport: null,
                    localCapabilities: null,
                    remoteCapabilities: null,
                    rtpSender: null,
                    rtpReceiver: null,
                    kind: e,
                    mid: null,
                    sendEncodingParameters: null,
                    recvEncodingParameters: null,
                    stream: null,
                    wantReceive: !0
                };
                if (this.usingBundle && t) n.iceTransport = this.transceivers[0].iceTransport, n.dtlsTransport = this.transceivers[0].dtlsTransport; else {
                    var r = this._createIceAndDtlsTransports();
                    n.iceTransport = r.iceTransport, n.dtlsTransport = r.dtlsTransport
                }
                return this.transceivers.push(n), n
            }, e.prototype.addTrack = function (e, t) {
                for (var n, r = 0; r < this.transceivers.length; r++) this.transceivers[r].track || this.transceivers[r].kind !== e.kind || (n = this.transceivers[r]);
                return n || (n = this._createTransceiver(e.kind)), n.track = e, n.stream = t, n.rtpSender = new R.RTCRtpSender(e, n.dtlsTransport), this._maybeFireNegotiationNeeded(), n.rtpSender
            }, e.prototype.addStream = function (t) {
                var n = this;
                if (15025 <= A) this.localStreams.push(t), t.getTracks().forEach(function (e) {
                    n.addTrack(e, t)
                }); else {
                    var r = t.clone();
                    t.getTracks().forEach(function (e, t) {
                        var n = r.getTracks()[t];
                        e.addEventListener("enabled", function (e) {
                            n.enabled = e.enabled
                        })
                    }), r.getTracks().forEach(function (e) {
                        n.addTrack(e, r)
                    }), this.localStreams.push(r)
                }
                this._maybeFireNegotiationNeeded()
            }, e.prototype.removeStream = function (e) {
                var t = this.localStreams.indexOf(e);
                -1 < t && (this.localStreams.splice(t, 1), this._maybeFireNegotiationNeeded())
            }, e.prototype.getSenders = function () {
                return this.transceivers.filter(function (e) {
                    return !!e.rtpSender
                }).map(function (e) {
                    return e.rtpSender
                })
            }, e.prototype.getReceivers = function () {
                return this.transceivers.filter(function (e) {
                    return !!e.rtpReceiver
                }).map(function (e) {
                    return e.rtpReceiver
                })
            }, e.prototype._createIceGatherer = function (a, s) {
                var c = this, d = new R.RTCIceGatherer(c.iceOptions);
                return d.onlocalcandidate = function (e) {
                    var t = new Event("icecandidate");
                    t.candidate = {sdpMid: a, sdpMLineIndex: s};
                    var n = e.candidate, r = !n || 0 === Object.keys(n).length;
                    r ? void 0 === d.state && (d.state = "completed") : (n.component = 1, t.candidate.candidate = P.writeCandidate(n));
                    var i = P.splitSections(c.localDescription.sdp);
                    i[t.candidate.sdpMLineIndex + 1] += r ? "a=end-of-candidates\r\n" : "a=" + t.candidate.candidate + "\r\n", c.localDescription.sdp = i.join("");
                    var o = (c._pendingOffer ? c._pendingOffer : c.transceivers).every(function (e) {
                        return e.iceGatherer && "completed" === e.iceGatherer.state
                    });
                    switch (c.iceGatheringState) {
                        case"new":
                            r || c._localIceCandidatesBuffer.push(t), r && o && c._localIceCandidatesBuffer.push(new Event("icecandidate"));
                            break;
                        case"gathering":
                            c._emitBufferedCandidates(), r || (c.dispatchEvent(t), null !== c.onicecandidate && c.onicecandidate(t)), o && (c.dispatchEvent(new Event("icecandidate")), null !== c.onicecandidate && c.onicecandidate(new Event("icecandidate")), c.iceGatheringState = "complete", c._emitGatheringStateChange())
                    }
                }, d
            }, e.prototype._createIceAndDtlsTransports = function () {
                var e = this, t = new R.RTCIceTransport(null);
                t.onicestatechange = function () {
                    e._updateConnectionState()
                };
                var n = new R.RTCDtlsTransport(t);
                return n.ondtlsstatechange = function () {
                    e._updateConnectionState()
                }, n.onerror = function () {
                    Object.defineProperty(n, "state", {value: "failed", writable: !0}), e._updateConnectionState()
                }, {iceTransport: t, dtlsTransport: n}
            }, e.prototype._disposeIceAndDtlsTransports = function (e) {
                var t = this.transceivers[e].iceGatherer;
                t && (delete t.onlocalcandidate, delete this.transceivers[e].iceGatherer);
                var n = this.transceivers[e].iceTransport;
                n && (delete n.onicestatechange, delete this.transceivers[e].iceTransport);
                var r = this.transceivers[e].dtlsTransport;
                r && (delete r.ondtlssttatechange, delete r.onerror, delete this.transceivers[e].dtlsTransport)
            }, e.prototype._transceive = function (e, t, n) {
                var r = m(e.localCapabilities, e.remoteCapabilities);
                t && e.rtpSender && (r.encodings = e.sendEncodingParameters, r.rtcp = {
                    cname: P.localCName,
                    compound: e.rtcpParameters.compound
                }, e.recvEncodingParameters.length && (r.rtcp.ssrc = e.recvEncodingParameters[0].ssrc), e.rtpSender.send(r)), n && e.rtpReceiver && ("video" === e.kind && e.recvEncodingParameters && A < 15019 && e.recvEncodingParameters.forEach(function (e) {
                    delete e.rtx
                }), r.encodings = e.recvEncodingParameters, r.rtcp = {
                    cname: e.rtcpParameters.cname,
                    compound: e.rtcpParameters.compound
                }, e.sendEncodingParameters.length && (r.rtcp.ssrc = e.sendEncodingParameters[0].ssrc), e.rtpReceiver.receive(r))
            }, e.prototype.setLocalDescription = function (e) {
                var t, l, p = this;
                if (!a("setLocalDescription", e.type, this.signalingState)) {
                    var n = new Error("Can not set local " + e.type + " in state " + this.signalingState);
                    return n.name = "InvalidStateError", 2 < arguments.length && "function" == typeof arguments[2] && R.setTimeout(arguments[2], 0, n), Promise.reject(n)
                }
                if ("offer" === e.type) this._pendingOffer && (t = P.splitSections(e.sdp), l = t.shift(), t.forEach(function (e, t) {
                    var n = P.parseRtpParameters(e);
                    p._pendingOffer[t].localCapabilities = n
                }), this.transceivers = this._pendingOffer, delete this._pendingOffer); else if ("answer" === e.type) {
                    t = P.splitSections(p.remoteDescription.sdp), l = t.shift();
                    var f = 0 < P.matchPrefix(l, "a=ice-lite").length;
                    t.forEach(function (e, t) {
                        var n = p.transceivers[t], r = n.iceGatherer, i = n.iceTransport, o = n.dtlsTransport, a = n.localCapabilities,
                            s = n.remoteCapabilities;
                        if (!P.isRejected(e) && !n.isDatachannel) {
                            var c = P.getIceParameters(e, l), d = P.getDtlsParameters(e, l);
                            f && (d.role = "server"), p.usingBundle && 0 !== t || (i.start(r, c, f ? "controlling" : "controlled"), o.start(d));
                            var u = m(a, s);
                            p._transceive(n, 0 < u.codecs.length, !1)
                        }
                    })
                }
                switch (this.localDescription = {type: e.type, sdp: e.sdp}, e.type) {
                    case"offer":
                        this._updateSignalingState("have-local-offer");
                        break;
                    case"answer":
                        this._updateSignalingState("stable");
                        break;
                    default:
                        throw new TypeError('unsupported type "' + e.type + '"')
                }
                var r = 1 < arguments.length && "function" == typeof arguments[1];
                if (r) {
                    var i = arguments[1];
                    R.setTimeout(function () {
                        i(), "new" === p.iceGatheringState && (p.iceGatheringState = "gathering", p._emitGatheringStateChange()), p._emitBufferedCandidates()
                    }, 0)
                }
                var o = Promise.resolve();
                return o.then(function () {
                    r || ("new" === p.iceGatheringState && (p.iceGatheringState = "gathering", p._emitGatheringStateChange()), R.setTimeout(p._emitBufferedCandidates.bind(p), 500))
                }), o
            }, e.prototype.setRemoteDescription = function (w) {
                var T = this;
                if (!a("setRemoteDescription", w.type, this.signalingState)) {
                    var e = new Error("Can not set remote " + w.type + " in state " + this.signalingState);
                    return e.name = "InvalidStateError", 2 < arguments.length && "function" == typeof arguments[2] && R.setTimeout(arguments[2], 0, e), Promise.reject(e)
                }
                var C = {}, E = [], t = P.splitSections(w.sdp), O = t.shift(),
                    k = (P.matchPrefix(O, "a=ice-lite").length, 0 < P.matchPrefix(O, "a=group:BUNDLE ").length);
                this.usingBundle = k;
                var n = P.matchPrefix(O, "a=ice-options:")[0];
                switch (this.canTrickleIceCandidates = !!n && 0 <= n.substr(14).split(" ").indexOf("trickle"), t.forEach(function (e, t) {
                    var n = P.splitLines(e), r = P.getKind(e), i = P.isRejected(e), o = n[0].substr(2).split(" ")[2], a = P.getDirection(e, O),
                        s = P.parseMsid(e), c = P.getMid(e) || P.generateIdentifier();
                    if ("application" !== r || "DTLS/SCTP" !== o) {
                        var d, u, l, p, f, m, h, v, g, y, S, b = P.parseRtpParameters(e);
                        i || (y = P.getIceParameters(e, O), (S = P.getDtlsParameters(e, O)).role = "client"), h = P.parseRtpEncodingParameters(e);
                        var _ = P.parseRtcpParameters(e), I = P.matchPrefix(e, "a=candidate:").map(function (e) {
                            return P.parseCandidate(e)
                        }).filter(function (e) {
                            return "1" === e.component || 1 === e.component
                        });
                        ("offer" === w.type || "answer" === w.type) && !i && k && 0 < t && T.transceivers[t] && (T._disposeIceAndDtlsTransports(t), T.transceivers[t].iceGatherer = T.transceivers[0].iceGatherer, T.transceivers[t].iceTransport = T.transceivers[0].iceTransport, T.transceivers[t].dtlsTransport = T.transceivers[0].dtlsTransport, T.transceivers[t].rtpSender && T.transceivers[t].rtpSender.setTransport(T.transceivers[0].dtlsTransport), T.transceivers[t].rtpReceiver && T.transceivers[t].rtpReceiver.setTransport(T.transceivers[0].dtlsTransport)), "offer" !== w.type || i ? "answer" !== w.type || i || (u = (d = T.transceivers[t]).iceGatherer, l = d.iceTransport, p = d.dtlsTransport, f = d.rtpReceiver, m = d.sendEncodingParameters, v = d.localCapabilities, T.transceivers[t].recvEncodingParameters = h, T.transceivers[t].remoteCapabilities = b, T.transceivers[t].rtcpParameters = _, I.length && "closed" !== l.state && 0 === t && l.setRemoteCandidates(I), k && 0 !== t || (l.start(u, y, "controlling"), p.start(S)), T._transceive(d, "sendrecv" === a || "recvonly" === a, "sendrecv" === a || "sendonly" === a), !f || "sendrecv" !== a && "sendonly" !== a ? delete d.rtpReceiver : (g = f.track, s ? (C[s.stream] || (C[s.stream] = new R.MediaStream), C[s.stream].addTrack(g), E.push([g, f, C[s.stream]])) : (C.default || (C.default = new R.MediaStream), C.default.addTrack(g), E.push([g, f, C.default])))) : ((d = T.transceivers[t] || T._createTransceiver(r)).mid = c, d.iceGatherer || (d.iceGatherer = k && 0 < t ? T.transceivers[0].iceGatherer : T._createIceGatherer(c, t)), k && 0 !== t || d.iceTransport.setRemoteCandidates(I), v = R.RTCRtpReceiver.getCapabilities(r), A < 15019 && (v.codecs = v.codecs.filter(function (e) {
                            return "rtx" !== e.name
                        })), m = [{ssrc: 1001 * (2 * t + 2)}], "sendrecv" !== a && "sendonly" !== a || (g = (f = new R.RTCRtpReceiver(d.dtlsTransport, r)).track, s ? (C[s.stream] || (C[s.stream] = new R.MediaStream, Object.defineProperty(C[s.stream], "id", {
                            get: function () {
                                return s.stream
                            }
                        })), Object.defineProperty(g, "id", {
                            get: function () {
                                return s.track
                            }
                        }), C[s.stream].addTrack(g), E.push([g, f, C[s.stream]])) : (C.default || (C.default = new R.MediaStream), C.default.addTrack(g), E.push([g, f, C.default]))), d.localCapabilities = v, d.remoteCapabilities = b, d.rtpReceiver = f, d.rtcpParameters = _, d.sendEncodingParameters = m, d.recvEncodingParameters = h, T._transceive(T.transceivers[t], !1, "sendrecv" === a || "sendonly" === a))
                    } else T.transceivers[t] = {mid: c, isDatachannel: !0}
                }), this.remoteDescription = {type: w.type, sdp: w.sdp}, w.type) {
                    case"offer":
                        this._updateSignalingState("have-remote-offer");
                        break;
                    case"answer":
                        this._updateSignalingState("stable");
                        break;
                    default:
                        throw new TypeError('unsupported type "' + w.type + '"')
                }
                return Object.keys(C).forEach(function (e) {
                    var i = C[e];
                    if (i.getTracks().length) {
                        T.remoteStreams.push(i);
                        var t = new Event("addstream");
                        t.stream = i, T.dispatchEvent(t), null !== T.onaddstream && R.setTimeout(function () {
                            T.onaddstream(t)
                        }, 0), E.forEach(function (e) {
                            var t = e[0], n = e[1];
                            if (i.id === e[2].id) {
                                var r = new Event("track");
                                r.track = t, r.receiver = n, r.streams = [i], T.dispatchEvent(r), null !== T.ontrack && R.setTimeout(function () {
                                    T.ontrack(r)
                                }, 0)
                            }
                        })
                    }
                }), R.setTimeout(function () {
                    T && T.transceivers && T.transceivers.forEach(function (e) {
                        e.iceTransport && "new" === e.iceTransport.state && 0 < e.iceTransport.getRemoteCandidates().length && (console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification"), e.iceTransport.addRemoteCandidate({}))
                    })
                }, 4e3), 1 < arguments.length && "function" == typeof arguments[1] && R.setTimeout(arguments[1], 0), Promise.resolve()
            }, e.prototype.close = function () {
                this.transceivers.forEach(function (e) {
                    e.iceTransport && e.iceTransport.stop(), e.dtlsTransport && e.dtlsTransport.stop(), e.rtpSender && e.rtpSender.stop(), e.rtpReceiver && e.rtpReceiver.stop()
                }), this._updateSignalingState("closed")
            }, e.prototype._updateSignalingState = function (e) {
                this.signalingState = e;
                var t = new Event("signalingstatechange");
                this.dispatchEvent(t), null !== this.onsignalingstatechange && this.onsignalingstatechange(t)
            }, e.prototype._maybeFireNegotiationNeeded = function () {
                var t = this;
                "stable" === this.signalingState && !0 !== this.needNegotiation && (this.needNegotiation = !0, R.setTimeout(function () {
                    if (!1 !== t.needNegotiation) {
                        t.needNegotiation = !1;
                        var e = new Event("negotiationneeded");
                        t.dispatchEvent(e), null !== t.onnegotiationneeded && t.onnegotiationneeded(e)
                    }
                }, 0))
            }, e.prototype._updateConnectionState = function () {
                var e, t = {new: 0, closed: 0, connecting: 0, checking: 0, connected: 0, completed: 0, disconnected: 0, failed: 0};
                if (this.transceivers.forEach(function (e) {
                    t[e.iceTransport.state]++, t[e.dtlsTransport.state]++
                }), t.connected += t.completed, e = "new", 0 < t.failed ? e = "failed" : 0 < t.connecting || 0 < t.checking ? e = "connecting" : 0 < t.disconnected ? e = "disconnected" : 0 < t.new ? e = "new" : (0 < t.connected || 0 < t.completed) && (e = "connected"), e !== this.iceConnectionState) {
                    this.iceConnectionState = e;
                    var n = new Event("iceconnectionstatechange");
                    this.dispatchEvent(n), null !== this.oniceconnectionstatechange && this.oniceconnectionstatechange(n)
                }
            }, e.prototype.createOffer = function () {
                var e, s = this;
                if (this._pendingOffer) throw new Error("createOffer called while there is a pending offer.");
                1 === arguments.length && "function" != typeof arguments[0] ? e = arguments[0] : 3 === arguments.length && (e = arguments[2]);
                var t = this.transceivers.filter(function (e) {
                    return "audio" === e.kind
                }).length, n = this.transceivers.filter(function (e) {
                    return "video" === e.kind
                }).length;
                if (e) {
                    if (e.mandatory || e.optional) throw new TypeError("Legacy mandatory/optional constraints not supported.");
                    void 0 !== e.offerToReceiveAudio && (t = !0 === e.offerToReceiveAudio ? 1 : !1 === e.offerToReceiveAudio ? 0 : e.offerToReceiveAudio), void 0 !== e.offerToReceiveVideo && (n = !0 === e.offerToReceiveVideo ? 1 : !1 === e.offerToReceiveVideo ? 0 : e.offerToReceiveVideo)
                }
                for (this.transceivers.forEach(function (e) {
                    "audio" === e.kind ? --t < 0 && (e.wantReceive = !1) : "video" === e.kind && --n < 0 && (e.wantReceive = !1)
                }); 0 < t || 0 < n;) 0 < t && (this._createTransceiver("audio"), t--), 0 < n && (this._createTransceiver("video"), n--);
                var c = function (e) {
                    var t = e.filter(function (e) {
                        return "audio" === e.kind
                    }), n = e.filter(function (e) {
                        return "video" === e.kind
                    });
                    for (e = []; t.length || n.length;) t.length && e.push(t.shift()), n.length && e.push(n.shift());
                    return e
                }(this.transceivers), r = P.writeSessionBoilerplate(this._sdpSessionId);
                c.forEach(function (e, t) {
                    var n = e.track, r = e.kind, i = P.generateIdentifier();
                    e.mid = i, e.iceGatherer || (e.iceGatherer = s.usingBundle && 0 < t ? c[0].iceGatherer : s._createIceGatherer(i, t));
                    var o = R.RTCRtpSender.getCapabilities(r);
                    A < 15019 && (o.codecs = o.codecs.filter(function (e) {
                        return "rtx" !== e.name
                    })), o.codecs.forEach(function (e) {
                        "H264" === e.name && void 0 === e.parameters["level-asymmetry-allowed"] && (e.parameters["level-asymmetry-allowed"] = "1")
                    });
                    var a = [{ssrc: 1001 * (2 * t + 1)}];
                    n && 15019 <= A && "video" === r && (a[0].rtx = {ssrc: 1001 * (2 * t + 1) + 1}), e.wantReceive && (e.rtpReceiver = new R.RTCRtpReceiver(e.dtlsTransport, r)), e.localCapabilities = o, e.sendEncodingParameters = a
                }), "max-compat" !== this._config.bundlePolicy && (r += "a=group:BUNDLE " + c.map(function (e) {
                    return e.mid
                }).join(" ") + "\r\n"), r += "a=ice-options:trickle\r\n", c.forEach(function (e, t) {
                    r += P.writeMediaSection(e, e.localCapabilities, "offer", e.stream), r += "a=rtcp-rsize\r\n"
                }), this._pendingOffer = c;
                var i = new R.RTCSessionDescription({type: "offer", sdp: r});
                return arguments.length && "function" == typeof arguments[0] && R.setTimeout(arguments[0], 0, i), Promise.resolve(i)
            }, e.prototype.createAnswer = function () {
                var i = P.writeSessionBoilerplate(this._sdpSessionId);
                this.usingBundle && (i += "a=group:BUNDLE " + this.transceivers.map(function (e) {
                    return e.mid
                }).join(" ") + "\r\n"), this.transceivers.forEach(function (e, t) {
                    if (e.isDatachannel) i += "m=application 0 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=mid:" + e.mid + "\r\n"; else {
                        var n;
                        if (e.stream) "audio" === e.kind ? n = e.stream.getAudioTracks()[0] : "video" === e.kind && (n = e.stream.getVideoTracks()[0]), n && 15019 <= A && "video" === e.kind && (e.sendEncodingParameters[0].rtx = {ssrc: 1001 * (2 * t + 2) + 1});
                        var r = m(e.localCapabilities, e.remoteCapabilities);
                        !r.codecs.filter(function (e) {
                            return "rtx" === e.name.toLowerCase()
                        }).length && e.sendEncodingParameters[0].rtx && delete e.sendEncodingParameters[0].rtx, i += P.writeMediaSection(e, r, "answer", e.stream), e.rtcpParameters && e.rtcpParameters.reducedSize && (i += "a=rtcp-rsize\r\n")
                    }
                });
                var e = new R.RTCSessionDescription({type: "answer", sdp: i});
                return arguments.length && "function" == typeof arguments[0] && R.setTimeout(arguments[0], 0, e), Promise.resolve(e)
            }, e.prototype.addIceCandidate = function (e) {
                if (e) {
                    var t = e.sdpMLineIndex;
                    if (e.sdpMid) for (var n = 0; n < this.transceivers.length; n++) if (this.transceivers[n].mid === e.sdpMid) {
                        t = n;
                        break
                    }
                    var r = this.transceivers[t];
                    if (r) {
                        var i = 0 < Object.keys(e.candidate).length ? P.parseCandidate(e.candidate) : {};
                        if ("tcp" === i.protocol && (0 === i.port || 9 === i.port)) return Promise.resolve();
                        if (i.component && "1" !== i.component && 1 !== i.component) return Promise.resolve();
                        r.iceTransport.addRemoteCandidate(i);
                        var o = P.splitSections(this.remoteDescription.sdp);
                        o[t + 1] += (i.type ? e.candidate.trim() : "a=end-of-candidates") + "\r\n", this.remoteDescription.sdp = o.join("")
                    }
                } else for (var a = 0; a < this.transceivers.length; a++) if (this.transceivers[a].iceTransport.addRemoteCandidate({}), this.usingBundle) return Promise.resolve();
                return 1 < arguments.length && "function" == typeof arguments[1] && R.setTimeout(arguments[1], 0), Promise.resolve()
            }, e.prototype.getStats = function () {
                var r = [];
                this.transceivers.forEach(function (t) {
                    ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function (e) {
                        t[e] && r.push(t[e].getStats())
                    })
                });
                var i = 1 < arguments.length && "function" == typeof arguments[1] && arguments[1];
                return new Promise(function (t) {
                    var n = new Map;
                    Promise.all(r).then(function (e) {
                        e.forEach(function (t) {
                            Object.keys(t).forEach(function (e) {
                                t[e].type = function (e) {
                                    return {
                                        inboundrtp: "inbound-rtp",
                                        outboundrtp: "outbound-rtp",
                                        candidatepair: "candidate-pair",
                                        localcandidate: "local-candidate",
                                        remotecandidate: "remote-candidate"
                                    }[e.type] || e.type
                                }(t[e]), n.set(e, t[e])
                            })
                        }), i && R.setTimeout(i, 0, n), t(n)
                    })
                })
            }, e
        }
    }, {sdp: 1}],
    9: [function (e, t, n) {
        "use strict";
        var o = e("../utils"), r = {
            shimOnTrack: function (e) {
                "object" != typeof e || !e.RTCPeerConnection || "ontrack" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
                    get: function () {
                        return this._ontrack
                    }, set: function (e) {
                        this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly)), this.addEventListener("track", this._ontrack = e), this.addEventListener("addstream", this._ontrackpoly = function (n) {
                            n.stream.getTracks().forEach(function (e) {
                                var t = new Event("track");
                                t.track = e, t.receiver = {track: e}, t.streams = [n.stream], this.dispatchEvent(t)
                            }.bind(this))
                        }.bind(this))
                    }
                })
            }, shimSourceObject: function (e) {
                "object" == typeof e && (!e.HTMLMediaElement || "srcObject" in e.HTMLMediaElement.prototype || Object.defineProperty(e.HTMLMediaElement.prototype, "srcObject", {
                    get: function () {
                        return this.mozSrcObject
                    }, set: function (e) {
                        this.mozSrcObject = e
                    }
                }))
            }, shimPeerConnection: function (s) {
                var c = o.detectBrowser(s);
                if ("object" == typeof s && (s.RTCPeerConnection || s.mozRTCPeerConnection)) {
                    s.RTCPeerConnection || (s.RTCPeerConnection = function (e, t) {
                        if (c.version < 38 && e && e.iceServers) {
                            for (var n = [], r = 0; r < e.iceServers.length; r++) {
                                var i = e.iceServers[r];
                                if (i.hasOwnProperty("urls")) for (var o = 0; o < i.urls.length; o++) {
                                    var a = {url: i.urls[o]};
                                    0 === i.urls[o].indexOf("turn") && (a.username = i.username, a.credential = i.credential), n.push(a)
                                } else n.push(e.iceServers[r])
                            }
                            e.iceServers = n
                        }
                        return new s.mozRTCPeerConnection(e, t)
                    }, s.RTCPeerConnection.prototype = s.mozRTCPeerConnection.prototype, s.mozRTCPeerConnection.generateCertificate && Object.defineProperty(s.RTCPeerConnection, "generateCertificate", {
                        get: function () {
                            return s.mozRTCPeerConnection.generateCertificate
                        }
                    }), s.RTCSessionDescription = s.mozRTCSessionDescription, s.RTCIceCandidate = s.mozRTCIceCandidate), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                        var t = s.RTCPeerConnection.prototype[e];
                        s.RTCPeerConnection.prototype[e] = function () {
                            return arguments[0] = new ("addIceCandidate" === e ? s.RTCIceCandidate : s.RTCSessionDescription)(arguments[0]), t.apply(this, arguments)
                        }
                    });
                    var e = s.RTCPeerConnection.prototype.addIceCandidate;
                    s.RTCPeerConnection.prototype.addIceCandidate = function () {
                        return arguments[0] ? e.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                    };
                    var r = {
                        inboundrtp: "inbound-rtp",
                        outboundrtp: "outbound-rtp",
                        candidatepair: "candidate-pair",
                        localcandidate: "local-candidate",
                        remotecandidate: "remote-candidate"
                    }, i = s.RTCPeerConnection.prototype.getStats;
                    s.RTCPeerConnection.prototype.getStats = function (e, t, n) {
                        return i.apply(this, [e || null]).then(function (n) {
                            if (c.version < 48 && (n = function (t) {
                                var n = new Map;
                                return Object.keys(t).forEach(function (e) {
                                    n.set(e, t[e]), n[e] = t[e]
                                }), n
                            }(n)), c.version < 53 && !t) try {
                                n.forEach(function (e) {
                                    e.type = r[e.type] || e.type
                                })
                            } catch (e) {
                                if ("TypeError" !== e.name) throw e;
                                n.forEach(function (e, t) {
                                    n.set(t, Object.assign({}, e, {type: r[e.type] || e.type}))
                                })
                            }
                            return n
                        }).then(t, n)
                    }
                }
            }
        };
        t.exports = {
            shimOnTrack: r.shimOnTrack,
            shimSourceObject: r.shimSourceObject,
            shimPeerConnection: r.shimPeerConnection,
            shimGetUserMedia: e("./getusermedia")
        }
    }, {"../utils": 12, "./getusermedia": 10}],
    10: [function (e, t, n) {
        "use strict";
        var p = e("../utils"), f = p.log;
        t.exports = function (e) {
            var i = p.detectBrowser(e), o = e && e.navigator, t = e && e.MediaStreamTrack, a = function (e) {
                return {
                    name: {
                        InternalError: "NotReadableError",
                        NotSupportedError: "TypeError",
                        PermissionDeniedError: "NotAllowedError",
                        SecurityError: "NotAllowedError"
                    }[e.name] || e.name,
                    message: {"The operation is insecure.": "The request is not allowed by the user agent or the platform in the current context."}[e.message] || e.message,
                    constraint: e.constraint,
                    toString: function () {
                        return this.name + (this.message && ": ") + this.message
                    }
                }
            }, r = function (e, t, n) {
                var r = function (r) {
                    if ("object" != typeof r || r.require) return r;
                    var i = [];
                    return Object.keys(r).forEach(function (e) {
                        if ("require" !== e && "advanced" !== e && "mediaSource" !== e) {
                            var t = r[e] = "object" == typeof r[e] ? r[e] : {ideal: r[e]};
                            if (void 0 === t.min && void 0 === t.max && void 0 === t.exact || i.push(e), void 0 !== t.exact && ("number" == typeof t.exact ? t.min = t.max = t.exact : r[e] = t.exact, delete t.exact), void 0 !== t.ideal) {
                                r.advanced = r.advanced || [];
                                var n = {};
                                "number" == typeof t.ideal ? n[e] = {
                                    min: t.ideal,
                                    max: t.ideal
                                } : n[e] = t.ideal, r.advanced.push(n), delete t.ideal, Object.keys(t).length || delete r[e]
                            }
                        }
                    }), i.length && (r.require = i), r
                };
                return e = JSON.parse(JSON.stringify(e)), i.version < 38 && (f("spec: " + JSON.stringify(e)), e.audio && (e.audio = r(e.audio)), e.video && (e.video = r(e.video)), f("ff37: " + JSON.stringify(e))), o.mozGetUserMedia(e, t, function (e) {
                    n(a(e))
                })
            };
            if (o.mediaDevices || (o.mediaDevices = {
                getUserMedia: function (n) {
                    return new Promise(function (e, t) {
                        r(n, e, t)
                    })
                }, addEventListener: function () {
                }, removeEventListener: function () {
                }
            }), o.mediaDevices.enumerateDevices = o.mediaDevices.enumerateDevices || function () {
                return new Promise(function (e) {
                    e([{kind: "audioinput", deviceId: "default", label: "", groupId: ""}, {
                        kind: "videoinput",
                        deviceId: "default",
                        label: "",
                        groupId: ""
                    }])
                })
            }, i.version < 41) {
                var n = o.mediaDevices.enumerateDevices.bind(o.mediaDevices);
                o.mediaDevices.enumerateDevices = function () {
                    return n().then(void 0, function (e) {
                        if ("NotFoundError" === e.name) return [];
                        throw e
                    })
                }
            }
            if (i.version < 49) {
                var s = o.mediaDevices.getUserMedia.bind(o.mediaDevices);
                o.mediaDevices.getUserMedia = function (t) {
                    return s(t).then(function (e) {
                        if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(function (e) {
                            e.stop()
                        }), new DOMException("The object can not be found here.", "NotFoundError");
                        return e
                    }, function (e) {
                        return Promise.reject(a(e))
                    })
                }
            }
            if (!(55 < i.version && "autoGainControl" in o.mediaDevices.getSupportedConstraints())) {
                var c = function (e, t, n) {
                    t in e && !(n in e) && (e[n] = e[t], delete e[t])
                }, d = o.mediaDevices.getUserMedia.bind(o.mediaDevices);
                if (o.mediaDevices.getUserMedia = function (e) {
                    return "object" == typeof e && "object" == typeof e.audio && (e = JSON.parse(JSON.stringify(e)), c(e.audio, "autoGainControl", "mozAutoGainControl"), c(e.audio, "noiseSuppression", "mozNoiseSuppression")), d(e)
                }, t && t.prototype.getSettings) {
                    var u = t.prototype.getSettings;
                    t.prototype.getSettings = function () {
                        var e = u.apply(this, arguments);
                        return c(e, "mozAutoGainControl", "autoGainControl"), c(e, "mozNoiseSuppression", "noiseSuppression"), e
                    }
                }
                if (t && t.prototype.applyConstraints) {
                    var l = t.prototype.applyConstraints;
                    t.prototype.applyConstraints = function (e) {
                        return "audio" === this.kind && "object" == typeof e && (e = JSON.parse(JSON.stringify(e)), c(e, "autoGainControl", "mozAutoGainControl"), c(e, "noiseSuppression", "mozNoiseSuppression")), l.apply(this, [e])
                    }
                }
            }
            o.getUserMedia = function (e, t, n) {
                if (i.version < 44) return r(e, t, n);
                console.warn("navigator.getUserMedia has been replaced by navigator.mediaDevices.getUserMedia"), o.mediaDevices.getUserMedia(e).then(t, n)
            }
        }
    }, {"../utils": 12}],
    11: [function (e, t, n) {
        "use strict";
        var a = e("../utils"), r = {
            shimLocalStreamsAPI: function (e) {
                if ("object" == typeof e && e.RTCPeerConnection) {
                    if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function () {
                        return this._localStreams || (this._localStreams = []), this._localStreams
                    }), "getStreamById" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getStreamById = function (t) {
                        var n = null;
                        return this._localStreams && this._localStreams.forEach(function (e) {
                            e.id === t && (n = e)
                        }), this._remoteStreams && this._remoteStreams.forEach(function (e) {
                            e.id === t && (n = e)
                        }), n
                    }), !("addStream" in e.RTCPeerConnection.prototype)) {
                        var r = e.RTCPeerConnection.prototype.addTrack;
                        e.RTCPeerConnection.prototype.addStream = function (t) {
                            this._localStreams || (this._localStreams = []), -1 === this._localStreams.indexOf(t) && this._localStreams.push(t);
                            var n = this;
                            t.getTracks().forEach(function (e) {
                                r.call(n, e, t)
                            })
                        }, e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                            t && (this._localStreams ? -1 === this._localStreams.indexOf(t) && this._localStreams.push(t) : this._localStreams = [t]), r.call(this, e, t)
                        }
                    }
                    "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (e) {
                        this._localStreams || (this._localStreams = []);
                        var t = this._localStreams.indexOf(e);
                        if (-1 !== t) {
                            this._localStreams.splice(t, 1);
                            var n = this, r = e.getTracks();
                            this.getSenders().forEach(function (e) {
                                -1 !== r.indexOf(e.track) && n.removeTrack(e)
                            })
                        }
                    })
                }
            }, shimRemoteStreamsAPI: function (e) {
                "object" == typeof e && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function () {
                    return this._remoteStreams ? this._remoteStreams : []
                }), "onaddstream" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
                    get: function () {
                        return this._onaddstream
                    }, set: function (e) {
                        this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e), this.addEventListener("track", this._onaddstreampoly = function (e) {
                            var t = e.streams[0];
                            if (this._remoteStreams || (this._remoteStreams = []), !(0 <= this._remoteStreams.indexOf(t))) {
                                this._remoteStreams.push(t);
                                var n = new Event("addstream");
                                n.stream = e.streams[0], this.dispatchEvent(n)
                            }
                        }.bind(this))
                    }
                }))
            }, shimCallbacksAPI: function (e) {
                if ("object" == typeof e && e.RTCPeerConnection) {
                    var t = e.RTCPeerConnection.prototype, i = t.createOffer, o = t.createAnswer, a = t.setLocalDescription,
                        s = t.setRemoteDescription, c = t.addIceCandidate;
                    t.createOffer = function (e, t) {
                        var n = 2 <= arguments.length ? arguments[2] : e, r = i.apply(this, [n]);
                        return t ? (r.then(e, t), Promise.resolve()) : r
                    }, t.createAnswer = function (e, t) {
                        var n = 2 <= arguments.length ? arguments[2] : e, r = o.apply(this, [n]);
                        return t ? (r.then(e, t), Promise.resolve()) : r
                    };
                    var n = function (e, t, n) {
                        var r = a.apply(this, [e]);
                        return n ? (r.then(t, n), Promise.resolve()) : r
                    };
                    t.setLocalDescription = n, n = function (e, t, n) {
                        var r = s.apply(this, [e]);
                        return n ? (r.then(t, n), Promise.resolve()) : r
                    }, t.setRemoteDescription = n, n = function (e, t, n) {
                        var r = c.apply(this, [e]);
                        return n ? (r.then(t, n), Promise.resolve()) : r
                    }, t.addIceCandidate = n
                }
            }, shimGetUserMedia: function (e) {
                var r = e && e.navigator;
                r.getUserMedia || (r.webkitGetUserMedia ? r.getUserMedia = r.webkitGetUserMedia.bind(r) : r.mediaDevices && r.mediaDevices.getUserMedia && (r.getUserMedia = function (e, t, n) {
                    r.mediaDevices.getUserMedia(e).then(t, n)
                }.bind(r)))
            }, shimRTCIceServerUrls: function (e) {
                var o = e.RTCPeerConnection;
                e.RTCPeerConnection = function (e, t) {
                    if (e && e.iceServers) {
                        for (var n = [], r = 0; r < e.iceServers.length; r++) {
                            var i = e.iceServers[r];
                            !i.hasOwnProperty("urls") && i.hasOwnProperty("url") ? (a.deprecated("RTCIceServer.url", "RTCIceServer.urls"), (i = JSON.parse(JSON.stringify(i))).urls = i.url, delete i.url, n.push(i)) : n.push(e.iceServers[r])
                        }
                        e.iceServers = n
                    }
                    return new o(e, t)
                }, e.RTCPeerConnection.prototype = o.prototype, Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
                    get: function () {
                        return o.generateCertificate
                    }
                })
            }
        };
        t.exports = {
            shimCallbacksAPI: r.shimCallbacksAPI,
            shimLocalStreamsAPI: r.shimLocalStreamsAPI,
            shimRemoteStreamsAPI: r.shimRemoteStreamsAPI,
            shimGetUserMedia: r.shimGetUserMedia,
            shimRTCIceServerUrls: r.shimRTCIceServerUrls
        }
    }, {"../utils": 12}],
    12: [function (e, t, n) {
        "use strict";
        var r = !0, i = !0, c = {
            disableLog: function (e) {
                return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (r = e) ? "adapter.js logging disabled" : "adapter.js logging enabled"
            }, disableWarnings: function (e) {
                return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (i = !e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"))
            }, log: function () {
                if ("object" == typeof window) {
                    if (r) return;
                    "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments)
                }
            }, deprecated: function (e, t) {
                i && console.warn(e + " is deprecated, please use " + t + " instead.")
            }, extractVersion: function (e, t, n) {
                var r = e.match(t);
                return r && r.length >= n && parseInt(r[n], 10)
            }, detectBrowser: function (e) {
                var t = e && e.navigator, n = {browser: null, version: null};
                if (void 0 === e || !e.navigator) return n.browser = "Not a browser.", n;
                if (t.mozGetUserMedia) n.browser = "firefox", n.version = this.extractVersion(t.userAgent, /Firefox\/(\d+)\./, 1); else if (t.webkitGetUserMedia) if (e.webkitRTCPeerConnection) n.browser = "chrome", n.version = this.extractVersion(t.userAgent, /Chrom(e|ium)\/(\d+)\./, 2); else {
                    if (!t.userAgent.match(/Version\/(\d+).(\d+)/)) return n.browser = "Unsupported webkit-based browser with GUM support but no WebRTC support.", n;
                    n.browser = "safari", n.version = this.extractVersion(t.userAgent, /AppleWebKit\/(\d+)\./, 1)
                } else if (t.mediaDevices && t.userAgent.match(/Edge\/(\d+).(\d+)$/)) n.browser = "edge", n.version = this.extractVersion(t.userAgent, /Edge\/(\d+).(\d+)$/, 2); else {
                    if (!t.mediaDevices || !t.userAgent.match(/AppleWebKit\/(\d+)\./)) return n.browser = "Not a supported browser.", n;
                    n.browser = "safari", n.version = this.extractVersion(t.userAgent, /AppleWebKit\/(\d+)\./, 1)
                }
                return n
            }, shimCreateObjectURL: function (e) {
                var t = e && e.URL;
                if ("object" == typeof e && e.HTMLMediaElement && "srcObject" in e.HTMLMediaElement.prototype) {
                    var n = t.createObjectURL.bind(t), r = t.revokeObjectURL.bind(t), i = new Map, o = 0;
                    t.createObjectURL = function (e) {
                        if ("getTracks" in e) {
                            var t = "polyblob:" + ++o;
                            return i.set(t, e), c.deprecated("URL.createObjectURL(stream)", "elem.srcObject = stream"), t
                        }
                        return n(e)
                    }, t.revokeObjectURL = function (e) {
                        r(e), i.delete(e)
                    };
                    var a = Object.getOwnPropertyDescriptor(e.HTMLMediaElement.prototype, "src");
                    Object.defineProperty(e.HTMLMediaElement.prototype, "src", {
                        get: function () {
                            return a.get.apply(this)
                        }, set: function (e) {
                            return this.srcObject = i.get(e) || null, a.set.apply(this, [e])
                        }
                    });
                    var s = e.HTMLMediaElement.prototype.setAttribute;
                    e.HTMLMediaElement.prototype.setAttribute = function () {
                        return 2 === arguments.length && "src" === ("" + arguments[0]).toLowerCase() && (this.srcObject = i.get(arguments[1]) || null), s.apply(this, arguments)
                    }
                }
            }
        };
        t.exports = {
            log: c.log,
            deprecated: c.deprecated,
            disableLog: c.disableLog,
            disableWarnings: c.disableWarnings,
            extractVersion: c.extractVersion,
            shimCreateObjectURL: c.shimCreateObjectURL,
            detectBrowser: c.detectBrowser.bind(c)
        }
    }, {}]
}, {}, [2]), function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).io = e()
    }
}(function () {
    return function o(a, s, c) {
        function d(n, e) {
            if (!s[n]) {
                if (!a[n]) {
                    var t = "function" == typeof require && require;
                    if (!e && t) return t(n, !0);
                    if (u) return u(n, !0);
                    var r = new Error("Cannot find module '" + n + "'");
                    throw r.code = "MODULE_NOT_FOUND", r
                }
                var i = s[n] = {exports: {}};
                a[n][0].call(i.exports, function (e) {
                    var t = a[n][1][e];
                    return d(t || e)
                }, i, i.exports, o, a, s, c)
            }
            return s[n].exports
        }

        for (var u = "function" == typeof require && require, e = 0; e < c.length; e++) d(c[e]);
        return d
    }({
        1: [function (e, t, n) {
            t.exports = e("./lib/")
        }, {"./lib/": 2}],
        2: [function (e, t, n) {
            t.exports = e("./socket"), t.exports.parser = e("engine.io-parser")
        }, {"./socket": 3, "engine.io-parser": 19}],
        3: [function (t, d, e) {
            (function (r) {
                var n = t("./transports"), e = t("component-emitter"), l = t("debug")("engine.io-client:socket"), i = t("indexof"),
                    o = t("engine.io-parser"), a = t("parseuri"), s = t("parsejson"), c = t("parseqs");

                function p(e, t) {
                    if (!(this instanceof p)) return new p(e, t);
                    t = t || {}, e && "object" == typeof e && (t = e, e = null), e ? (e = a(e), t.hostname = e.host, t.secure = "https" == e.protocol || "wss" == e.protocol, t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = a(t.host).host), this.secure = null != t.secure ? t.secure : r.location && "https:" == location.protocol, t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.agent = t.agent || !1, this.hostname = t.hostname || (r.location ? location.hostname : "localhost"), this.port = t.port || (r.location && location.port ? location.port : this.secure ? 443 : 80), this.query = t.query || {}, "string" == typeof this.query && (this.query = c.decode(this.query)), this.upgrade = !1 !== t.upgrade, this.path = (t.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!t.forceJSONP, this.jsonp = !1 !== t.jsonp, this.forceBase64 = !!t.forceBase64, this.enablesXDR = !!t.enablesXDR, this.timestampParam = t.timestampParam || "t", this.timestampRequests = t.timestampRequests, this.transports = t.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.policyPort = t.policyPort || 843, this.rememberUpgrade = t.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = t.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== t.perMessageDeflate && (t.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = t.pfx || null, this.key = t.key || null, this.passphrase = t.passphrase || null, this.cert = t.cert || null, this.ca = t.ca || null, this.ciphers = t.ciphers || null, this.rejectUnauthorized = void 0 === t.rejectUnauthorized ? null : t.rejectUnauthorized;
                    var n = "object" == typeof r && r;
                    n.global === n && t.extraHeaders && 0 < Object.keys(t.extraHeaders).length && (this.extraHeaders = t.extraHeaders), this.open()
                }

                (d.exports = p).priorWebsocketSuccess = !1, e(p.prototype), p.protocol = o.protocol, (p.Socket = p).Transport = t("./transport"), p.transports = t("./transports"), p.parser = t("engine.io-parser"), p.prototype.createTransport = function (e) {
                    l('creating transport "%s"', e);
                    var t = function (e) {
                        var t = {};
                        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        return t
                    }(this.query);
                    return t.EIO = o.protocol, t.transport = e, this.id && (t.sid = this.id), new n[e]({
                        agent: this.agent,
                        hostname: this.hostname,
                        port: this.port,
                        secure: this.secure,
                        path: this.path,
                        query: t,
                        forceJSONP: this.forceJSONP,
                        jsonp: this.jsonp,
                        forceBase64: this.forceBase64,
                        enablesXDR: this.enablesXDR,
                        timestampRequests: this.timestampRequests,
                        timestampParam: this.timestampParam,
                        policyPort: this.policyPort,
                        socket: this,
                        pfx: this.pfx,
                        key: this.key,
                        passphrase: this.passphrase,
                        cert: this.cert,
                        ca: this.ca,
                        ciphers: this.ciphers,
                        rejectUnauthorized: this.rejectUnauthorized,
                        perMessageDeflate: this.perMessageDeflate,
                        extraHeaders: this.extraHeaders
                    })
                }, p.prototype.open = function () {
                    var e;
                    if (this.rememberUpgrade && p.priorWebsocketSuccess && -1 != this.transports.indexOf("websocket")) e = "websocket"; else {
                        if (0 === this.transports.length) {
                            var t = this;
                            return void setTimeout(function () {
                                t.emit("error", "No transports available")
                            }, 0)
                        }
                        e = this.transports[0]
                    }
                    this.readyState = "opening";
                    try {
                        e = this.createTransport(e)
                    } catch (e) {
                        return this.transports.shift(), void this.open()
                    }
                    e.open(), this.setTransport(e)
                }, p.prototype.setTransport = function (e) {
                    l("setting transport %s", e.name);
                    var t = this;
                    this.transport && (l("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), (this.transport = e).on("drain", function () {
                        t.onDrain()
                    }).on("packet", function (e) {
                        t.onPacket(e)
                    }).on("error", function (e) {
                        t.onError(e)
                    }).on("close", function () {
                        t.onClose("transport close")
                    })
                }, p.prototype.probe = function (n) {
                    l('probing transport "%s"', n);
                    var r = this.createTransport(n, {probe: 1}), i = !1, o = this;

                    function e() {
                        if (o.onlyBinaryUpgrades) {
                            var e = !this.supportsBinary && o.transport.supportsBinary;
                            i = i || e
                        }
                        i || (l('probe transport "%s" opened', n), r.send([{type: "ping", data: "probe"}]), r.once("packet", function (e) {
                            if (!i) if ("pong" == e.type && "probe" == e.data) {
                                if (l('probe transport "%s" pong', n), o.upgrading = !0, o.emit("upgrading", r), !r) return;
                                p.priorWebsocketSuccess = "websocket" == r.name, l('pausing current transport "%s"', o.transport.name), o.transport.pause(function () {
                                    i || "closed" != o.readyState && (l("changing transport and sending upgrade packet"), u(), o.setTransport(r), r.send([{type: "upgrade"}]), o.emit("upgrade", r), r = null, o.upgrading = !1, o.flush())
                                })
                            } else {
                                l('probe transport "%s" failed', n);
                                var t = new Error("probe error");
                                t.transport = r.name, o.emit("upgradeError", t)
                            }
                        }))
                    }

                    function a() {
                        i || (i = !0, u(), r.close(), r = null)
                    }

                    function t(e) {
                        var t = new Error("probe error: " + e);
                        t.transport = r.name, a(), l('probe transport "%s" failed because of error: %s', n, e), o.emit("upgradeError", t)
                    }

                    function s() {
                        t("transport closed")
                    }

                    function c() {
                        t("socket closed")
                    }

                    function d(e) {
                        r && e.name != r.name && (l('"%s" works - aborting "%s"', e.name, r.name), a())
                    }

                    function u() {
                        r.removeListener("open", e), r.removeListener("error", t), r.removeListener("close", s), o.removeListener("close", c), o.removeListener("upgrading", d)
                    }

                    p.priorWebsocketSuccess = !1, r.once("open", e), r.once("error", t), r.once("close", s), this.once("close", c), this.once("upgrading", d), r.open()
                }, p.prototype.onOpen = function () {
                    if (l("socket open"), this.readyState = "open", p.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush(), "open" == this.readyState && this.upgrade && this.transport.pause) {
                        l("starting upgrade probes");
                        for (var e = 0, t = this.upgrades.length; e < t; e++) this.probe(this.upgrades[e])
                    }
                }, p.prototype.onPacket = function (e) {
                    if ("opening" == this.readyState || "open" == this.readyState) switch (l('socket receive: type "%s", data "%s"', e.type, e.data), this.emit("packet", e), this.emit("heartbeat"), e.type) {
                        case"open":
                            this.onHandshake(s(e.data));
                            break;
                        case"pong":
                            this.setPing(), this.emit("pong");
                            break;
                        case"error":
                            var t = new Error("server error");
                            t.code = e.data, this.onError(t);
                            break;
                        case"message":
                            this.emit("data", e.data), this.emit("message", e.data)
                    } else l('packet received with socket readyState "%s"', this.readyState)
                }, p.prototype.onHandshake = function (e) {
                    this.emit("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.onOpen(), "closed" != this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                }, p.prototype.onHeartbeat = function (e) {
                    clearTimeout(this.pingTimeoutTimer);
                    var t = this;
                    t.pingTimeoutTimer = setTimeout(function () {
                        "closed" != t.readyState && t.onClose("ping timeout")
                    }, e || t.pingInterval + t.pingTimeout)
                }, p.prototype.setPing = function () {
                    var e = this;
                    clearTimeout(e.pingIntervalTimer), e.pingIntervalTimer = setTimeout(function () {
                        l("writing ping packet - expecting pong within %sms", e.pingTimeout), e.ping(), e.onHeartbeat(e.pingTimeout)
                    }, e.pingInterval)
                }, p.prototype.ping = function () {
                    var e = this;
                    this.sendPacket("ping", function () {
                        e.emit("ping")
                    })
                }, p.prototype.onDrain = function () {
                    this.writeBuffer.splice(0, this.prevBufferLen), (this.prevBufferLen = 0) === this.writeBuffer.length ? this.emit("drain") : this.flush()
                }, p.prototype.flush = function () {
                    "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (l("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                }, p.prototype.write = p.prototype.send = function (e, t, n) {
                    return this.sendPacket("message", e, t, n), this
                }, p.prototype.sendPacket = function (e, t, n, r) {
                    if ("function" == typeof t && (r = t, t = void 0), "function" == typeof n && (r = n, n = null), "closing" != this.readyState && "closed" != this.readyState) {
                        (n = n || {}).compress = !1 !== n.compress;
                        var i = {type: e, data: t, options: n};
                        this.emit("packetCreate", i), this.writeBuffer.push(i), r && this.once("flush", r), this.flush()
                    }
                }, p.prototype.close = function () {
                    if ("opening" == this.readyState || "open" == this.readyState) {
                        this.readyState = "closing";
                        var e = this;
                        this.writeBuffer.length ? this.once("drain", function () {
                            this.upgrading ? r() : t()
                        }) : this.upgrading ? r() : t()
                    }

                    function t() {
                        e.onClose("forced close"), l("socket closing - telling transport to close"), e.transport.close()
                    }

                    function n() {
                        e.removeListener("upgrade", n), e.removeListener("upgradeError", n), t()
                    }

                    function r() {
                        e.once("upgrade", n), e.once("upgradeError", n)
                    }

                    return this
                }, p.prototype.onError = function (e) {
                    l("socket error %j", e), p.priorWebsocketSuccess = !1, this.emit("error", e), this.onClose("transport error", e)
                }, p.prototype.onClose = function (e, t) {
                    if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
                        l('socket close with reason: "%s"', e);
                        clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", e, t), this.writeBuffer = [], this.prevBufferLen = 0
                    }
                }, p.prototype.filterUpgrades = function (e) {
                    for (var t = [], n = 0, r = e.length; n < r; n++) ~i(this.transports, e[n]) && t.push(e[n]);
                    return t
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./transport": 4,
            "./transports": 5,
            "component-emitter": 15,
            debug: 17,
            "engine.io-parser": 19,
            indexof: 23,
            parsejson: 26,
            parseqs: 27,
            parseuri: 28
        }],
        4: [function (e, t, n) {
            var r = e("engine.io-parser");

            function i(e) {
                this.path = e.path, this.hostname = e.hostname, this.port = e.port, this.secure = e.secure, this.query = e.query, this.timestampParam = e.timestampParam, this.timestampRequests = e.timestampRequests, this.readyState = "", this.agent = e.agent || !1, this.socket = e.socket, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.extraHeaders = e.extraHeaders
            }

            e("component-emitter")((t.exports = i).prototype), i.prototype.onError = function (e, t) {
                var n = new Error(e);
                return n.type = "TransportError", n.description = t, this.emit("error", n), this
            }, i.prototype.open = function () {
                return "closed" != this.readyState && "" != this.readyState || (this.readyState = "opening", this.doOpen()), this
            }, i.prototype.close = function () {
                return "opening" != this.readyState && "open" != this.readyState || (this.doClose(), this.onClose()), this
            }, i.prototype.send = function (e) {
                if ("open" != this.readyState) throw new Error("Transport not open");
                this.write(e)
            }, i.prototype.onOpen = function () {
                this.readyState = "open", this.writable = !0, this.emit("open")
            }, i.prototype.onData = function (e) {
                var t = r.decodePacket(e, this.socket.binaryType);
                this.onPacket(t)
            }, i.prototype.onPacket = function (e) {
                this.emit("packet", e)
            }, i.prototype.onClose = function () {
                this.readyState = "closed", this.emit("close")
            }
        }, {"component-emitter": 15, "engine.io-parser": 19}],
        5: [function (t, e, n) {
            (function (a) {
                var s = t("xmlhttprequest-ssl"), c = t("./polling-xhr"), d = t("./polling-jsonp"), e = t("./websocket");
                n.polling = function (e) {
                    var t = !1, n = !1, r = !1 !== e.jsonp;
                    if (a.location) {
                        var i = "https:" == location.protocol, o = location.port;
                        o || (o = i ? 443 : 80), t = e.hostname != location.hostname || o != e.port, n = e.secure != i
                    }
                    {
                        if (e.xdomain = t, e.xscheme = n, "open" in new s(e) && !e.forceJSONP) return new c(e);
                        if (!r) throw new Error("JSONP disabled");
                        return new d(e)
                    }
                }, n.websocket = e
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {"./polling-jsonp": 6, "./polling-xhr": 7, "./websocket": 9, "xmlhttprequest-ssl": 10}],
        6: [function (a, s, e) {
            (function (n) {
                var r = a("./polling"), e = a("component-inherit");
                s.exports = t;
                var i, d = /\n/g, u = /\\n/g;

                function o() {
                }

                function t(e) {
                    r.call(this, e), this.query = this.query || {}, i || (n.___eio || (n.___eio = []), i = n.___eio), this.index = i.length;
                    var t = this;
                    i.push(function (e) {
                        t.onData(e)
                    }), this.query.j = this.index, n.document && n.addEventListener && n.addEventListener("beforeunload", function () {
                        t.script && (t.script.onerror = o)
                    }, !1)
                }

                e(t, r), t.prototype.supportsBinary = !1, t.prototype.doClose = function () {
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), r.prototype.doClose.call(this)
                }, t.prototype.doPoll = function () {
                    var t = this, e = document.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
                        t.onError("jsonp poll error", e)
                    };
                    var n = document.getElementsByTagName("script")[0];
                    n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e), this.script = e, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function () {
                        var e = document.createElement("iframe");
                        document.body.appendChild(e), document.body.removeChild(e)
                    }, 100)
                }, t.prototype.doWrite = function (e, t) {
                    var n = this;
                    if (!this.form) {
                        var r, i = document.createElement("form"), o = document.createElement("textarea"),
                            a = this.iframeId = "eio_iframe_" + this.index;
                        i.className = "socketio", i.style.position = "absolute", i.style.top = "-1000px", i.style.left = "-1000px", i.target = a, i.method = "POST", i.setAttribute("accept-charset", "utf-8"), o.name = "d", i.appendChild(o), document.body.appendChild(i), this.form = i, this.area = o
                    }

                    function s() {
                        c(), t()
                    }

                    function c() {
                        if (n.iframe) try {
                            n.form.removeChild(n.iframe)
                        } catch (e) {
                            n.onError("jsonp polling iframe removal error", e)
                        }
                        try {
                            var e = '<iframe src="javascript:0" name="' + n.iframeId + '">';
                            r = document.createElement(e)
                        } catch (e) {
                            (r = document.createElement("iframe")).name = n.iframeId, r.src = "javascript:0"
                        }
                        r.id = n.iframeId, n.form.appendChild(r), n.iframe = r
                    }

                    this.form.action = this.uri(), c(), e = e.replace(u, "\\\n"), this.area.value = e.replace(d, "\\n");
                    try {
                        this.form.submit()
                    } catch (e) {
                    }
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
                        "complete" == n.iframe.readyState && s()
                    } : this.iframe.onload = s
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {"./polling": 8, "component-inherit": 16}],
        7: [function (u, l, e) {
            (function (i) {
                var o = u("xmlhttprequest-ssl"), r = u("./polling"), e = u("component-emitter"), t = u("component-inherit"),
                    a = u("debug")("engine.io-client:polling-xhr");

                function n() {
                }

                function s(e) {
                    if (r.call(this, e), i.location) {
                        var t = "https:" == location.protocol, n = location.port;
                        n || (n = t ? 443 : 80), this.xd = e.hostname != i.location.hostname || n != e.port, this.xs = e.secure != t
                    } else this.extraHeaders = e.extraHeaders
                }

                function c(e) {
                    this.method = e.method || "GET", this.uri = e.uri, this.xd = !!e.xd, this.xs = !!e.xs, this.async = !1 !== e.async, this.data = null != e.data ? e.data : null, this.agent = e.agent, this.isBinary = e.isBinary, this.supportsBinary = e.supportsBinary, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.extraHeaders = e.extraHeaders, this.create()
                }

                function d() {
                    for (var e in c.requests) c.requests.hasOwnProperty(e) && c.requests[e].abort()
                }

                l.exports = s, l.exports.Request = c, t(s, r), s.prototype.supportsBinary = !0, s.prototype.request = function (e) {
                    return (e = e || {}).uri = this.uri(), e.xd = this.xd, e.xs = this.xs, e.agent = this.agent || !1, e.supportsBinary = this.supportsBinary, e.enablesXDR = this.enablesXDR, e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized, e.extraHeaders = this.extraHeaders, new c(e)
                }, s.prototype.doWrite = function (e, t) {
                    var n = "string" != typeof e && void 0 !== e, r = this.request({method: "POST", data: e, isBinary: n}), i = this;
                    r.on("success", t), r.on("error", function (e) {
                        i.onError("xhr post error", e)
                    }), this.sendXhr = r
                }, s.prototype.doPoll = function () {
                    a("xhr poll");
                    var e = this.request(), t = this;
                    e.on("data", function (e) {
                        t.onData(e)
                    }), e.on("error", function (e) {
                        t.onError("xhr poll error", e)
                    }), this.pollXhr = e
                }, e(c.prototype), c.prototype.create = function () {
                    var e = {agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR};
                    e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized;
                    var t = this.xhr = new o(e), n = this;
                    try {
                        a("xhr open %s: %s", this.method, this.uri), t.open(this.method, this.uri, this.async);
                        try {
                            if (this.extraHeaders) for (var r in t.setDisableHeaderCheck(!0), this.extraHeaders) this.extraHeaders.hasOwnProperty(r) && t.setRequestHeader(r, this.extraHeaders[r])
                        } catch (e) {
                        }
                        if (this.supportsBinary && (t.responseType = "arraybuffer"), "POST" == this.method) try {
                            this.isBinary ? t.setRequestHeader("Content-type", "application/octet-stream") : t.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (e) {
                        }
                        "withCredentials" in t && (t.withCredentials = !0), this.hasXDR() ? (t.onload = function () {
                            n.onLoad()
                        }, t.onerror = function () {
                            n.onError(t.responseText)
                        }) : t.onreadystatechange = function () {
                            4 == t.readyState && (200 == t.status || 1223 == t.status ? n.onLoad() : setTimeout(function () {
                                n.onError(t.status)
                            }, 0))
                        }, a("xhr data %s", this.data), t.send(this.data)
                    } catch (e) {
                        return void setTimeout(function () {
                            n.onError(e)
                        }, 0)
                    }
                    i.document && (this.index = c.requestsCount++, c.requests[this.index] = this)
                }, c.prototype.onSuccess = function () {
                    this.emit("success"), this.cleanup()
                }, c.prototype.onData = function (e) {
                    this.emit("data", e), this.onSuccess()
                }, c.prototype.onError = function (e) {
                    this.emit("error", e), this.cleanup(!0)
                }, c.prototype.cleanup = function (e) {
                    if (void 0 !== this.xhr && null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n, e) try {
                            this.xhr.abort()
                        } catch (e) {
                        }
                        i.document && delete c.requests[this.index], this.xhr = null
                    }
                }, c.prototype.onLoad = function () {
                    var t;
                    try {
                        var e;
                        try {
                            e = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                        } catch (e) {
                        }
                        if ("application/octet-stream" === e) t = this.xhr.response; else if (this.supportsBinary) try {
                            t = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response))
                        } catch (e) {
                            for (var n = new Uint8Array(this.xhr.response), r = [], i = 0, o = n.length; i < o; i++) r.push(n[i]);
                            t = String.fromCharCode.apply(null, r)
                        } else t = this.xhr.responseText
                    } catch (e) {
                        this.onError(e)
                    }
                    null != t && this.onData(t)
                }, c.prototype.hasXDR = function () {
                    return void 0 !== i.XDomainRequest && !this.xs && this.enablesXDR
                }, c.prototype.abort = function () {
                    this.cleanup()
                }, i.document && (c.requestsCount = 0, c.requests = {}, i.attachEvent ? i.attachEvent("onunload", d) : i.addEventListener && i.addEventListener("beforeunload", d, !1))
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {"./polling": 8, "component-emitter": 15, "component-inherit": 16, debug: 17, "xmlhttprequest-ssl": 10}],
        8: [function (e, t, n) {
            var r = e("../transport"), i = e("parseqs"), o = e("engine.io-parser"), a = e("component-inherit"), s = e("yeast"),
                c = e("debug")("engine.io-client:polling");
            t.exports = u;
            var d = null != new (e("xmlhttprequest-ssl"))({xdomain: !1}).responseType;

            function u(e) {
                var t = e && e.forceBase64;
                d && !t || (this.supportsBinary = !1), r.call(this, e)
            }

            a(u, r), u.prototype.name = "polling", u.prototype.doOpen = function () {
                this.poll()
            }, u.prototype.pause = function (e) {
                var t = this;

                function n() {
                    c("paused"), t.readyState = "paused", e()
                }

                if (this.readyState = "pausing", this.polling || !this.writable) {
                    var r = 0;
                    this.polling && (c("we are currently polling - waiting to pause"), r++, this.once("pollComplete", function () {
                        c("pre-pause polling complete"), --r || n()
                    })), this.writable || (c("we are currently writing - waiting to pause"), r++, this.once("drain", function () {
                        c("pre-pause writing complete"), --r || n()
                    }))
                } else n()
            }, u.prototype.poll = function () {
                c("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
            }, u.prototype.onData = function (e) {
                var r = this;
                c("polling got data %s", e);
                o.decodePayload(e, this.socket.binaryType, function (e, t, n) {
                    if ("opening" == r.readyState && r.onOpen(), "close" == e.type) return r.onClose(), !1;
                    r.onPacket(e)
                }), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : c('ignoring poll - transport state "%s"', this.readyState))
            }, u.prototype.doClose = function () {
                var e = this;

                function t() {
                    c("writing close packet"), e.write([{type: "close"}])
                }

                "open" == this.readyState ? (c("transport open - closing"), t()) : (c("transport not open - deferring close"), this.once("open", t))
            }, u.prototype.write = function (e) {
                var t = this;
                this.writable = !1;
                var n = function () {
                    t.writable = !0, t.emit("drain")
                };
                t = this;
                o.encodePayload(e, this.supportsBinary, function (e) {
                    t.doWrite(e, n)
                })
            }, u.prototype.uri = function () {
                var e = this.query || {}, t = this.secure ? "https" : "http", n = "";
                return !1 !== this.timestampRequests && (e[this.timestampParam] = s()), this.supportsBinary || e.sid || (e.b64 = 1), e = i.encode(e), this.port && ("https" == t && 443 != this.port || "http" == t && 80 != this.port) && (n = ":" + this.port), e.length && (e = "?" + e), t + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + n + this.path + e
            }
        }, {"../transport": 4, "component-inherit": 16, debug: 17, "engine.io-parser": 19, parseqs: 27, "xmlhttprequest-ssl": 10, yeast: 30}],
        9: [function (u, l, e) {
            (function (a) {
                var n = u("../transport"), s = u("engine.io-parser"), r = u("parseqs"), e = u("component-inherit"), i = u("yeast"),
                    c = u("debug")("engine.io-client:websocket"), d = a.WebSocket || a.MozWebSocket, o = d;
                if (!o && "undefined" == typeof window) try {
                    o = u("ws")
                } catch (e) {
                }

                function t(e) {
                    e && e.forceBase64 && (this.supportsBinary = !1), this.perMessageDeflate = e.perMessageDeflate, n.call(this, e)
                }

                e(l.exports = t, n), t.prototype.name = "websocket", t.prototype.supportsBinary = !0, t.prototype.doOpen = function () {
                    if (this.check()) {
                        var e = this.uri(), t = {agent: this.agent, perMessageDeflate: this.perMessageDeflate};
                        t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (t.headers = this.extraHeaders), this.ws = d ? new o(e) : new o(e, void 0, t), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "buffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners()
                    }
                }, t.prototype.addEventListeners = function () {
                    var t = this;
                    this.ws.onopen = function () {
                        t.onOpen()
                    }, this.ws.onclose = function () {
                        t.onClose()
                    }, this.ws.onmessage = function (e) {
                        t.onData(e.data)
                    }, this.ws.onerror = function (e) {
                        t.onError("websocket error", e)
                    }
                }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (t.prototype.onData = function (e) {
                    var t = this;
                    setTimeout(function () {
                        n.prototype.onData.call(t, e)
                    }, 0)
                }), t.prototype.write = function (e) {
                    var r = this;
                    this.writable = !1;
                    for (var i = e.length, t = 0, n = i; t < n; t++) !function (n) {
                        s.encodePacket(n, r.supportsBinary, function (e) {
                            if (!d) {
                                var t = {};
                                if (n.options && (t.compress = n.options.compress), r.perMessageDeflate) ("string" == typeof e ? a.Buffer.byteLength(e) : e.length) < r.perMessageDeflate.threshold && (t.compress = !1)
                            }
                            try {
                                d ? r.ws.send(e) : r.ws.send(e, t)
                            } catch (e) {
                                c("websocket closed before onclose event")
                            }
                            --i || o()
                        })
                    }(e[t]);

                    function o() {
                        r.emit("flush"), setTimeout(function () {
                            r.writable = !0, r.emit("drain")
                        }, 0)
                    }
                }, t.prototype.onClose = function () {
                    n.prototype.onClose.call(this)
                }, t.prototype.doClose = function () {
                    void 0 !== this.ws && this.ws.close()
                }, t.prototype.uri = function () {
                    var e = this.query || {}, t = this.secure ? "wss" : "ws", n = "";
                    return this.port && ("wss" == t && 443 != this.port || "ws" == t && 80 != this.port) && (n = ":" + this.port), this.timestampRequests && (e[this.timestampParam] = i()), this.supportsBinary || (e.b64 = 1), (e = r.encode(e)).length && (e = "?" + e), t + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + n + this.path + e
                }, t.prototype.check = function () {
                    return !(!o || "__initialize" in o && this.name === t.prototype.name)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {"../transport": 4, "component-inherit": 16, debug: 17, "engine.io-parser": 19, parseqs: 27, ws: void 0, yeast: 30}],
        10: [function (e, t, n) {
            var i = e("has-cors");
            t.exports = function (e) {
                var t = e.xdomain, n = e.xscheme, r = e.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!t || i)) return new XMLHttpRequest
                } catch (e) {
                }
                try {
                    if ("undefined" != typeof XDomainRequest && !n && r) return new XDomainRequest
                } catch (e) {
                }
                if (!t) try {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                } catch (e) {
                }
            }
        }, {"has-cors": 22}],
        11: [function (e, t, n) {
            function a() {
            }

            t.exports = function (e, n, r) {
                var i = !1;
                return r = r || a, 0 === (o.count = e) ? n() : o;

                function o(e, t) {
                    if (o.count <= 0) throw new Error("after called too many times");
                    --o.count, e ? (i = !0, n(e), n = r) : 0 !== o.count || i || n(null, t)
                }
            }
        }, {}],
        12: [function (e, t, n) {
            t.exports = function (e, t, n) {
                var r = e.byteLength;
                if (t = t || 0, n = n || r, e.slice) return e.slice(t, n);
                if (t < 0 && (t += r), n < 0 && (n += r), r < n && (n = r), r <= t || n <= t || 0 === r) return new ArrayBuffer(0);
                for (var i = new Uint8Array(e), o = new Uint8Array(n - t), a = t, s = 0; a < n; a++, s++) o[s] = i[a];
                return o.buffer
            }
        }, {}],
        13: [function (e, t, n) {
            !function (l) {
                "use strict";
                n.encode = function (e) {
                    var t, n = new Uint8Array(e), r = n.length, i = "";
                    for (t = 0; t < r; t += 3) i += l[n[t] >> 2], i += l[(3 & n[t]) << 4 | n[t + 1] >> 4], i += l[(15 & n[t + 1]) << 2 | n[t + 2] >> 6], i += l[63 & n[t + 2]];
                    return r % 3 == 2 ? i = i.substring(0, i.length - 1) + "=" : r % 3 == 1 && (i = i.substring(0, i.length - 2) + "=="), i
                }, n.decode = function (e) {
                    var t, n, r, i, o, a = .75 * e.length, s = e.length, c = 0;
                    "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
                    var d = new ArrayBuffer(a), u = new Uint8Array(d);
                    for (t = 0; t < s; t += 4) n = l.indexOf(e[t]), r = l.indexOf(e[t + 1]), i = l.indexOf(e[t + 2]), o = l.indexOf(e[t + 3]), u[c++] = n << 2 | r >> 4, u[c++] = (15 & r) << 4 | i >> 2, u[c++] = (3 & i) << 6 | 63 & o;
                    return d
                }
            }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
        }, {}],
        14: [function (e, c, t) {
            (function (e) {
                var i = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder, t = function () {
                    try {
                        return 2 === new Blob(["hi"]).size
                    } catch (e) {
                        return !1
                    }
                }(), n = t && function () {
                    try {
                        return 2 === new Blob([new Uint8Array([1, 2])]).size
                    } catch (e) {
                        return !1
                    }
                }(), r = i && i.prototype.append && i.prototype.getBlob;

                function o(e) {
                    for (var t = 0; t < e.length; t++) {
                        var n = e[t];
                        if (n.buffer instanceof ArrayBuffer) {
                            var r = n.buffer;
                            if (n.byteLength !== r.byteLength) {
                                var i = new Uint8Array(n.byteLength);
                                i.set(new Uint8Array(r, n.byteOffset, n.byteLength)), r = i.buffer
                            }
                            e[t] = r
                        }
                    }
                }

                function a(e, t) {
                    t = t || {};
                    var n = new i;
                    o(e);
                    for (var r = 0; r < e.length; r++) n.append(e[r]);
                    return t.type ? n.getBlob(t.type) : n.getBlob()
                }

                function s(e, t) {
                    return o(e), new Blob(e, t || {})
                }

                c.exports = t ? n ? e.Blob : s : r ? a : void 0
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        15: [function (e, t, n) {
            function r(e) {
                if (e) return function (e) {
                    for (var t in r.prototype) e[t] = r.prototype[t];
                    return e
                }(e)
            }

            (t.exports = r).prototype.on = r.prototype.addEventListener = function (e, t) {
                return this._callbacks = this._callbacks || {}, (this._callbacks[e] = this._callbacks[e] || []).push(t), this
            }, r.prototype.once = function (e, t) {
                var n = this;

                function r() {
                    n.off(e, r), t.apply(this, arguments)
                }

                return this._callbacks = this._callbacks || {}, r.fn = t, this.on(e, r), this
            }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (e, t) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var n, r = this._callbacks[e];
                if (!r) return this;
                if (1 == arguments.length) return delete this._callbacks[e], this;
                for (var i = 0; i < r.length; i++) if ((n = r[i]) === t || n.fn === t) {
                    r.splice(i, 1);
                    break
                }
                return this
            }, r.prototype.emit = function (e) {
                this._callbacks = this._callbacks || {};
                var t = [].slice.call(arguments, 1), n = this._callbacks[e];
                if (n) for (var r = 0, i = (n = n.slice(0)).length; r < i; ++r) n[r].apply(this, t);
                return this
            }, r.prototype.listeners = function (e) {
                return this._callbacks = this._callbacks || {}, this._callbacks[e] || []
            }, r.prototype.hasListeners = function (e) {
                return !!this.listeners(e).length
            }
        }, {}],
        16: [function (e, t, n) {
            t.exports = function (e, t) {
                var n = function () {
                };
                n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
            }
        }, {}],
        17: [function (e, t, o) {
            function n() {
                var e;
                try {
                    e = o.storage.debug
                } catch (e) {
                }
                return e
            }

            (o = t.exports = e("./debug")).log = function () {
                return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }, o.formatArgs = function () {
                var e = arguments, t = this.useColors;
                if (e[0] = (t ? "%c" : "") + this.namespace + (t ? " %c" : " ") + e[0] + (t ? "%c " : " ") + "+" + o.humanize(this.diff), !t) return e;
                var n = "color: " + this.color;
                e = [e[0], n, "color: inherit"].concat(Array.prototype.slice.call(e, 1));
                var r = 0, i = 0;
                return e[0].replace(/%[a-z%]/g, function (e) {
                    "%%" !== e && (r++, "%c" === e && (i = r))
                }), e.splice(i, 0, n), e
            }, o.save = function (e) {
                try {
                    null == e ? o.storage.removeItem("debug") : o.storage.debug = e
                } catch (e) {
                }
            }, o.load = n, o.useColors = function () {
                return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && 31 <= parseInt(RegExp.$1, 10)
            }, o.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function () {
                try {
                    return window.localStorage
                } catch (e) {
                }
            }(), o.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], o.formatters.j = function (e) {
                return JSON.stringify(e)
            }, o.enable(n())
        }, {"./debug": 18}],
        18: [function (e, t, s) {
            (s = t.exports = function (e) {
                function t() {
                }

                function r() {
                    var i = r, e = +new Date, t = e - (c || e);
                    i.diff = t, i.prev = c, i.curr = e, c = e, null == i.useColors && (i.useColors = s.useColors()), null == i.color && i.useColors && (i.color = s.colors[d++ % s.colors.length]);
                    var o = Array.prototype.slice.call(arguments);
                    o[0] = s.coerce(o[0]), "string" != typeof o[0] && (o = ["%o"].concat(o));
                    var a = 0;
                    o[0] = o[0].replace(/%([a-z%])/g, function (e, t) {
                        if ("%%" === e) return e;
                        a++;
                        var n = s.formatters[t];
                        if ("function" == typeof n) {
                            var r = o[a];
                            e = n.call(i, r), o.splice(a, 1), a--
                        }
                        return e
                    }), "function" == typeof s.formatArgs && (o = s.formatArgs.apply(i, o));
                    var n = r.log || s.log || console.log.bind(console);
                    n.apply(i, o)
                }

                t.enabled = !1, r.enabled = !0;
                var n = s.enabled(e) ? r : t;
                return n.namespace = e, n
            }).coerce = function (e) {
                return e instanceof Error ? e.stack || e.message : e
            }, s.disable = function () {
                s.enable("")
            }, s.enable = function (e) {
                s.save(e);
                for (var t = (e || "").split(/[\s,]+/), n = t.length, r = 0; r < n; r++) t[r] && ("-" === (e = t[r].replace(/\*/g, ".*?"))[0] ? s.skips.push(new RegExp("^" + e.substr(1) + "$")) : s.names.push(new RegExp("^" + e + "$")))
            }, s.enabled = function (e) {
                var t, n;
                for (t = 0, n = s.skips.length; t < n; t++) if (s.skips[t].test(e)) return !1;
                for (t = 0, n = s.names.length; t < n; t++) if (s.names[t].test(e)) return !0;
                return !1
            }, s.humanize = e("ms"), s.names = [], s.skips = [], s.formatters = {};
            var c, d = 0
        }, {ms: 25}],
        19: [function (h, e, v) {
            (function (d) {
                var e = h("./keys"), t = h("has-binary"), f = h("arraybuffer.slice"), i = h("base64-arraybuffer"), s = h("after"), a = h("utf8"),
                    n = navigator.userAgent.match(/Android/i), r = /PhantomJS/i.test(navigator.userAgent), c = n || r;
                v.protocol = 3;
                var u = v.packets = {open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6}, o = e(u),
                    m = {type: "error", data: "parser error"}, l = h("blob");

                function p(e, t, n) {
                    for (var i = new Array(e.length), r = s(e.length, n), o = function (n, e, r) {
                        t(e, function (e, t) {
                            i[n] = t, r(e, i)
                        })
                    }, a = 0; a < e.length; a++) o(a, e[a], r)
                }

                v.encodePacket = function (e, t, n, r) {
                    "function" == typeof t && (r = t, t = !1), "function" == typeof n && (r = n, n = null);
                    var i = void 0 === e.data ? void 0 : e.data.buffer || e.data;
                    if (d.ArrayBuffer && i instanceof ArrayBuffer) return function (e, t, n) {
                        if (!t) return v.encodeBase64Packet(e, n);
                        var r = e.data, i = new Uint8Array(r), o = new Uint8Array(1 + r.byteLength);
                        o[0] = u[e.type];
                        for (var a = 0; a < i.length; a++) o[a + 1] = i[a];
                        return n(o.buffer)
                    }(e, t, r);
                    if (l && i instanceof d.Blob) return function (e, t, n) {
                        if (!t) return v.encodeBase64Packet(e, n);
                        if (c) return function (e, t, n) {
                            if (!t) return v.encodeBase64Packet(e, n);
                            var r = new FileReader;
                            return r.onload = function () {
                                e.data = r.result, v.encodePacket(e, t, !0, n)
                            }, r.readAsArrayBuffer(e.data)
                        }(e, t, n);
                        var r = new Uint8Array(1);
                        r[0] = u[e.type];
                        var i = new l([r.buffer, e.data]);
                        return n(i)
                    }(e, t, r);
                    if (i && i.base64) return function (e, t) {
                        var n = "b" + v.packets[e.type] + e.data.data;
                        return t(n)
                    }(e, r);
                    var o = u[e.type];
                    return void 0 !== e.data && (o += n ? a.encode(String(e.data)) : String(e.data)), r("" + o)
                }, v.encodeBase64Packet = function (t, n) {
                    var r, i = "b" + v.packets[t.type];
                    if (l && t.data instanceof d.Blob) {
                        var o = new FileReader;
                        return o.onload = function () {
                            var e = o.result.split(",")[1];
                            n(i + e)
                        }, o.readAsDataURL(t.data)
                    }
                    try {
                        r = String.fromCharCode.apply(null, new Uint8Array(t.data))
                    } catch (e) {
                        for (var a = new Uint8Array(t.data), s = new Array(a.length), c = 0; c < a.length; c++) s[c] = a[c];
                        r = String.fromCharCode.apply(null, s)
                    }
                    return i += d.btoa(r), n(i)
                }, v.decodePacket = function (e, t, n) {
                    if ("string" == typeof e || void 0 === e) {
                        if ("b" == e.charAt(0)) return v.decodeBase64Packet(e.substr(1), t);
                        if (n) try {
                            e = a.decode(e)
                        } catch (e) {
                            return m
                        }
                        var r = e.charAt(0);
                        return Number(r) == r && o[r] ? 1 < e.length ? {type: o[r], data: e.substring(1)} : {type: o[r]} : m
                    }
                    r = new Uint8Array(e)[0];
                    var i = f(e, 1);
                    return l && "blob" === t && (i = new l([i])), {type: o[r], data: i}
                }, v.decodeBase64Packet = function (e, t) {
                    var n = o[e.charAt(0)];
                    if (!d.ArrayBuffer) return {type: n, data: {base64: !0, data: e.substr(1)}};
                    var r = i.decode(e.substr(1));
                    return "blob" === t && l && (r = new l([r])), {type: n, data: r}
                }, v.encodePayload = function (e, n, r) {
                    "function" == typeof n && (r = n, n = null);
                    var i = t(e);
                    if (n && i) return l && !c ? v.encodePayloadAsBlob(e, r) : v.encodePayloadAsArrayBuffer(e, r);
                    if (!e.length) return r("0:");
                    p(e, function (e, t) {
                        v.encodePacket(e, !!i && n, !0, function (e) {
                            t(null, function (e) {
                                return e.length + ":" + e
                            }(e))
                        })
                    }, function (e, t) {
                        return r(t.join(""))
                    })
                }, v.decodePayload = function (e, t, n) {
                    if ("string" != typeof e) return v.decodePayloadAsBinary(e, t, n);
                    var r;
                    if ("function" == typeof t && (n = t, t = null), "" == e) return n(m, 0, 1);
                    for (var i, o, a = "", s = 0, c = e.length; s < c; s++) {
                        var d = e.charAt(s);
                        if (":" != d) a += d; else {
                            if ("" == a || a != (i = Number(a))) return n(m, 0, 1);
                            if (a != (o = e.substr(s + 1, i)).length) return n(m, 0, 1);
                            if (o.length) {
                                if (r = v.decodePacket(o, t, !0), m.type == r.type && m.data == r.data) return n(m, 0, 1);
                                if (!1 === n(r, s + i, c)) return
                            }
                            s += i, a = ""
                        }
                    }
                    return "" != a ? n(m, 0, 1) : void 0
                }, v.encodePayloadAsArrayBuffer = function (e, r) {
                    if (!e.length) return r(new ArrayBuffer(0));
                    p(e, function (e, t) {
                        v.encodePacket(e, !0, !0, function (e) {
                            return t(null, e)
                        })
                    }, function (e, t) {
                        var n = t.reduce(function (e, t) {
                            var n;
                            return e + (n = "string" == typeof t ? t.length : t.byteLength).toString().length + n + 2
                        }, 0), a = new Uint8Array(n), s = 0;
                        return t.forEach(function (e) {
                            var t = "string" == typeof e, n = e;
                            if (t) {
                                for (var r = new Uint8Array(e.length), i = 0; i < e.length; i++) r[i] = e.charCodeAt(i);
                                n = r.buffer
                            }
                            a[s++] = t ? 0 : 1;
                            var o = n.byteLength.toString();
                            for (i = 0; i < o.length; i++) a[s++] = parseInt(o[i]);
                            a[s++] = 255;
                            for (r = new Uint8Array(n), i = 0; i < r.length; i++) a[s++] = r[i]
                        }), r(a.buffer)
                    })
                }, v.encodePayloadAsBlob = function (e, n) {
                    p(e, function (e, s) {
                        v.encodePacket(e, !0, !0, function (e) {
                            var t = new Uint8Array(1);
                            if (t[0] = 1, "string" == typeof e) {
                                for (var n = new Uint8Array(e.length), r = 0; r < e.length; r++) n[r] = e.charCodeAt(r);
                                e = n.buffer, t[0] = 0
                            }
                            var i = (e instanceof ArrayBuffer ? e.byteLength : e.size).toString(), o = new Uint8Array(i.length + 1);
                            for (r = 0; r < i.length; r++) o[r] = parseInt(i[r]);
                            if (o[i.length] = 255, l) {
                                var a = new l([t.buffer, o.buffer, e]);
                                s(null, a)
                            }
                        })
                    }, function (e, t) {
                        return n(new l(t))
                    })
                }, v.decodePayloadAsBinary = function (e, n, r) {
                    "function" == typeof n && (r = n, n = null);
                    for (var t = e, i = [], o = !1; 0 < t.byteLength;) {
                        for (var a = new Uint8Array(t), s = 0 === a[0], c = "", d = 1; 255 != a[d]; d++) {
                            if (310 < c.length) {
                                o = !0;
                                break
                            }
                            c += a[d]
                        }
                        if (o) return r(m, 0, 1);
                        t = f(t, 2 + c.length), c = parseInt(c);
                        var u = f(t, 0, c);
                        if (s) try {
                            u = String.fromCharCode.apply(null, new Uint8Array(u))
                        } catch (e) {
                            var l = new Uint8Array(u);
                            u = "";
                            for (d = 0; d < l.length; d++) u += String.fromCharCode(l[d])
                        }
                        i.push(u), t = f(t, c)
                    }
                    var p = i.length;
                    i.forEach(function (e, t) {
                        r(v.decodePacket(e, n, !0), t, p)
                    })
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {"./keys": 20, after: 11, "arraybuffer.slice": 12, "base64-arraybuffer": 13, blob: 14, "has-binary": 21, utf8: 29}],
        20: [function (e, t, n) {
            t.exports = Object.keys || function (e) {
                var t = [], n = Object.prototype.hasOwnProperty;
                for (var r in e) n.call(e, r) && t.push(r);
                return t
            }
        }, {}],
        21: [function (e, t, n) {
            (function (i) {
                var o = e("isarray");
                t.exports = function (e) {
                    return function e(t) {
                        if (!t) return !1;
                        if (i.Buffer && i.Buffer.isBuffer(t) || i.ArrayBuffer && t instanceof ArrayBuffer || i.Blob && t instanceof Blob || i.File && t instanceof File) return !0;
                        if (o(t)) {
                            for (var n = 0; n < t.length; n++) if (e(t[n])) return !0
                        } else if (t && "object" == typeof t) for (var r in t.toJSON && (t = t.toJSON()), t) if (Object.prototype.hasOwnProperty.call(t, r) && e(t[r])) return !0;
                        return !1
                    }(e)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {isarray: 24}],
        22: [function (e, t, n) {
            try {
                t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
            } catch (e) {
                t.exports = !1
            }
        }, {}],
        23: [function (e, t, n) {
            var r = [].indexOf;
            t.exports = function (e, t) {
                if (r) return e.indexOf(t);
                for (var n = 0; n < e.length; ++n) if (e[n] === t) return n;
                return -1
            }
        }, {}],
        24: [function (e, t, n) {
            t.exports = Array.isArray || function (e) {
                return "[object Array]" == Object.prototype.toString.call(e)
            }
        }, {}],
        25: [function (e, t, n) {
            var r = 36e5, i = 864e5;

            function o(e, t, n) {
                if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + n : Math.ceil(e / t) + " " + n + "s"
            }

            t.exports = function (e, t) {
                return t = t || {}, "string" == typeof e ? function (e) {
                    if (1e4 < (e = "" + e).length) return;
                    var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
                    if (!t) return;
                    var n = parseFloat(t[1]);
                    switch ((t[2] || "ms").toLowerCase()) {
                        case"years":
                        case"year":
                        case"yrs":
                        case"yr":
                        case"y":
                            return 315576e5 * n;
                        case"days":
                        case"day":
                        case"d":
                            return n * i;
                        case"hours":
                        case"hour":
                        case"hrs":
                        case"hr":
                        case"h":
                            return n * r;
                        case"minutes":
                        case"minute":
                        case"mins":
                        case"min":
                        case"m":
                            return 6e4 * n;
                        case"seconds":
                        case"second":
                        case"secs":
                        case"sec":
                        case"s":
                            return 1e3 * n;
                        case"milliseconds":
                        case"millisecond":
                        case"msecs":
                        case"msec":
                        case"ms":
                            return n
                    }
                }(e) : t.long ? function (e) {
                    return o(e, i, "day") || o(e, r, "hour") || o(e, 6e4, "minute") || o(e, 1e3, "second") || e + " ms"
                }(e) : function (e) {
                    return i <= e ? Math.round(e / i) + "d" : r <= e ? Math.round(e / r) + "h" : 6e4 <= e ? Math.round(e / 6e4) + "m" : 1e3 <= e ? Math.round(e / 1e3) + "s" : e + "ms"
                }(e)
            }
        }, {}],
        26: [function (e, c, t) {
            (function (t) {
                var n = /^[\],:{}\s]*$/, r = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    i = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, o = /(?:^|:|,)(?:\s*\[)+/g, a = /^\s+/, s = /\s+$/;
                c.exports = function (e) {
                    return "string" == typeof e && e ? (e = e.replace(a, "").replace(s, ""), t.JSON && JSON.parse ? JSON.parse(e) : n.test(e.replace(r, "@").replace(i, "]").replace(o, "")) ? new Function("return " + e)() : void 0) : null
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        27: [function (e, t, n) {
            n.encode = function (e) {
                var t = "";
                for (var n in e) e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
                return t
            }, n.decode = function (e) {
                for (var t = {}, n = e.split("&"), r = 0, i = n.length; r < i; r++) {
                    var o = n[r].split("=");
                    t[decodeURIComponent(o[0])] = decodeURIComponent(o[1])
                }
                return t
            }
        }, {}],
        28: [function (e, t, n) {
            var s = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                c = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            t.exports = function (e) {
                var t = e, n = e.indexOf("["), r = e.indexOf("]");
                -1 != n && -1 != r && (e = e.substring(0, n) + e.substring(n, r).replace(/:/g, ";") + e.substring(r, e.length));
                for (var i = s.exec(e || ""), o = {}, a = 14; a--;) o[c[a]] = i[a] || "";
                return -1 != n && -1 != r && (o.source = t, o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":"), o.authority = o.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), o.ipv6uri = !0), o
            }
        }, {}],
        29: [function (e, y, S) {
            (function (g) {
                !function (e) {
                    var t = "object" == typeof S && S, n = "object" == typeof y && y && y.exports == t && y, r = "object" == typeof g && g;
                    r.global !== r && r.window !== r || (e = r);
                    var i, o, a, s = String.fromCharCode;

                    function c(e) {
                        for (var t, n, r = [], i = 0, o = e.length; i < o;) 55296 <= (t = e.charCodeAt(i++)) && t <= 56319 && i < o ? 56320 == (64512 & (n = e.charCodeAt(i++))) ? r.push(((1023 & t) << 10) + (1023 & n) + 65536) : (r.push(t), i--) : r.push(t);
                        return r
                    }

                    function d(e) {
                        if (55296 <= e && e <= 57343) throw Error("Lone surrogate U+" + e.toString(16).toUpperCase() + " is not a scalar value")
                    }

                    function u(e, t) {
                        return s(e >> t & 63 | 128)
                    }

                    function l(e) {
                        if (0 == (4294967168 & e)) return s(e);
                        var t = "";
                        return 0 == (4294965248 & e) ? t = s(e >> 6 & 31 | 192) : 0 == (4294901760 & e) ? (d(e), t = s(e >> 12 & 15 | 224), t += u(e, 6)) : 0 == (4292870144 & e) && (t = s(e >> 18 & 7 | 240), t += u(e, 12), t += u(e, 6)), t += s(63 & e | 128)
                    }

                    function p() {
                        if (o <= a) throw Error("Invalid byte index");
                        var e = 255 & i[a];
                        if (a++, 128 == (192 & e)) return 63 & e;
                        throw Error("Invalid continuation byte")
                    }

                    function f() {
                        var e, t;
                        if (o < a) throw Error("Invalid byte index");
                        if (a == o) return !1;
                        if (e = 255 & i[a], a++, 0 == (128 & e)) return e;
                        if (192 == (224 & e)) {
                            if (128 <= (t = (31 & e) << 6 | p())) return t;
                            throw Error("Invalid continuation byte")
                        }
                        if (224 == (240 & e)) {
                            if (2048 <= (t = (15 & e) << 12 | p() << 6 | p())) return d(t), t;
                            throw Error("Invalid continuation byte")
                        }
                        if (240 == (248 & e) && 65536 <= (t = (15 & e) << 18 | p() << 12 | p() << 6 | p()) && t <= 1114111) return t;
                        throw Error("Invalid UTF-8 detected")
                    }

                    var m = {
                        version: "2.0.0", encode: function (e) {
                            for (var t = c(e), n = t.length, r = -1, i = ""; ++r < n;) i += l(t[r]);
                            return i
                        }, decode: function (e) {
                            i = c(e), o = i.length, a = 0;
                            for (var t, n = []; !1 !== (t = f());) n.push(t);
                            return function (e) {
                                for (var t, n = e.length, r = -1, i = ""; ++r < n;) 65535 < (t = e[r]) && (i += s((t -= 65536) >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), i += s(t);
                                return i
                            }(n)
                        }
                    };
                    if (t && !t.nodeType) if (n) n.exports = m; else {
                        var h = {}.hasOwnProperty;
                        for (var v in m) h.call(m, v) && (t[v] = m[v])
                    } else e.utf8 = m
                }(this)
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        30: [function (e, t, n) {
            "use strict";
            var r, i = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), o = 64, a = {}, s = 0, c = 0;

            function d(e) {
                for (var t = ""; t = i[e % o] + t, 0 < (e = Math.floor(e / o));) ;
                return t
            }

            function u() {
                var e = d(+new Date);
                return e !== r ? (s = 0, r = e) : e + "." + d(s++)
            }

            for (; c < o; c++) a[i[c]] = c;
            u.encode = d, u.decode = function (e) {
                var t = 0;
                for (c = 0; c < e.length; c++) t = t * o + a[e.charAt(c)];
                return t
            }, t.exports = u
        }, {}],
        31: [function (e, t, n) {
            var s = e("./url"), r = e("socket.io-parser"), c = e("./manager"), d = e("debug")("socket.io-client");
            t.exports = n = i;
            var u = n.managers = {};

            function i(e, t) {
                "object" == typeof e && (t = e, e = void 0), t = t || {};
                var n = s(e), r = n.source, i = n.id, o = n.path, a = u[i] && o in u[i].nsps;
                return (t.forceNew || t["force new connection"] || !1 === t.multiplex || a ? (d("ignoring socket cache for %s", r), c(r, t)) : (u[i] || (d("new io instance for %s", r), u[i] = c(r, t)), u[i])).socket(n.path)
            }

            n.protocol = r.protocol, n.connect = i, n.Manager = e("./manager"), n.Socket = e("./socket")
        }, {"./manager": 32, "./socket": 34, "./url": 35, debug: 39, "socket.io-parser": 47}],
        32: [function (e, t, n) {
            var s = e("engine.io-client"), i = e("./socket"), r = e("component-emitter"), o = e("socket.io-parser"), c = e("./on"),
                a = e("component-bind"), d = e("debug")("socket.io-client:manager"), u = e("indexof"), l = e("backo2"),
                p = Object.prototype.hasOwnProperty;

            function f(e, t) {
                if (!(this instanceof f)) return new f(e, t);
                e && "object" == typeof e && (t = e, e = void 0), (t = t || {}).path = t.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = t, this.reconnection(!1 !== t.reconnection), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor(t.randomizationFactor || .5), this.backoff = new l({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }), this.timeout(null == t.timeout ? 2e4 : t.timeout), this.readyState = "closed", this.uri = e, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [], this.encoder = new o.Encoder, this.decoder = new o.Decoder, this.autoConnect = !1 !== t.autoConnect, this.autoConnect && this.open()
            }

            (t.exports = f).prototype.emitAll = function () {
                for (var e in this.emit.apply(this, arguments), this.nsps) p.call(this.nsps, e) && this.nsps[e].emit.apply(this.nsps[e], arguments)
            }, f.prototype.updateSocketIds = function () {
                for (var e in this.nsps) p.call(this.nsps, e) && (this.nsps[e].id = this.engine.id)
            }, r(f.prototype), f.prototype.reconnection = function (e) {
                return arguments.length ? (this._reconnection = !!e, this) : this._reconnection
            }, f.prototype.reconnectionAttempts = function (e) {
                return arguments.length ? (this._reconnectionAttempts = e, this) : this._reconnectionAttempts
            }, f.prototype.reconnectionDelay = function (e) {
                return arguments.length ? (this._reconnectionDelay = e, this.backoff && this.backoff.setMin(e), this) : this._reconnectionDelay
            }, f.prototype.randomizationFactor = function (e) {
                return arguments.length ? (this._randomizationFactor = e, this.backoff && this.backoff.setJitter(e), this) : this._randomizationFactor
            }, f.prototype.reconnectionDelayMax = function (e) {
                return arguments.length ? (this._reconnectionDelayMax = e, this.backoff && this.backoff.setMax(e), this) : this._reconnectionDelayMax
            }, f.prototype.timeout = function (e) {
                return arguments.length ? (this._timeout = e, this) : this._timeout
            }, f.prototype.maybeReconnectOnOpen = function () {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            }, f.prototype.open = f.prototype.connect = function (n) {
                if (d("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                d("opening %s", this.uri), this.engine = s(this.uri, this.opts);
                var e = this.engine, r = this;
                this.readyState = "opening", this.skipReconnect = !1;
                var t = c(e, "open", function () {
                    r.onopen(), n && n()
                }), i = c(e, "error", function (e) {
                    if (d("connect_error"), r.cleanup(), r.readyState = "closed", r.emitAll("connect_error", e), n) {
                        var t = new Error("Connection error");
                        t.data = e, n(t)
                    } else r.maybeReconnectOnOpen()
                });
                if (!1 !== this._timeout) {
                    var o = this._timeout;
                    d("connect attempt will timeout after %d", o);
                    var a = setTimeout(function () {
                        d("connect attempt timed out after %d", o), t.destroy(), e.close(), e.emit("error", "timeout"), r.emitAll("connect_timeout", o)
                    }, o);
                    this.subs.push({
                        destroy: function () {
                            clearTimeout(a)
                        }
                    })
                }
                return this.subs.push(t), this.subs.push(i), this
            }, f.prototype.onopen = function () {
                d("open"), this.cleanup(), this.readyState = "open", this.emit("open");
                var e = this.engine;
                this.subs.push(c(e, "data", a(this, "ondata"))), this.subs.push(c(e, "ping", a(this, "onping"))), this.subs.push(c(e, "pong", a(this, "onpong"))), this.subs.push(c(e, "error", a(this, "onerror"))), this.subs.push(c(e, "close", a(this, "onclose"))), this.subs.push(c(this.decoder, "decoded", a(this, "ondecoded")))
            }, f.prototype.onping = function () {
                this.lastPing = new Date, this.emitAll("ping")
            }, f.prototype.onpong = function () {
                this.emitAll("pong", new Date - this.lastPing)
            }, f.prototype.ondata = function (e) {
                this.decoder.add(e)
            }, f.prototype.ondecoded = function (e) {
                this.emit("packet", e)
            }, f.prototype.onerror = function (e) {
                d("error", e), this.emitAll("error", e)
            }, f.prototype.socket = function (e) {
                var t = this.nsps[e];
                if (!t) {
                    t = new i(this, e), this.nsps[e] = t;
                    var n = this;
                    t.on("connecting", r), t.on("connect", function () {
                        t.id = n.engine.id
                    }), this.autoConnect && r()
                }

                function r() {
                    ~u(n.connecting, t) || n.connecting.push(t)
                }

                return t
            }, f.prototype.destroy = function (e) {
                var t = u(this.connecting, e);
                ~t && this.connecting.splice(t, 1), this.connecting.length || this.close()
            }, f.prototype.packet = function (n) {
                d("writing packet %j", n);
                var r = this;
                r.encoding ? r.packetBuffer.push(n) : (r.encoding = !0, this.encoder.encode(n, function (e) {
                    for (var t = 0; t < e.length; t++) r.engine.write(e[t], n.options);
                    r.encoding = !1, r.processPacketQueue()
                }))
            }, f.prototype.processPacketQueue = function () {
                if (0 < this.packetBuffer.length && !this.encoding) {
                    var e = this.packetBuffer.shift();
                    this.packet(e)
                }
            }, f.prototype.cleanup = function () {
                var e;
                for (d("cleanup"); e = this.subs.shift();) e.destroy();
                this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy()
            }, f.prototype.close = f.prototype.disconnect = function () {
                d("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" == this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
            }, f.prototype.onclose = function (e) {
                d("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", e), this._reconnection && !this.skipReconnect && this.reconnect()
            }, f.prototype.reconnect = function () {
                if (this.reconnecting || this.skipReconnect) return this;
                var t = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) d("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1; else {
                    var e = this.backoff.duration();
                    d("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
                    var n = setTimeout(function () {
                        t.skipReconnect || (d("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function (e) {
                            e ? (d("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (d("reconnect success"), t.onreconnect())
                        }))
                    }, e);
                    this.subs.push({
                        destroy: function () {
                            clearTimeout(n)
                        }
                    })
                }
            }, f.prototype.onreconnect = function () {
                var e = this.backoff.attempts;
                this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", e)
            }
        }, {
            "./on": 33,
            "./socket": 34,
            backo2: 36,
            "component-bind": 37,
            "component-emitter": 38,
            debug: 39,
            "engine.io-client": 1,
            indexof: 42,
            "socket.io-parser": 47
        }],
        33: [function (e, t, n) {
            t.exports = function (e, t, n) {
                return e.on(t, n), {
                    destroy: function () {
                        e.removeListener(t, n)
                    }
                }
            }
        }, {}],
        34: [function (e, t, n) {
            var o = e("socket.io-parser"), r = e("component-emitter"), a = e("to-array"), i = e("./on"), s = e("component-bind"),
                c = e("debug")("socket.io-client:socket"), d = e("has-binary");
            t.exports = p;
            var u = {
                connect: 1,
                connect_error: 1,
                connect_timeout: 1,
                connecting: 1,
                disconnect: 1,
                error: 1,
                reconnect: 1,
                reconnect_attempt: 1,
                reconnect_failed: 1,
                reconnect_error: 1,
                reconnecting: 1,
                ping: 1,
                pong: 1
            }, l = r.prototype.emit;

            function p(e, t) {
                this.io = e, this.nsp = t, (this.json = this).ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, this.io.autoConnect && this.open()
            }

            r(p.prototype), p.prototype.subEvents = function () {
                if (!this.subs) {
                    var e = this.io;
                    this.subs = [i(e, "open", s(this, "onopen")), i(e, "packet", s(this, "onpacket")), i(e, "close", s(this, "onclose"))]
                }
            }, p.prototype.open = p.prototype.connect = function () {
                return this.connected || (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this.emit("connecting")), this
            }, p.prototype.send = function () {
                var e = a(arguments);
                return e.unshift("message"), this.emit.apply(this, e), this
            }, p.prototype.emit = function (e) {
                if (u.hasOwnProperty(e)) return l.apply(this, arguments), this;
                var t = a(arguments), n = o.EVENT;
                d(t) && (n = o.BINARY_EVENT);
                var r = {type: n, data: t, options: {}};
                return r.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof t[t.length - 1] && (c("emitting packet with ack id %d", this.ids), this.acks[this.ids] = t.pop(), r.id = this.ids++), this.connected ? this.packet(r) : this.sendBuffer.push(r), delete this.flags, this
            }, p.prototype.packet = function (e) {
                e.nsp = this.nsp, this.io.packet(e)
            }, p.prototype.onopen = function () {
                c("transport is open - connecting"), "/" != this.nsp && this.packet({type: o.CONNECT})
            }, p.prototype.onclose = function (e) {
                c("close (%s)", e), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", e)
            }, p.prototype.onpacket = function (e) {
                if (e.nsp == this.nsp) switch (e.type) {
                    case o.CONNECT:
                        this.onconnect();
                        break;
                    case o.EVENT:
                    case o.BINARY_EVENT:
                        this.onevent(e);
                        break;
                    case o.ACK:
                    case o.BINARY_ACK:
                        this.onack(e);
                        break;
                    case o.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case o.ERROR:
                        this.emit("error", e.data)
                }
            }, p.prototype.onevent = function (e) {
                var t = e.data || [];
                c("emitting event %j", t), null != e.id && (c("attaching ack callback to event"), t.push(this.ack(e.id))), this.connected ? l.apply(this, t) : this.receiveBuffer.push(t)
            }, p.prototype.ack = function (n) {
                var r = this, i = !1;
                return function () {
                    if (!i) {
                        i = !0;
                        var e = a(arguments);
                        c("sending ack %j", e);
                        var t = d(e) ? o.BINARY_ACK : o.ACK;
                        r.packet({type: t, id: n, data: e})
                    }
                }
            }, p.prototype.onack = function (e) {
                var t = this.acks[e.id];
                "function" == typeof t ? (c("calling ack %s with %j", e.id, e.data), t.apply(this, e.data), delete this.acks[e.id]) : c("bad ack %s", e.id)
            }, p.prototype.onconnect = function () {
                this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
            }, p.prototype.emitBuffered = function () {
                var e;
                for (e = 0; e < this.receiveBuffer.length; e++) l.apply(this, this.receiveBuffer[e]);
                for (this.receiveBuffer = [], e = 0; e < this.sendBuffer.length; e++) this.packet(this.sendBuffer[e]);
                this.sendBuffer = []
            }, p.prototype.ondisconnect = function () {
                c("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
            }, p.prototype.destroy = function () {
                if (this.subs) {
                    for (var e = 0; e < this.subs.length; e++) this.subs[e].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }, p.prototype.close = p.prototype.disconnect = function () {
                return this.connected && (c("performing disconnect (%s)", this.nsp), this.packet({type: o.DISCONNECT})), this.destroy(), this.connected && this.onclose("io client disconnect"), this
            }, p.prototype.compress = function (e) {
                return this.flags = this.flags || {}, this.flags.compress = e, this
            }
        }, {"./on": 33, "component-bind": 37, "component-emitter": 38, debug: 39, "has-binary": 41, "socket.io-parser": 47, "to-array": 51}],
        35: [function (e, t, n) {
            (function (i) {
                var o = e("parseuri"), a = e("debug")("socket.io-client:url");
                t.exports = function (e, t) {
                    var n = e, t = t || i.location;
                    null == e && (e = t.protocol + "//" + t.host);
                    "string" == typeof e && ("/" == e.charAt(0) && (e = "/" == e.charAt(1) ? t.protocol + e : t.host + e), /^(https?|wss?):\/\//.test(e) || (a("protocol-less url %s", e), e = void 0 !== t ? t.protocol + "//" + e : "https://" + e), a("parse %s", e), n = o(e));
                    n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443"));
                    n.path = n.path || "/";
                    var r = -1 !== n.host.indexOf(":") ? "[" + n.host + "]" : n.host;
                    return n.id = n.protocol + "://" + r + ":" + n.port, n.href = n.protocol + "://" + r + (t && t.port == n.port ? "" : ":" + n.port), n
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {debug: 39, parseuri: 45}],
        36: [function (e, t, n) {
            function r(e) {
                e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = 0 < e.jitter && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0
            }

            (t.exports = r).prototype.duration = function () {
                var e = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var t = Math.random(), n = Math.floor(t * this.jitter * e);
                    e = 0 == (1 & Math.floor(10 * t)) ? e - n : e + n
                }
                return 0 | Math.min(e, this.max)
            }, r.prototype.reset = function () {
                this.attempts = 0
            }, r.prototype.setMin = function (e) {
                this.ms = e
            }, r.prototype.setMax = function (e) {
                this.max = e
            }, r.prototype.setJitter = function (e) {
                this.jitter = e
            }
        }, {}],
        37: [function (e, t, n) {
            var r = [].slice;
            t.exports = function (e, t) {
                if ("string" == typeof t && (t = e[t]), "function" != typeof t) throw new Error("bind() requires a function");
                var n = r.call(arguments, 2);
                return function () {
                    return t.apply(e, n.concat(r.call(arguments)))
                }
            }
        }, {}],
        38: [function (e, t, n) {
            function r(e) {
                if (e) return function (e) {
                    for (var t in r.prototype) e[t] = r.prototype[t];
                    return e
                }(e)
            }

            (t.exports = r).prototype.on = r.prototype.addEventListener = function (e, t) {
                return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this
            }, r.prototype.once = function (e, t) {
                function n() {
                    this.off(e, n), t.apply(this, arguments)
                }

                return n.fn = t, this.on(e, n), this
            }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (e, t) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var n, r = this._callbacks["$" + e];
                if (!r) return this;
                if (1 == arguments.length) return delete this._callbacks["$" + e], this;
                for (var i = 0; i < r.length; i++) if ((n = r[i]) === t || n.fn === t) {
                    r.splice(i, 1);
                    break
                }
                return this
            }, r.prototype.emit = function (e) {
                this._callbacks = this._callbacks || {};
                var t = [].slice.call(arguments, 1), n = this._callbacks["$" + e];
                if (n) for (var r = 0, i = (n = n.slice(0)).length; r < i; ++r) n[r].apply(this, t);
                return this
            }, r.prototype.listeners = function (e) {
                return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || []
            }, r.prototype.hasListeners = function (e) {
                return !!this.listeners(e).length
            }
        }, {}],
        39: [function (e, t, n) {
            arguments[4][17][0].apply(n, arguments)
        }, {"./debug": 40, dup: 17}],
        40: [function (e, t, n) {
            arguments[4][18][0].apply(n, arguments)
        }, {dup: 18, ms: 44}],
        41: [function (e, t, n) {
            (function (i) {
                var o = e("isarray");
                t.exports = function (e) {
                    return function e(t) {
                        if (!t) return !1;
                        if (i.Buffer && i.Buffer.isBuffer && i.Buffer.isBuffer(t) || i.ArrayBuffer && t instanceof ArrayBuffer || i.Blob && t instanceof Blob || i.File && t instanceof File) return !0;
                        if (o(t)) {
                            for (var n = 0; n < t.length; n++) if (e(t[n])) return !0
                        } else if (t && "object" == typeof t) for (var r in t.toJSON && "function" == typeof t.toJSON && (t = t.toJSON()), t) if (Object.prototype.hasOwnProperty.call(t, r) && e(t[r])) return !0;
                        return !1
                    }(e)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {isarray: 43}],
        42: [function (e, t, n) {
            arguments[4][23][0].apply(n, arguments)
        }, {dup: 23}],
        43: [function (e, t, n) {
            arguments[4][24][0].apply(n, arguments)
        }, {dup: 24}],
        44: [function (e, t, n) {
            arguments[4][25][0].apply(n, arguments)
        }, {dup: 25}],
        45: [function (e, t, n) {
            arguments[4][28][0].apply(n, arguments)
        }, {dup: 28}],
        46: [function (e, t, n) {
            (function (u) {
                var l = e("isarray"), p = e("./is-buffer");
                n.deconstructPacket = function (e) {
                    var a = [], t = e.data;
                    var n = e;
                    return n.data = function e(t) {
                        if (!t) return t;
                        if (p(t)) {
                            var n = {_placeholder: !0, num: a.length};
                            return a.push(t), n
                        }
                        if (l(t)) {
                            for (var r = new Array(t.length), i = 0; i < t.length; i++) r[i] = e(t[i]);
                            return r
                        }
                        if ("object" != typeof t || t instanceof Date) return t;
                        r = {};
                        for (var o in t) r[o] = e(t[o]);
                        return r
                    }(t), n.attachments = a.length, {packet: n, buffers: a}
                }, n.reconstructPacket = function (e, i) {
                    return e.data = function e(t) {
                        if (t && t._placeholder) return i[t.num];
                        if (l(t)) {
                            for (var n = 0; n < t.length; n++) t[n] = e(t[n]);
                            return t
                        }
                        if (t && "object" == typeof t) {
                            for (var r in t) t[r] = e(t[r]);
                            return t
                        }
                        return t
                    }(e.data), e.attachments = void 0, e
                }, n.removeBlobs = function (e, s) {
                    var c = 0, d = e;
                    !function e(t, n, r) {
                        if (!t) return t;
                        if (u.Blob && t instanceof Blob || u.File && t instanceof File) {
                            c++;
                            var i = new FileReader;
                            i.onload = function () {
                                r ? r[n] = this.result : d = this.result, --c || s(d)
                            }, i.readAsArrayBuffer(t)
                        } else if (l(t)) for (var o = 0; o < t.length; o++) e(t[o], o, t); else if (t && "object" == typeof t && !p(t)) for (var a in t) e(t[a], a, t)
                    }(d), c || s(d)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {"./is-buffer": 48, isarray: 43}],
        47: [function (e, t, a) {
            var s = e("debug")("socket.io-parser"), c = e("json3"), n = (e("isarray"), e("component-emitter")), o = e("./binary"),
                r = e("./is-buffer");

            function i() {
            }

            function d(e) {
                var t = "", n = !1;
                return t += e.type, a.BINARY_EVENT != e.type && a.BINARY_ACK != e.type || (t += e.attachments, t += "-"), e.nsp && "/" != e.nsp && (n = !0, t += e.nsp), null != e.id && (n && (t += ",", n = !1), t += e.id), null != e.data && (n && (t += ","), t += c.stringify(e.data)), s("encoded %j as %s", e, t), t
            }

            function u() {
                this.reconstructor = null
            }

            function l(e) {
                this.reconPack = e, this.buffers = []
            }

            function p(e) {
                return {type: a.ERROR, data: "parser error"}
            }

            a.protocol = 4, a.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], a.CONNECT = 0, a.DISCONNECT = 1, a.EVENT = 2, a.ACK = 3, a.ERROR = 4, a.BINARY_EVENT = 5, a.BINARY_ACK = 6, a.Encoder = i, a.Decoder = u, i.prototype.encode = function (e, t) {
                (s("encoding packet %j", e), a.BINARY_EVENT == e.type || a.BINARY_ACK == e.type) ? function (e, i) {
                    o.removeBlobs(e, function (e) {
                        var t = o.deconstructPacket(e), n = d(t.packet), r = t.buffers;
                        r.unshift(n), i(r)
                    })
                }(e, t) : t([d(e)])
            }, n(u.prototype), u.prototype.add = function (e) {
                var t;
                if ("string" == typeof e) t = function (e) {
                    var t = {}, n = 0;
                    if (t.type = Number(e.charAt(0)), null == a.types[t.type]) return p();
                    if (a.BINARY_EVENT == t.type || a.BINARY_ACK == t.type) {
                        for (var r = ""; "-" != e.charAt(++n) && (r += e.charAt(n), n != e.length);) ;
                        if (r != Number(r) || "-" != e.charAt(n)) throw new Error("Illegal attachments");
                        t.attachments = Number(r)
                    }
                    if ("/" == e.charAt(n + 1)) for (t.nsp = ""; ++n;) {
                        var i = e.charAt(n);
                        if ("," == i) break;
                        if (t.nsp += i, n == e.length) break
                    } else t.nsp = "/";
                    var o = e.charAt(n + 1);
                    if ("" !== o && Number(o) == o) {
                        for (t.id = ""; ++n;) {
                            var i = e.charAt(n);
                            if (null == i || Number(i) != i) {
                                --n;
                                break
                            }
                            if (t.id += e.charAt(n), n == e.length) break
                        }
                        t.id = Number(t.id)
                    }
                    if (e.charAt(++n)) try {
                        t.data = c.parse(e.substr(n))
                    } catch (e) {
                        return p()
                    }
                    return s("decoded %s as %j", e, t), t
                }(e), a.BINARY_EVENT == t.type || a.BINARY_ACK == t.type ? (this.reconstructor = new l(t), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", t)) : this.emit("decoded", t); else {
                    if (!r(e) && !e.base64) throw new Error("Unknown type: " + e);
                    if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                    (t = this.reconstructor.takeBinaryData(e)) && (this.reconstructor = null, this.emit("decoded", t))
                }
            }, u.prototype.destroy = function () {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }, l.prototype.takeBinaryData = function (e) {
                if (this.buffers.push(e), this.buffers.length != this.reconPack.attachments) return null;
                var t = o.reconstructPacket(this.reconPack, this.buffers);
                return this.finishedReconstruction(), t
            }, l.prototype.finishedReconstruction = function () {
                this.reconPack = null, this.buffers = []
            }
        }, {"./binary": 46, "./is-buffer": 48, "component-emitter": 49, debug: 39, isarray: 43, json3: 50}],
        48: [function (e, n, t) {
            (function (t) {
                n.exports = function (e) {
                    return t.Buffer && t.Buffer.isBuffer(e) || t.ArrayBuffer && e instanceof ArrayBuffer
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        49: [function (e, t, n) {
            arguments[4][15][0].apply(n, arguments)
        }, {dup: 15}],
        50: [function (e, s, c) {
            (function (a) {
                (function () {
                    var U = {function: !0, object: !0}, e = U[typeof c] && c && !c.nodeType && c, B = U[typeof window] && window || this,
                        t = e && U[typeof s] && s && !s.nodeType && "object" == typeof a && a;

                    function V(e, c) {
                        e || (e = B.Object()), c || (c = B.Object());
                        var d = e.Number || B.Number, u = e.String || B.String, t = e.Object || B.Object, l = e.Date || B.Date,
                            n = e.SyntaxError || B.SyntaxError, w = e.TypeError || B.TypeError, r = e.Math || B.Math, i = e.JSON || B.JSON;
                        "object" == typeof i && i && (c.stringify = i.stringify, c.parse = i.parse);
                        var T, C, E, o = t.prototype, O = o.toString, p = new l(-0xc782b5b800cec);
                        try {
                            p = -109252 == p.getUTCFullYear() && 0 === p.getUTCMonth() && 1 === p.getUTCDate() && 10 == p.getUTCHours() && 37 == p.getUTCMinutes() && 6 == p.getUTCSeconds() && 708 == p.getUTCMilliseconds()
                        } catch (e) {
                        }

                        function f(e) {
                            if (f[e] !== E) return f[e];
                            var t;
                            if ("bug-string-char-index" == e) t = "a" != "a"[0]; else if ("json" == e) t = f("json-stringify") && f("json-parse"); else {
                                var n, r = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                                if ("json-stringify" == e) {
                                    var i = c.stringify, o = "function" == typeof i && p;
                                    if (o) {
                                        (n = function () {
                                            return 1
                                        }).toJSON = n;
                                        try {
                                            o = "0" === i(0) && "0" === i(new d) && '""' == i(new u) && i(O) === E && i(E) === E && i() === E && "1" === i(n) && "[1]" == i([n]) && "[null]" == i([E]) && "null" == i(null) && "[null,null,null]" == i([E, O, null]) && i({a: [n, !0, !1, null, "\0\b\n\f\r\t"]}) == r && "1" === i(null, n) && "[\n 1,\n 2\n]" == i([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == i(new l(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == i(new l(864e13)) && '"-000001-01-01T00:00:00.000Z"' == i(new l(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == i(new l(-1))
                                        } catch (e) {
                                            o = !1
                                        }
                                    }
                                    t = o
                                }
                                if ("json-parse" == e) {
                                    var a = c.parse;
                                    if ("function" == typeof a) try {
                                        if (0 === a("0") && !a(!1)) {
                                            var s = 5 == (n = a(r)).a.length && 1 === n.a[0];
                                            if (s) {
                                                try {
                                                    s = !a('"\t"')
                                                } catch (e) {
                                                }
                                                if (s) try {
                                                    s = 1 !== a("01")
                                                } catch (e) {
                                                }
                                                if (s) try {
                                                    s = 1 !== a("1.")
                                                } catch (e) {
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        s = !1
                                    }
                                    t = s
                                }
                            }
                            return f[e] = !!t
                        }

                        if (!f("json")) {
                            var m = "[object Function]", k = "[object Number]", R = "[object String]", A = "[object Array]",
                                s = f("bug-string-char-index");
                            if (!p) var P = r.floor, a = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], D = function (e, t) {
                                return a[t] + 365 * (e - 1970) + P((e - 1969 + (t = +(1 < t))) / 4) - P((e - 1901 + t) / 100) + P((e - 1601 + t) / 400)
                            };
                            if ((T = o.hasOwnProperty) || (T = function (e) {
                                var n, t = {};
                                return T = (t.__proto__ = null, t.__proto__ = {toString: 1}, t).toString != O ? function (e) {
                                    var t = this.__proto__, n = e in (this.__proto__ = null, this);
                                    return this.__proto__ = t, n
                                } : (n = t.constructor, function (e) {
                                    var t = (this.constructor || n).prototype;
                                    return e in this && !(e in t && this[e] === t[e])
                                }), t = null, T.call(this, e)
                            }), C = function (e, t) {
                                var n, a, r, i = 0;
                                for (r in(n = function () {
                                    this.valueOf = 0
                                }).prototype.valueOf = 0, a = new n) T.call(a, r) && i++;
                                return n = a = null, (C = i ? 2 == i ? function (e, t) {
                                    var n, r = {}, i = O.call(e) == m;
                                    for (n in e) i && "prototype" == n || T.call(r, n) || !(r[n] = 1) || !T.call(e, n) || t(n)
                                } : function (e, t) {
                                    var n, r, i = O.call(e) == m;
                                    for (n in e) i && "prototype" == n || !T.call(e, n) || (r = "constructor" === n) || t(n);
                                    (r || T.call(e, n = "constructor")) && t(n)
                                } : (a = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], function (e, t) {
                                    var n, r, i = O.call(e) == m,
                                        o = !i && "function" != typeof e.constructor && U[typeof e.hasOwnProperty] && e.hasOwnProperty || T;
                                    for (n in e) i && "prototype" == n || !o.call(e, n) || t(n);
                                    for (r = a.length; n = a[--r]; o.call(e, n) && t(n)) ;
                                }))(e, t)
                            }, !f("json-stringify")) {
                                var h = {92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t"}, N = function (e, t) {
                                    return ("000000" + (t || 0)).slice(-e)
                                }, M = function (e) {
                                    for (var t = '"', n = 0, r = e.length, i = !s || 10 < r, o = i && (s ? e.split("") : e); n < r; n++) {
                                        var a = e.charCodeAt(n);
                                        switch (a) {
                                            case 8:
                                            case 9:
                                            case 10:
                                            case 12:
                                            case 13:
                                            case 34:
                                            case 92:
                                                t += h[a];
                                                break;
                                            default:
                                                if (a < 32) {
                                                    t += "\\u00" + N(2, a.toString(16));
                                                    break
                                                }
                                                t += i ? o[n] : e.charAt(n)
                                        }
                                    }
                                    return t + '"'
                                }, x = function (e, t, n, r, i, o, a) {
                                    var s, c, d, u, l, p, f, m, h, v, g, y, S, b, _, I;
                                    try {
                                        s = t[e]
                                    } catch (e) {
                                    }
                                    if ("object" == typeof s && s) if ("[object Date]" != (c = O.call(s)) || T.call(s, "toJSON")) "function" == typeof s.toJSON && (c != k && c != R && c != A || T.call(s, "toJSON")) && (s = s.toJSON(e)); else if (-1 / 0 < s && s < 1 / 0) {
                                        if (D) {
                                            for (l = P(s / 864e5), d = P(l / 365.2425) + 1970 - 1; D(d + 1, 0) <= l; d++) ;
                                            for (u = P((l - D(d, 0)) / 30.42); D(d, u + 1) <= l; u++) ;
                                            l = 1 + l - D(d, u), f = P((p = (s % 864e5 + 864e5) % 864e5) / 36e5) % 24, m = P(p / 6e4) % 60, h = P(p / 1e3) % 60, v = p % 1e3
                                        } else d = s.getUTCFullYear(), u = s.getUTCMonth(), l = s.getUTCDate(), f = s.getUTCHours(), m = s.getUTCMinutes(), h = s.getUTCSeconds(), v = s.getUTCMilliseconds();
                                        s = (d <= 0 || 1e4 <= d ? (d < 0 ? "-" : "+") + N(6, d < 0 ? -d : d) : N(4, d)) + "-" + N(2, u + 1) + "-" + N(2, l) + "T" + N(2, f) + ":" + N(2, m) + ":" + N(2, h) + "." + N(3, v) + "Z"
                                    } else s = null;
                                    if (n && (s = n.call(t, e, s)), null === s) return "null";
                                    if ("[object Boolean]" == (c = O.call(s))) return "" + s;
                                    if (c == k) return -1 / 0 < s && s < 1 / 0 ? "" + s : "null";
                                    if (c == R) return M("" + s);
                                    if ("object" == typeof s) {
                                        for (b = a.length; b--;) if (a[b] === s) throw w();
                                        if (a.push(s), g = [], _ = o, o += i, c == A) {
                                            for (S = 0, b = s.length; S < b; S++) y = x(S, s, n, r, i, o, a), g.push(y === E ? "null" : y);
                                            I = g.length ? i ? "[\n" + o + g.join(",\n" + o) + "\n" + _ + "]" : "[" + g.join(",") + "]" : "[]"
                                        } else C(r || s, function (e) {
                                            var t = x(e, s, n, r, i, o, a);
                                            t !== E && g.push(M(e) + ":" + (i ? " " : "") + t)
                                        }), I = g.length ? i ? "{\n" + o + g.join(",\n" + o) + "\n" + _ + "}" : "{" + g.join(",") + "}" : "{}";
                                        return a.pop(), I
                                    }
                                };
                                c.stringify = function (e, t, n) {
                                    var r, i, o, a;
                                    if (U[typeof t] && t) if ((a = O.call(t)) == m) i = t; else if (a == A) {
                                        o = {};
                                        for (var s, c = 0, d = t.length; c < d; s = t[c++], ((a = O.call(s)) == R || a == k) && (o[s] = 1)) ;
                                    }
                                    if (n) if ((a = O.call(n)) == k) {
                                        if (0 < (n -= n % 1)) for (r = "", 10 < n && (n = 10); r.length < n; r += " ") ;
                                    } else a == R && (r = n.length <= 10 ? n : n.slice(0, 10));
                                    return x("", ((s = {})[""] = e, s), i, o, r, "", [])
                                }
                            }
                            if (!f("json-parse")) {
                                var v, g, y = u.fromCharCode, S = {92: "\\", 34: '"', 47: "/", 98: "\b", 116: "\t", 110: "\n", 102: "\f", 114: "\r"},
                                    b = function () {
                                        throw v = g = null, n()
                                    }, _ = function () {
                                        for (var e, t, n, r, i, o = g, a = o.length; v < a;) switch (i = o.charCodeAt(v)) {
                                            case 9:
                                            case 10:
                                            case 13:
                                            case 32:
                                                v++;
                                                break;
                                            case 123:
                                            case 125:
                                            case 91:
                                            case 93:
                                            case 58:
                                            case 44:
                                                return e = s ? o.charAt(v) : o[v], v++, e;
                                            case 34:
                                                for (e = "@", v++; v < a;) if ((i = o.charCodeAt(v)) < 32) b(); else if (92 == i) switch (i = o.charCodeAt(++v)) {
                                                    case 92:
                                                    case 34:
                                                    case 47:
                                                    case 98:
                                                    case 116:
                                                    case 110:
                                                    case 102:
                                                    case 114:
                                                        e += S[i], v++;
                                                        break;
                                                    case 117:
                                                        for (t = ++v, n = v + 4; v < n; v++) 48 <= (i = o.charCodeAt(v)) && i <= 57 || 97 <= i && i <= 102 || 65 <= i && i <= 70 || b();
                                                        e += y("0x" + o.slice(t, v));
                                                        break;
                                                    default:
                                                        b()
                                                } else {
                                                    if (34 == i) break;
                                                    for (i = o.charCodeAt(v), t = v; 32 <= i && 92 != i && 34 != i;) i = o.charCodeAt(++v);
                                                    e += o.slice(t, v)
                                                }
                                                if (34 == o.charCodeAt(v)) return v++, e;
                                                b();
                                            default:
                                                if (t = v, 45 == i && (r = !0, i = o.charCodeAt(++v)), 48 <= i && i <= 57) {
                                                    for (48 == i && (48 <= (i = o.charCodeAt(v + 1)) && i <= 57) && b(), r = !1; v < a && (48 <= (i = o.charCodeAt(v)) && i <= 57); v++) ;
                                                    if (46 == o.charCodeAt(v)) {
                                                        for (n = ++v; n < a && (48 <= (i = o.charCodeAt(n)) && i <= 57); n++) ;
                                                        n == v && b(), v = n
                                                    }
                                                    if (101 == (i = o.charCodeAt(v)) || 69 == i) {
                                                        for (43 != (i = o.charCodeAt(++v)) && 45 != i || v++, n = v; n < a && (48 <= (i = o.charCodeAt(n)) && i <= 57); n++) ;
                                                        n == v && b(), v = n
                                                    }
                                                    return +o.slice(t, v)
                                                }
                                                if (r && b(), "true" == o.slice(v, v + 4)) return v += 4, !0;
                                                if ("false" == o.slice(v, v + 5)) return v += 5, !1;
                                                if ("null" == o.slice(v, v + 4)) return v += 4, null;
                                                b()
                                        }
                                        return "$"
                                    }, I = function (e) {
                                        var t, n;
                                        if ("$" == e && b(), "string" == typeof e) {
                                            if ("@" == (s ? e.charAt(0) : e[0])) return e.slice(1);
                                            if ("[" == e) {
                                                for (t = []; "]" != (e = _()); n || (n = !0)) n && ("," == e ? "]" == (e = _()) && b() : b()), "," == e && b(), t.push(I(e));
                                                return t
                                            }
                                            if ("{" == e) {
                                                for (t = {}; "}" != (e = _()); n || (n = !0)) n && ("," == e ? "}" == (e = _()) && b() : b()), "," != e && "string" == typeof e && "@" == (s ? e.charAt(0) : e[0]) && ":" == _() || b(), t[e.slice(1)] = I(_());
                                                return t
                                            }
                                            b()
                                        }
                                        return e
                                    }, L = function (e, t, n) {
                                        var r = j(e, t, n);
                                        r === E ? delete e[t] : e[t] = r
                                    }, j = function (e, t, n) {
                                        var r, i = e[t];
                                        if ("object" == typeof i && i) if (O.call(i) == A) for (r = i.length; r--;) L(i, r, n); else C(i, function (e) {
                                            L(i, e, n)
                                        });
                                        return n.call(e, t, i)
                                    };
                                c.parse = function (e, t) {
                                    var n, r;
                                    return v = 0, g = "" + e, n = I(_()), "$" != _() && b(), v = g = null, t && O.call(t) == m ? j(((r = {})[""] = n, r), "", t) : n
                                }
                            }
                        }
                        return c.runInContext = V, c
                    }

                    if (!t || t.global !== t && t.window !== t && t.self !== t || (B = t), e) V(B, e); else {
                        var n = B.JSON, r = B.JSON3, i = !1, o = V(B, B.JSON3 = {
                            noConflict: function () {
                                return i || (i = !0, B.JSON = n, B.JSON3 = r, n = r = null), o
                            }
                        });
                        B.JSON = {parse: o.parse, stringify: o.stringify}
                    }
                }).call(this)
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        51: [function (e, t, n) {
            t.exports = function (e, t) {
                for (var n = [], r = (t = t || 0) || 0; r < e.length; r++) n[r - t] = e[r];
                return n
            }
        }, {}]
    }, {}, [31])(31)
});
var SocketSentinel = function (e, t) {
    var n;
    e && (this.socket = e, this.socketManager = e.io, this.baseUri = e.io.uri, (this.spareUri = t) && this.baseUri != t && this.socketManager.reconnectionAttempts(5), n = this, e.on("reconnect_failed", function () {
        n.changeSpareLine(), console.log("切换备用线路")
    }), this.changeSpareLine = function () {
        this.socketManager.attempts = 0, this.socketManager.uri = this.spareUri, this.socketManager.reconnect();
        var e = this.baseUri;
        this.baseUri = this.spareUri, this.spareUri = e
    })
};
!function (e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Owt = e()
}(function () {
    return function o(a, s, c) {
        function d(t, e) {
            if (!s[t]) {
                if (!a[t]) {
                    var n = "function" == typeof require && require;
                    if (!e && n) return n(t, !0);
                    if (u) return u(t, !0);
                    var r = new Error("Cannot find module '" + t + "'");
                    throw r.code = "MODULE_NOT_FOUND", r
                }
                var i = s[t] = {exports: {}};
                a[t][0].call(i.exports, function (e) {
                    return d(a[t][1][e] || e)
                }, i, i.exports, o, a, s, c)
            }
            return s[t].exports
        }

        for (var u = "function" == typeof require && require, e = 0; e < c.length; e++) d(c[e]);
        return d
    }({
        1: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Base64 = void 0;
            var r = function () {
                var t, n, e,
                    i = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
                    r = [];
                for (e = 0; e < i.length; e += 1) r[i[e]] = e;
                var o = function (e) {
                    t = e, n = 0
                }, a = function () {
                    if (!t) return -1;
                    if (n >= t.length) return -1;
                    var e = 255 & t.charCodeAt(n);
                    return n += 1, e
                }, s = function () {
                    if (!t) return -1;
                    for (; ;) {
                        if (n >= t.length) return -1;
                        var e = t.charAt(n);
                        if (n += 1, r[e]) return r[e];
                        if ("A" === e) return 0
                    }
                }, c = function (e) {
                    return 1 === (e = e.toString(16)).length && (e = "0" + e), e = "%" + e, unescape(e)
                };
                return {
                    encodeBase64: function (e) {
                        var t, n;
                        o(e), t = "";
                        var r = new Array(3);
                        for (n = !1; !n && -1 !== (r[0] = a());) r[1] = a(), r[2] = a(), t += i[r[0] >> 2], -1 !== r[1] ? (t += i[r[0] << 4 & 48 | r[1] >> 4], -1 !== r[2] ? (t += i[r[1] << 2 & 60 | r[2] >> 6], t += i[63 & r[2]]) : (t += i[r[1] << 2 & 60], t += "=", n = !0)) : (t += i[r[0] << 4 & 48], t += "=", t += "=", n = !0);
                        return t
                    }, decodeBase64: function (e) {
                        var t, n;
                        o(e), t = "";
                        var r = new Array(4);
                        for (n = !1; !n && -1 !== (r[0] = s()) && -1 !== (r[1] = s());) r[2] = s(), r[3] = s(), t += c(r[0] << 2 & 255 | r[1] >> 4), -1 !== r[2] ? (t += c(r[1] << 4 & 255 | r[2] >> 2), -1 !== r[3] ? t += c(r[2] << 6 & 255 | r[3]) : n = !0) : n = !0;
                        return t
                    }
                }
            }();
            n.Base64 = r
        }, {}],
        2: [function (e, t, n) {
            "use strict";

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            Object.defineProperty(n, "__esModule", {value: !0}), n.VideoEncodingParameters = n.VideoCodecParameters = n.VideoCodec = n.AudioEncodingParameters = n.AudioCodecParameters = n.AudioCodec = void 0, n.AudioCodec = {
                PCMU: "pcmu",
                PCMA: "pcma",
                OPUS: "opus",
                G722: "g722",
                ISAC: "iSAC",
                ILBC: "iLBC",
                AAC: "aac",
                AC3: "ac3",
                NELLYMOSER: "nellymoser"
            }, n.AudioCodecParameters = function e(t, n, r) {
                i(this, e), this.name = t, this.channelCount = n, this.clockRate = r
            }, n.AudioEncodingParameters = function e(t, n) {
                i(this, e), this.codec = t, this.maxBitrate = n
            }, n.VideoCodec = {VP8: "vp8", VP9: "vp9", H264: "h264", H265: "h265"}, n.VideoCodecParameters = function e(t, n) {
                i(this, e), this.name = t, this.profile = n
            }, n.VideoEncodingParameters = function e(t, n) {
                i(this, e), this.codec = t, this.maxBitrate = n
            }
        }, {}],
        3: [function (e, t, n) {
            "use strict";

            function r(e) {
                return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function i(e, t) {
                return !t || "object" !== r(t) && "function" != typeof t ? function (e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
            }

            function o(e) {
                return (o = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && s(e, t)
            }

            function s(e, t) {
                return (s = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function c(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            Object.defineProperty(n, "__esModule", {value: !0}), n.MuteEvent = n.ErrorEvent = n.MessageEvent = n.OwtEvent = n.EventDispatcher = void 0, n.EventDispatcher = function () {
                var r = {dispatcher: {}};
                r.dispatcher.eventListeners = {}, this.addEventListener = function (e, t) {
                    void 0 === r.dispatcher.eventListeners[e] && (r.dispatcher.eventListeners[e] = []), r.dispatcher.eventListeners[e].push(t)
                }, this.removeEventListener = function (e, t) {
                    if (r.dispatcher.eventListeners[e]) {
                        var n = r.dispatcher.eventListeners[e].indexOf(t);
                        -1 !== n && r.dispatcher.eventListeners[e].splice(n, 1)
                    }
                }, this.clearEventListener = function (e) {
                    r.dispatcher.eventListeners[e] = []
                }, this.dispatchEvent = function (t) {
                    r.dispatcher.eventListeners[t.type] && r.dispatcher.eventListeners[t.type].map(function (e) {
                        e(t)
                    })
                }
            };
            var d = function e(t) {
                c(this, e), this.type = t
            };
            n.OwtEvent = d;
            var u = function (e) {
                function r(e, t) {
                    var n;
                    return c(this, r), (n = i(this, o(r).call(this, e))).origin = t.origin, n.message = t.message, n.to = t.to, n
                }

                return a(r, d), r
            }();
            n.MessageEvent = u;
            var l = function (e) {
                function r(e, t) {
                    var n;
                    return c(this, r), (n = i(this, o(r).call(this, e))).error = t.error, n
                }

                return a(r, d), r
            }();
            n.ErrorEvent = l;
            var p = function (e) {
                function r(e, t) {
                    var n;
                    return c(this, r), (n = i(this, o(r).call(this, e))).kind = t.kind, n
                }

                return a(r, d), r
            }();
            n.MuteEvent = p
        }, {}],
        4: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0});
            var r = e("./mediastream-factory.js");
            Object.keys(r).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return r[e]
                    }
                })
            });
            var i = e("./stream.js");
            Object.keys(i).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return i[e]
                    }
                })
            });
            var o = e("./mediaformat.js");
            Object.keys(o).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return o[e]
                    }
                })
            });
            var a = e("./codec.js");
            Object.keys(a).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return a[e]
                    }
                })
            });
            var s = e("./publication.js");
            Object.keys(s).forEach(function (e) {
                "default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
                    enumerable: !0, get: function () {
                        return s[e]
                    }
                })
            })
        }, {"./codec.js": 2, "./mediaformat.js": 6, "./mediastream-factory.js": 7, "./publication.js": 8, "./stream.js": 10}],
        5: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.default = void 0;
            var r = function () {
                var t = function () {
                }, n = {DEBUG: 0, TRACE: 1, INFO: 2, WARNING: 3, ERROR: 4, NONE: 5};
                n.log = window.console.log.bind(window.console);
                var r = function (e) {
                    return "function" == typeof window.console[e] ? window.console[e].bind(window.console) : window.console.log.bind(window.console)
                }, e = function (e) {
                    n.debug = e <= 0 ? r("log") : t, n.trace = e <= 1 ? r("trace") : t, n.info = e <= 2 ? r("info") : t, n.warning = e <= 3 ? r("warn") : t, n.error = e <= 4 ? r("error") : t
                };
                return e(0), n.setLogLevel = e, n
            }();
            n.default = r
        }, {}],
        6: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Resolution = n.TrackKind = n.VideoSourceInfo = n.AudioSourceInfo = void 0, n.AudioSourceInfo = {
                MIC: "mic",
                SCREENCAST: "screen-cast",
                FILE: "file",
                MIXED: "mixed"
            }, n.VideoSourceInfo = {CAMERA: "camera", SCREENCAST: "screen-cast", FILE: "file", MIXED: "mixed"}, n.TrackKind = {
                AUDIO: "audio",
                VIDEO: "video",
                AUDIO_AND_VIDEO: "av"
            }, n.Resolution = function n(e, t) {
                !function (e, t) {
                    if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function")
                }(this), this.width = e, this.height = t
            }
        }, {}],
        7: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.MediaStreamFactory = n.StreamConstraints = n.VideoTrackConstraints = n.AudioTrackConstraints = void 0;
            var r, o = i(e("./utils.js")), a = (r = e("./logger.js")) && r.__esModule ? r : {default: r}, s = i(e("./mediaformat.js"));

            function i(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function c(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            function d(e) {
                return (d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function u(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function l(e) {
                return "object" === d(e.video) && e.video.source === s.VideoSourceInfo.SCREENCAST
            }

            n.AudioTrackConstraints = function e(t) {
                if (u(this, e), !Object.values(s.AudioSourceInfo).some(function (e) {
                    return e === t
                })) throw new TypeError("Invalid source.");
                this.source = t, this.deviceId = void 0
            }, n.VideoTrackConstraints = function e(t) {
                if (u(this, e), !Object.values(s.VideoSourceInfo).some(function (e) {
                    return e === t
                })) throw new TypeError("Invalid source.");
                this.source = t, this.deviceId = void 0, this.resolution = void 0, this.frameRate = void 0
            }, n.StreamConstraints = function e() {
                var t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0],
                    n = 1 < arguments.length && void 0 !== arguments[1] && arguments[1];
                u(this, e), this.audio = t, this.video = n
            };
            var p = function () {
                function e() {
                    u(this, e)
                }

                var t, n;
                return t = e, n = [{
                    key: "createMediaStream", value: function (i) {
                        if ("object" !== d(i) || !i.audio && !i.video) return Promise.reject(new TypeError("Invalid constrains"));
                        if (!l(i) && "object" === d(i.audio) && i.audio.source === s.AudioSourceInfo.SCREENCAST) return Promise.reject(new TypeError("Cannot share screen without video."));
                        if (l(i) && !o.isChrome() && !o.isFirefox()) return Promise.reject(new TypeError("Screen sharing only supports Chrome and Firefox."));
                        if (l(i) && "object" === d(i.audio) && i.audio.source !== s.AudioSourceInfo.SCREENCAST) return Promise.reject(new TypeError("Cannot capture video from screen cast while capture audio from other source."));
                        if (l(i) && o.isChrome()) {
                            if (!i.extensionId) return Promise.reject(new TypeError("Extension ID must be specified for screen sharing on Chrome."));
                            var e = ["screen", "window", "tab"];
                            return i.audio && e.push("audio"), new Promise(function (n, r) {
                                chrome.runtime.sendMessage(i.extensionId, {getStream: e}, function (e) {
                                    if (void 0 === e) return r(new Error(chrome.runtime.lastError.message));
                                    i.audio && "object" !== d(e.options) && a.default.warning("Desktop sharing with audio requires the latest Chrome extension. Your audio constraints will be ignored.");
                                    var t = Object.create({});
                                    i.audio && "object" === d(e.options) && (e.options.canRequestAudioTrack ? t.audio = {
                                        mandatory: {
                                            chromeMediaSource: "desktop",
                                            chromeMediaSourceId: e.streamId
                                        }
                                    } : a.default.warning("Sharing screen with audio was not selected by user.")), t.video = Object.create({}), t.video.mandatory = Object.create({}), t.video.mandatory.chromeMediaSource = "desktop", t.video.mandatory.chromeMediaSourceId = e.streamId, i.video.resolution && (t.video.mandatory.maxHeight = t.video.mandatory.minHeight = i.video.resolution.height, t.video.mandatory.maxWidth = t.video.mandatory.minWidth = i.video.resolution.width), i.video.frameRate && (t.video.mandatory.minFrameRate = i.video.frameRate, t.video.mandatory.maxFrameRate = i.video.frameRate), n(navigator.mediaDevices.getUserMedia(t))
                                })
                            })
                        }
                        if (!i.audio && !i.video) return Promise.reject(new TypeError("At least one of audio and video must be requested."));
                        var t = Object.create({});
                        return "object" === d(i.audio) && i.audio.source === s.AudioSourceInfo.MIC ? (t.audio = Object.create({}), o.isEdge() ? t.audio.deviceId = i.audio.deviceId : t.audio.deviceId = {exact: i.audio.deviceId}) : t.audio = i.audio, "object" === d(i.audio) && i.audio.source === s.AudioSourceInfo.SCREENCAST && (a.default.warning("Screen sharing with audio is not supported in Firefox."), t.audio = !1), "object" === d(i.video) ? (t.video = Object.create({}), "number" == typeof i.video.frameRate && (t.video.frameRate = i.video.frameRate), i.video.resolution && i.video.resolution.width && i.video.resolution.height && (t.video.width = Object.create({}), t.video.width.exact = i.video.resolution.width, t.video.height = Object.create({}), t.video.height.exact = i.video.resolution.height), "string" == typeof i.video.deviceId && (t.video.deviceId = {exact: i.video.deviceId}), o.isFirefox() && i.video.source === s.VideoSourceInfo.SCREENCAST && (t.video.mediaSource = "screen")) : t.video = i.video, navigator.mediaDevices.getUserMedia(t)
                    }
                }], null && c(t.prototype, null), c(t, n), e
            }();
            n.MediaStreamFactory = p
        }, {"./logger.js": 5, "./mediaformat.js": 6, "./utils.js": 11}],
        8: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.PublishOptions = n.Publication = n.PublicationSettings = n.VideoPublicationSettings = n.AudioPublicationSettings = void 0;
            var c = i(e("./utils.js")), r = (i(e("./mediaformat.js")), e("../base/event.js"));

            function i(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function d(e) {
                return (d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function u(e) {
                return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function o(e, t) {
                return (o = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function l(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function p(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            n.AudioPublicationSettings = function e(t) {
                p(this, e), this.codec = t
            }, n.VideoPublicationSettings = function e(t, n, r, i, o) {
                p(this, e), this.codec = t, this.resolution = n, this.frameRate = r, this.bitrate = i, this.keyFrameInterval = o
            }, n.PublicationSettings = function e(t, n) {
                p(this, e), this.audio = t, this.video = n
            };
            var a = function (e) {
                function s(e, t, n, r, i) {
                    var o, a;
                    return p(this, s), this, o = !(a = u(s).call(this)) || "object" !== d(a) && "function" != typeof a ? l(this) : a, Object.defineProperty(l(l(o)), "id", {
                        configurable: !1,
                        writable: !1,
                        value: e || c.createUuid()
                    }), o.stop = t, o.getStats = n, o.mute = r, o.unmute = i, o
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && o(e, t)
                }(s, r.EventDispatcher), s
            }();
            n.Publication = a, n.PublishOptions = function e(t, n) {
                p(this, e), this.audio = t, this.video = n
            }
        }, {"../base/event.js": 3, "./mediaformat.js": 6, "./utils.js": 11}],
        9: [function (e, t, n) {
            "use strict";
            var r;

            function c(e, t, n, r) {
                var i = e.split("\r\n");
                i.length <= 1 && (i = e.split("\n"));
                var o = function (e, t) {
                    var n = function (e, t) {
                        var n = C(e, "a=rtpmap", t);
                        return n ? O(e[n]) : null
                    }(e, t);
                    return n ? C(e, "a=fmtp:" + n.toString()) : null
                }(i, t), a = {};
                if (null === o) {
                    var s = C(i, "a=rtpmap", t);
                    if (null === s) return e;
                    var c = O(i[s]);
                    a.pt = c.toString(), a.params = {}, a.params[n] = r, i.splice(s + 1, 0, d(a))
                } else (a = T(i[o])).params[n] = r, i[o] = d(a);
                return i.join("\r\n")
            }

            function T(e) {
                var t = {}, n = e.indexOf(" "), r = e.substring(n + 1).split(";"), i = new RegExp("a=fmtp:(\\d+)"), o = e.match(i);
                if (!o || 2 !== o.length) return null;
                t.pt = o[1];
                for (var a = {}, s = 0; s < r.length; ++s) {
                    var c = r[s].split("=");
                    2 === c.length && (a[c[0]] = c[1])
                }
                return t.params = a, t
            }

            function d(e) {
                if (!e.hasOwnProperty("pt") || !e.hasOwnProperty("params")) return null;
                var t = e.pt, n = e.params, r = [], i = 0;
                for (var o in n) r[i] = o + "=" + n[o], ++i;
                return 0 === i ? null : "a=fmtp:" + t.toString() + " " + r.join(";")
            }

            function C(e, t, n) {
                return E(e, 0, -1, t, n)
            }

            function E(e, t, n, r, i) {
                for (var o = -1 !== n ? n : e.length, a = t; a < o; ++a) if (0 === e[a].indexOf(r) && (!i || -1 !== e[a].toLowerCase().indexOf(i.toLowerCase()))) return a;
                return null
            }

            function O(e) {
                var t = new RegExp("a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+"), n = e.match(t);
                return n && 2 === n.length ? n[1] : null
            }

            Object.defineProperty(n, "__esModule", {value: !0}), n.reorderCodecs = function (e, t, n) {
                if (!n || 0 === n.length) return e;
                n = "audio" === t ? n.concat(k) : n.concat(R);
                var r = e.split("\r\n"), i = C(r, "m=", t);
                if (null === i) return e;
                var o = r[i].split(" ");
                o.splice(0, 3);
                var a, s, c = [], d = !0, u = !1, l = void 0;
                try {
                    for (var p, f = n[Symbol.iterator](); !(d = (p = f.next()).done); d = !0) for (var m = p.value, h = 0; h < r.length; h++) {
                        var v = E(r, h, -1, "a=rtpmap", m);
                        if (null !== v) {
                            var g = O(r[v]);
                            g && (c.push(g), h = v)
                        }
                    }
                } catch (e) {
                    u = !0, l = e
                } finally {
                    try {
                        d || null == f.return || f.return()
                    } finally {
                        if (u) throw l
                    }
                }
                c = function (e, t) {
                    var n = !0, r = !1, i = void 0;
                    try {
                        for (var o, a = t[Symbol.iterator](); !(n = (o = a.next()).done); n = !0) {
                            var s = C(e, "a=fmtp", "apt=" + o.value);
                            if (null !== s) {
                                var c = T(e[s]);
                                t.push(c.pt)
                            }
                        }
                    } catch (e) {
                        r = !0, i = e
                    } finally {
                        try {
                            n || null == a.return || a.return()
                        } finally {
                            if (r) throw i
                        }
                    }
                    return t
                }(r, c), r[i] = (a = r[i], s = c, a.split(" ").slice(0, 3).concat(s).join(" "));
                var y = !0, S = !1, b = void 0;
                try {
                    for (var _, I = o[Symbol.iterator](); !(y = (_ = I.next()).done); y = !0) {
                        var w = _.value;
                        -1 === c.indexOf(w) && (r = A(r, w))
                    }
                } catch (e) {
                    S = !0, b = e
                } finally {
                    try {
                        y || null == I.return || I.return()
                    } finally {
                        if (S) throw b
                    }
                }
                return r.join("\r\n")
            }, n.setMaxBitrate = function (e, t) {
                var n = !0, r = !1, i = void 0;
                try {
                    for (var o, a = t[Symbol.iterator](); !(n = (o = a.next()).done); n = !0) {
                        var s = o.value;
                        s.maxBitrate && (e = c(e, s.codec.name, "x-google-max-bitrate", s.maxBitrate.toString()))
                    }
                } catch (e) {
                    r = !0, i = e
                } finally {
                    try {
                        n || null == a.return || a.return()
                    } finally {
                        if (r) throw i
                    }
                }
                return e
            }, (r = e("./logger.js")) && r.__esModule;
            var k = ["CN", "telephone-event"], R = ["red", "ulpfec"];

            function A(e, t) {
                for (var n = new RegExp("a=(rtpmap|rtcp-fb|fmtp):" + t + "\\s"), r = e.length - 1; 0 < r; r--) e[r].match(n) && e.splice(r, 1);
                return e
            }
        }, {"./logger.js": 5}],
        10: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.StreamEvent = n.RemoteStream = n.LocalStream = n.Stream = n.StreamSourceInfo = void 0, (r = e("./logger.js")) && r.__esModule;
            var r, o = e("./event.js"), s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }(e("./utils.js"));

            function a(e) {
                return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function c(e, t) {
                return !t || "object" !== a(t) && "function" != typeof t ? l(e) : t
            }

            function d(e) {
                return (d = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function u(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && i(e, t)
            }

            function i(e, t) {
                return (i = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function l(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function p(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function f(t, e) {
                return e.some(function (e) {
                    return e === t
                })
            }

            n.StreamSourceInfo = function e(t, n) {
                if (p(this, e), !f(t, [void 0, "mic", "screen-cast", "file", "mixed"])) throw new TypeError("Incorrect value for audioSourceInfo");
                if (!f(n, [void 0, "camera", "screen-cast", "file", "encoded-file", "raw-file", "mixed"])) throw new TypeError("Incorrect value for videoSourceInfo");
                this.audio = t, this.video = n
            };
            var m = function (e) {
                function i(e, t, n) {
                    var r;
                    if (p(this, i), r = c(this, d(i).call(this)), e && !(e instanceof MediaStream) || "object" !== a(t)) throw new TypeError("Invalid stream or sourceInfo.");
                    if (e && (0 < e.getAudioTracks().length && !t.audio || 0 < e.getVideoTracks().length && !t.video)) throw new TypeError("Missing audio source info or video source info.");
                    return Object.defineProperty(l(l(r)), "mediaStream", {
                        configurable: !1,
                        writable: !0,
                        value: e
                    }), Object.defineProperty(l(l(r)), "source", {
                        configurable: !1,
                        writable: !1,
                        value: t
                    }), Object.defineProperty(l(l(r)), "attributes", {configurable: !0, writable: !1, value: n}), r
                }

                return u(i, o.EventDispatcher), i
            }();
            n.Stream = m;
            var h = function (e) {
                function i(e, t, n) {
                    var r;
                    if (p(this, i), !(e instanceof MediaStream)) throw new TypeError("Invalid stream.");
                    return r = c(this, d(i).call(this, e, t, n)), Object.defineProperty(l(l(r)), "id", {
                        configurable: !1,
                        writable: !1,
                        value: s.createUuid()
                    }), r
                }

                return u(i, m), i
            }();
            n.LocalStream = h;
            var v = function (e) {
                function a(e, t, n, r, i) {
                    var o;
                    return p(this, a), o = c(this, d(a).call(this, n, r, i)), Object.defineProperty(l(l(o)), "id", {
                        configurable: !1,
                        writable: !1,
                        value: e || s.createUuid()
                    }), Object.defineProperty(l(l(o)), "origin", {
                        configurable: !1,
                        writable: !1,
                        value: t
                    }), o.settings = void 0, o.capabilities = void 0, o
                }

                return u(a, m), a
            }();
            n.RemoteStream = v;
            var g = function (e) {
                function r(e, t) {
                    var n;
                    return p(this, r), (n = c(this, d(r).call(this, e))).stream = t.stream, n
                }

                return u(r, o.OwtEvent), r
            }();
            n.StreamEvent = g
        }, {"./event.js": 3, "./logger.js": 5, "./utils.js": 11}],
        11: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.isFirefox = function () {
                return null !== window.navigator.userAgent.match("Firefox")
            }, n.isChrome = function () {
                return null !== window.navigator.userAgent.match("Chrome")
            }, n.isSafari = i, n.isEdge = function () {
                return null !== window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)
            }, n.createUuid = function () {
                return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                    var t = 16 * Math.random() | 0;
                    return ("x" === e ? t : 3 & t | 8).toString(16)
                })
            }, n.sysInfo = function () {
                var e = Object.create({});
                e.sdk = {version: r, type: "JavaScript"};
                var t = navigator.userAgent, n = /Chrome\/([0-9\.]+)/.exec(t);
                return n ? e.runtime = {name: "Chrome", version: n[1]} : (n = /Firefox\/([0-9\.]+)/.exec(t)) ? e.runtime = {
                    name: "Firefox",
                    version: n[1]
                } : (n = /Edge\/([0-9\.]+)/.exec(t)) ? e.runtime = {
                    name: "Edge",
                    version: n[1]
                } : i() ? (n = /Version\/([0-9\.]+) Safari/.exec(t), e.runtime = {name: "Safari"}, e.runtime.version = n ? n[1] : "Unknown") : e.runtime = {
                    name: "Unknown",
                    version: "Unknown"
                }, (n = /Windows NT ([0-9\.]+)/.exec(t)) ? e.os = {
                    name: "Windows NT",
                    version: n[1]
                } : (n = /Intel Mac OS X ([0-9_\.]+)/.exec(t)) ? e.os = {
                    name: "Mac OS X",
                    version: n[1].replace(/_/g, ".")
                } : (n = /iPhone OS ([0-9_\.]+)/.exec(t)) ? e.os = {
                    name: "iPhone OS",
                    version: n[1].replace(/_/g, ".")
                } : (n = /X11; Linux/.exec(t)) ? e.os = {
                    name: "Linux",
                    version: "Unknown"
                } : (n = /Android( ([0-9\.]+))?/.exec(t)) ? e.os = {
                    name: "Android",
                    version: n[1] || "Unknown"
                } : (n = /CrOS/.exec(t)) ? e.os = {name: "Chrome OS", version: "Unknown"} : e.os = {
                    name: "Unknown",
                    version: "Unknown"
                }, e.capabilities = {continualIceGathering: !1, unifiedPlan: !1, streamRemovable: "Firefox" !== e.runtime.name}, e
            };
            var r = "4.1";

            function i() {
                return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
            }
        }, {}],
        12: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.ConferencePeerConnectionChannel = void 0;
            var r, R = (r = e("../base/logger.js")) && r.__esModule ? r : {default: r}, A = e("../base/event.js"), i = e("../base/mediaformat.js"),
                o = e("../base/publication.js"), a = e("./subscription.js"), P = e("./error.js"), s = d(e("../base/utils.js")),
                c = d(e("../base/sdputils.js"));

            function d(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function D(e) {
                return (D = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function u(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            function l(e) {
                return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function p(e, t) {
                return (p = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            var f = function (e) {
                function r(e, t) {
                    var n;
                    return function (e, t) {
                        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
                    }(this), (n = function (e, t) {
                        return !t || "object" !== D(t) && "function" != typeof t ? function (e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e) : t
                    }(this, l(r).call(this)))._config = e, n._options = null, n._signaling = t, n._pc = null, n._internalId = null, n._pendingCandidates = [], n._subscribePromise = null, n._publishPromise = null, n._subscribedStream = null, n._publishedStream = null, n._publication = null, n._subscription = null, n._disconnectTimer = null, n._ended = !1, n
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && p(e, t)
                }(r, A.EventDispatcher), u(r.prototype, [{
                    key: "onMessage", value: function (e, t) {
                        switch (e) {
                            case"progress":
                                "soac" === t.status ? this._sdpHandler(t.data) : "ready" === t.status ? this._readyHandler() : "error" === t.status && this._errorHandler(t.data);
                                break;
                            case"stream":
                                this._onStreamEvent(t);
                                break;
                            default:
                                R.default.warning("Unknown notification from MCU.")
                        }
                    }
                }, {
                    key: "publish", value: function (r, i) {
                        var o = this;
                        if (void 0 === i && (i = {
                            audio: !!r.mediaStream.getAudioTracks(),
                            video: !!r.mediaStream.getVideoTracks()
                        }), "object" !== D(i)) return Promise.reject(new TypeError("Options should be an object."));
                        if (void 0 === i.audio && (i.audio = !!r.mediaStream.getAudioTracks()), void 0 === i.video && (i.video = !!r.mediaStream.getVideoTracks()), !!i.audio == !r.mediaStream.getAudioTracks().length || !!i.video == !r.mediaStream.getVideoTracks().length) return Promise.reject(new P.ConferenceError("options.audio/video is inconsistent with tracks presented in the MediaStream."));
                        if (!(!1 !== i.audio && null !== i.audio || !1 !== i.video && null !== i.video)) return Promise.reject(new P.ConferenceError("Cannot publish a stream without audio and video."));
                        if ("object" === D(i.audio)) {
                            if (!Array.isArray(i.audio)) return Promise.reject(new TypeError("options.audio should be a boolean or an array."));
                            var e = !0, t = !1, n = void 0;
                            try {
                                for (var a, s = i.audio[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) {
                                    var c = a.value;
                                    if (!c.codec || "string" != typeof c.codec.name || void 0 !== c.maxBitrate && "number" != typeof c.maxBitrate) return Promise.reject(new TypeError("options.audio has incorrect parameters."))
                                }
                            } catch (r) {
                                t = !0, n = r
                            } finally {
                                try {
                                    e || null == s.return || s.return()
                                } finally {
                                    if (t) throw n
                                }
                            }
                        }
                        if ("object" === D(i.video)) {
                            if (!Array.isArray(i.video)) return Promise.reject(new TypeError("options.video should be a boolean or an array."));
                            var d = !0, u = !1, l = void 0;
                            try {
                                for (var p, f = i.video[Symbol.iterator](); !(d = (p = f.next()).done); d = !0) {
                                    var m = p.value;
                                    if (!m.codec || "string" != typeof m.codec.name || void 0 !== m.maxBitrate && "number" != typeof m.maxBitrate || void 0 !== m.codec.profile && "string" != typeof m.codec.profile) return Promise.reject(new TypeError("options.video has incorrect parameters."))
                                }
                            } catch (r) {
                                u = !0, l = r
                            } finally {
                                try {
                                    d || null == f.return || f.return()
                                } finally {
                                    if (u) throw l
                                }
                            }
                        }
                        this._options = i;
                        var h = {};
                        if (this._createPeerConnection(), 0 < r.mediaStream.getAudioTracks().length && !1 !== i.audio && null !== i.audio) {
                            if (1 < r.mediaStream.getAudioTracks().length && R.default.warning("Publishing a stream with multiple audio tracks is not fully supported."), "boolean" != typeof i.audio && "object" !== D(i.audio)) return Promise.reject(new P.ConferenceError("Type of audio options should be boolean or an object."));
                            h.audio = {}, h.audio.source = r.source.audio;
                            var v = !0, g = !1, y = void 0;
                            try {
                                for (var S, b = r.mediaStream.getAudioTracks()[Symbol.iterator](); !(v = (S = b.next()).done); v = !0) {
                                    var _ = S.value;
                                    this._pc.addTrack(_, r.mediaStream)
                                }
                            } catch (r) {
                                g = !0, y = r
                            } finally {
                                try {
                                    v || null == b.return || b.return()
                                } finally {
                                    if (g) throw y
                                }
                            }
                        } else h.audio = !1;
                        if (0 < r.mediaStream.getVideoTracks().length && !1 !== i.video && null !== i.video) {
                            1 < r.mediaStream.getVideoTracks().length && R.default.warning("Publishing a stream with multiple video tracks is not fully supported."), h.video = {}, h.video.source = r.source.video;
                            var I = r.mediaStream.getVideoTracks()[0].getSettings(), w = !0,
                                T = !(h.video.parameters = {resolution: {width: I.width, height: I.height}, framerate: I.frameRate}), C = void 0;
                            try {
                                for (var E, O = r.mediaStream.getVideoTracks()[Symbol.iterator](); !(w = (E = O.next()).done); w = !0) {
                                    var k = E.value;
                                    this._pc.addTrack(k, r.mediaStream)
                                }
                            } catch (r) {
                                T = !0, C = r
                            } finally {
                                try {
                                    w || null == O.return || O.return()
                                } finally {
                                    if (T) throw C
                                }
                            }
                        } else h.video = !1;
                        return this._publishedStream = r, this._signaling.sendSignalingMessage("publish", {
                            media: h,
                            attributes: r.attributes
                        }).then(function (e) {
                            var t, n = new A.MessageEvent("id", {message: e.id, origin: o._remoteId});
                            o.dispatchEvent(n), o._internalId = e.id, "function" == typeof o._pc.addTransceiver && (h.audio && 0 < r.mediaStream.getAudioTracks() && o._pc.addTransceiver("audio", {direction: "sendonly"}), h.video && 0 < r.mediaStream.getVideoTracks() && o._pc.addTransceiver("video", {direction: "sendonly"})), o._pc.createOffer({
                                offerToReceiveAudio: !1,
                                offerToReceiveVideo: !1
                            }).then(function (e) {
                                return i && (e.sdp = o._setRtpReceiverOptions(e.sdp, i)), e
                            }).then(function (e) {
                                return t = e, o._pc.setLocalDescription(e)
                            }).then(function () {
                                o._signaling.sendSignalingMessage("soac", {id: o._internalId, signaling: t})
                            }).catch(function (e) {
                                R.default.error("Failed to create offer or set SDP. Message: " + e.message), o._unpublish(), o._rejectPromise(e), o._fireEndedEventOnPublicationOrSubscription()
                            })
                        }).catch(function (e) {
                            o._unpublish(), o._rejectPromise(e), o._fireEndedEventOnPublicationOrSubscription()
                        }), new Promise(function (e, t) {
                            o._publishPromise = {resolve: e, reject: t}
                        })
                    }
                }, {
                    key: "subscribe", value: function (e, r) {
                        var i = this;
                        if (void 0 === r && (r = {
                            audio: !!e.capabilities.audio,
                            video: !!e.capabilities.video
                        }), "object" !== D(r)) return Promise.reject(new TypeError("Options should be an object."));
                        if (void 0 === r.audio && (r.audio = !!e.capabilities.audio), void 0 === r.video && (r.video = !!e.capabilities.video), void 0 !== r.audio && "object" !== D(r.audio) && "boolean" != typeof r.audio && null !== r.audio || void 0 !== r.video && "object" !== D(r.video) && "boolean" != typeof r.video && null !== r.video) return Promise.reject(new TypeError("Invalid options type."));
                        if (r.audio && !e.capabilities.audio || r.video && !e.capabilities.video) return Promise.reject(new P.ConferenceError("options.audio/video cannot be true or an object if there is no audio/video track in remote stream."));
                        if (!1 === r.audio && !1 === r.video) return Promise.reject(new P.ConferenceError("Cannot subscribe a stream without audio and video."));
                        this._options = r;
                        var o = {};
                        if (r.audio) {
                            if ("object" === D(r.audio) && Array.isArray(r.audio.codecs) && 0 === r.audio.codecs.length) return Promise.reject(new TypeError("Audio codec cannot be an empty array."));
                            o.audio = {}, o.audio.from = e.id
                        } else o.audio = !1;
                        if (r.video) {
                            if ("object" === D(r.video) && Array.isArray(r.video.codecs) && 0 === r.video.codecs.length) return Promise.reject(new TypeError("Video codec cannot be an empty array."));
                            o.video = {}, o.video.from = e.id, (r.video.resolution || r.video.frameRate || r.video.bitrateMultiplier && 1 !== r.video.bitrateMultiplier || r.video.keyFrameInterval) && (o.video.parameters = {
                                resolution: r.video.resolution,
                                framerate: r.video.frameRate,
                                bitrate: r.video.bitrateMultiplier ? "x" + r.video.bitrateMultiplier.toString() : void 0,
                                keyFrameInterval: r.video.keyFrameInterval
                            })
                        } else o.video = !1;
                        return this._subscribedStream = e, this._signaling.sendSignalingMessage("subscribe", {media: o}).then(function (e) {
                            var t = new A.MessageEvent("id", {message: e.id, origin: i._remoteId});
                            i.dispatchEvent(t), i._internalId = e.id, i._createPeerConnection();
                            var n = {offerToReceiveAudio: !!r.audio, offerToReceiveVideo: !!r.video};
                            "function" == typeof i._pc.addTransceiver && (o.audio && i._pc.addTransceiver("audio", {direction: "recvonly"}), o.video && i._pc.addTransceiver("video", {direction: "recvonly"})), i._pc.createOffer(n).then(function (e) {
                                r && (e.sdp = i._setRtpReceiverOptions(e.sdp, r)), i._pc.setLocalDescription(e).then(function () {
                                    i._signaling.sendSignalingMessage("soac", {id: i._internalId, signaling: e})
                                }, function (e) {
                                    R.default.error("Set local description failed. Message: " + JSON.stringify(e))
                                })
                            }, function (e) {
                                R.default.error("Create offer failed. Error info: " + JSON.stringify(e))
                            }).catch(function (e) {
                                R.default.error("Failed to create offer or set SDP. Message: " + e.message), i._unsubscribe(), i._rejectPromise(e), i._fireEndedEventOnPublicationOrSubscription()
                            })
                        }).catch(function (e) {
                            i._unsubscribe(), i._rejectPromise(e), i._fireEndedEventOnPublicationOrSubscription()
                        }), new Promise(function (e, t) {
                            i._subscribePromise = {resolve: e, reject: t}
                        })
                    }
                }, {
                    key: "_unpublish", value: function () {
                        this._signaling.sendSignalingMessage("unpublish", {id: this._internalId}).catch(function (e) {
                            R.default.warning("MCU returns negative ack for unpublishing, " + e)
                        }), this._pc && "closed" !== this._pc.signalingState && this._pc.close()
                    }
                }, {
                    key: "_unsubscribe", value: function () {
                        this._signaling.sendSignalingMessage("unsubscribe", {id: this._internalId}).catch(function (e) {
                            R.default.warning("MCU returns negative ack for unsubscribing, " + e)
                        }), this._pc && "closed" !== this._pc.signalingState && this._pc.close()
                    }
                }, {
                    key: "_muteOrUnmute", value: function (t, n, r) {
                        var i = this, e = n ? "stream-control" : "subscription-control", o = t ? "pause" : "play";
                        return this._signaling.sendSignalingMessage(e, {id: this._internalId, operation: o, data: r}).then(function () {
                            if (!n) {
                                var e = t ? "mute" : "unmute";
                                i._subscription.dispatchEvent(new A.MuteEvent(e, {kind: r}))
                            }
                        })
                    }
                }, {
                    key: "_applyOptions", value: function (e) {
                        if ("object" !== D(e) || "object" !== D(e.video)) return Promise.reject(new P.ConferenceError("Options should be an object."));
                        var t = {};
                        return t.resolution = e.video.resolution, t.framerate = e.video.frameRate, t.bitrate = e.video.bitrateMultiplier ? "x" + e.video.bitrateMultiplier.toString() : void 0, t.keyFrameInterval = e.video.keyFrameInterval, this._signaling.sendSignalingMessage("subscription-control", {
                            id: this._internalId,
                            operation: "update",
                            data: {video: {parameters: t}}
                        }).then()
                    }
                }, {
                    key: "_onRemoteStreamAdded", value: function (e) {
                        R.default.debug("Remote stream added."), this._subscribedStream ? this._subscribedStream.mediaStream = e.streams[0] : R.default.warning("Received remote stream without subscription.")
                    }
                }, {
                    key: "_onLocalIceCandidate", value: function (e) {
                        e.candidate ? "stable" !== this._pc.signalingState ? this._pendingCandidates.push(e.candidate) : this._sendCandidate(e.candidate) : R.default.debug("Empty candidate.")
                    }
                }, {
                    key: "_fireEndedEventOnPublicationOrSubscription", value: function () {
                        if (!this._ended) {
                            this._ended = !0;
                            var e = new A.OwtEvent("ended");
                            this._publication ? (this._publication.dispatchEvent(e), this._publication.stop()) : this._subscription && (this._subscription.dispatchEvent(e), this._subscription.stop())
                        }
                    }
                }, {
                    key: "_rejectPromise", value: function (e) {
                        e || new P.ConferenceError("Connection failed or closed."), this._publishPromise ? (this._publishPromise.reject(e), this._publishPromise = void 0) : this._subscribePromise && (this._subscribePromise.reject(e), this._subscribePromise = void 0)
                    }
                }, {
                    key: "_onIceConnectionStateChange", value: function (e) {
                        e && e.currentTarget && (R.default.debug("ICE connection state changed to " + e.currentTarget.iceConnectionState), "closed" !== e.currentTarget.iceConnectionState && "failed" !== e.currentTarget.iceConnectionState || (this._rejectPromise(new P.ConferenceError("ICE connection failed or closed.")), this._fireEndedEventOnPublicationOrSubscription()))
                    }
                }, {
                    key: "_sendCandidate", value: function (e) {
                        this._signaling.sendSignalingMessage("soac", {
                            id: this._internalId,
                            signaling: {
                                type: "candidate",
                                candidate: {candidate: "a=" + e.candidate, sdpMid: e.sdpMid, sdpMLineIndex: e.sdpMLineIndex}
                            }
                        })
                    }
                }, {
                    key: "_createPeerConnection", value: function () {
                        var t = this, e = this._config.rtcConfiguration || {};
                        s.isChrome() && (e.sdpSemantics = "unified-plan"), this._pc = new RTCPeerConnection(e), this._pc.onicecandidate = function (e) {
                            t._onLocalIceCandidate.apply(t, [e])
                        }, this._pc.ontrack = function (e) {
                            t._onRemoteStreamAdded.apply(t, [e])
                        }, this._pc.oniceconnectionstatechange = function (e) {
                            t._onIceConnectionStateChange.apply(t, [e])
                        }
                    }
                }, {
                    key: "_getStats", value: function () {
                        return this._pc ? this._pc.getStats() : Promise.reject(new P.ConferenceError("PeerConnection is not available."))
                    }
                }, {
                    key: "_readyHandler", value: function () {
                        var t = this;
                        this._subscribePromise ? (this._subscription = new a.Subscription(this._internalId, function () {
                            t._unsubscribe()
                        }, function () {
                            return t._getStats()
                        }, function (e) {
                            return t._muteOrUnmute(!0, !1, e)
                        }, function (e) {
                            return t._muteOrUnmute(!1, !1, e)
                        }, function (e) {
                            return t._applyOptions(e)
                        }), this._subscribedStream.addEventListener("ended", function () {
                            t._subscription.dispatchEvent("ended", new A.OwtEvent("ended"))
                        }), this._subscribePromise.resolve(this._subscription)) : this._publishPromise && (this._publication = new o.Publication(this._internalId, function () {
                            return t._unpublish(), Promise.resolve()
                        }, function () {
                            return t._getStats()
                        }, function (e) {
                            return t._muteOrUnmute(!0, !0, e)
                        }, function (e) {
                            return t._muteOrUnmute(!1, !0, e)
                        }), this._publishPromise.resolve(this._publication)), this._publishPromise = null, this._subscribePromise = null
                    }
                }, {
                    key: "_sdpHandler", value: function (e) {
                        var a = this;
                        "answer" === e.type && ((this._publication || this._publishPromise) && this._options && (e.sdp = this._setRtpSenderOptions(e.sdp, this._options)), this._pc.setRemoteDescription(e).then(function () {
                            if (0 < a._pendingCandidates.length) {
                                var e = !0, t = !1, n = void 0;
                                try {
                                    for (var r, i = a._pendingCandidates[Symbol.iterator](); !(e = (r = i.next()).done); e = !0) {
                                        var o = r.value;
                                        a._sendCandidate(o)
                                    }
                                } catch (e) {
                                    t = !0, n = e
                                } finally {
                                    try {
                                        e || null == i.return || i.return()
                                    } finally {
                                        if (t) throw n
                                    }
                                }
                            }
                        }, function (e) {
                            R.default.error("Set remote description failed: " + e), a._rejectPromise(e), a._fireEndedEventOnPublicationOrSubscription()
                        }))
                    }
                }, {
                    key: "_errorHandler", value: function (e) {
                        var t = this._publishPromise || this._subscribePromise;
                        if (t) t.reject(new P.ConferenceError(e)); else {
                            var n = this._publication || this._subscription;
                            if (n) {
                                var r = new P.ConferenceError(e), i = new A.ErrorEvent("error", {error: r});
                                n.dispatchEvent(i)
                            } else R.default.warning("Neither publication nor subscription is available.")
                        }
                    }
                }, {
                    key: "_setCodecOrder", value: function (e, t) {
                        if (this._publication || this._publishPromise) {
                            if (t.audio) {
                                var n = Array.from(t.audio, function (e) {
                                    return e.codec.name
                                });
                                e = c.reorderCodecs(e, "audio", n)
                            }
                            if (t.video) {
                                var r = Array.from(t.video, function (e) {
                                    return e.codec.name
                                });
                                e = c.reorderCodecs(e, "video", r)
                            }
                        } else {
                            if (t.audio && t.audio.codecs) {
                                var i = Array.from(t.audio.codecs, function (e) {
                                    return e.name
                                });
                                e = c.reorderCodecs(e, "audio", i)
                            }
                            if (t.video && t.video.codecs) {
                                var o = Array.from(t.video.codecs, function (e) {
                                    return e.name
                                });
                                e = c.reorderCodecs(e, "video", o)
                            }
                        }
                        return e
                    }
                }, {
                    key: "_setMaxBitrate", value: function (e, t) {
                        return "object" === D(t.audio) && (e = c.setMaxBitrate(e, t.audio)), "object" === D(t.video) && (e = c.setMaxBitrate(e, t.video)), e
                    }
                }, {
                    key: "_setRtpSenderOptions", value: function (e, t) {
                        return this._setMaxBitrate(e, t)
                    }
                }, {
                    key: "_setRtpReceiverOptions", value: function (e, t) {
                        return this._setCodecOrder(e, t)
                    }
                }, {
                    key: "_onStreamEvent", value: function (e) {
                        var t, n;
                        this._publication && e.id === this._publication.id ? t = this._publication : this._subscribedStream && e.id === this._subscribedStream.id && (t = this._subscription), t && ("audio.status" === e.data.field ? n = i.TrackKind.AUDIO : "video.status" === e.data.field ? n = i.TrackKind.VIDEO : R.default.warning("Invalid data field for stream update info."), "active" === e.data.value ? t.dispatchEvent(new A.MuteEvent("unmute", {kind: n})) : "inactive" === e.data.value ? t.dispatchEvent(new A.MuteEvent("mute", {kind: n})) : R.default.warning("Invalid data value for stream update info."))
                    }
                }]), r
            }();
            n.ConferencePeerConnectionChannel = f
        }, {
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/mediaformat.js": 6,
            "../base/publication.js": 8,
            "../base/sdputils.js": 9,
            "../base/utils.js": 11,
            "./error.js": 14,
            "./subscription.js": 21
        }],
        13: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.ConferenceClient = void 0;
            var r, d = i(e("../base/event.js")), u = e("./signaling.js"), l = (r = e("../base/logger.js")) && r.__esModule ? r : {default: r},
                p = e("../base/base64.js"), b = e("./error.js"), _ = i(e("../base/utils.js")), f = i(e("../base/stream.js")),
                I = e("./participant.js"), w = e("./info.js"), T = e("./channel.js"), C = e("./mixedstream.js"), E = i(e("./streamutils.js"));

            function i(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            var O = function (e, t) {
                var n = new d.OwtEvent(e, t);
                return n.participant = t.participant, n
            };
            n.ConferenceClient = function (n, e) {
                Object.setPrototypeOf(this, new d.EventDispatcher), n = n || {};
                var m, h, o = this, v = 1, a = e || new u.SioSignaling, g = new Map, y = new Map, r = new Map, i = new Map;

                function S(e) {
                    if ("mixed" === e.type) return new C.RemoteMixedStream(e);
                    var t, n;
                    e.media.audio && (t = e.media.audio.source), e.media.video && (n = e.media.video.source);
                    var r = new f.RemoteStream(e.id, e.info.owner, void 0, new f.StreamSourceInfo(t, n), e.info.attributes);
                    return r.settings = E.convertToPublicationSettings(e.media), r.capabilities = E.convertToSubscriptionCapabilities(e.media), r
                }

                function s(e, t) {
                    return a.send(e, t)
                }

                function c() {
                    var e = Object.create(d.EventDispatcher);
                    e.sendSignalingMessage = s;
                    var t = new T.ConferencePeerConnectionChannel(n, e);
                    return t.addEventListener("id", function (e) {
                        i.set(e.message, t)
                    }), t
                }

                function t() {
                    y.clear(), g.clear()
                }

                a.addEventListener("data", function (e) {
                    !function (t, r) {
                        if ("soac" === t || "progress" === t) {
                            if (!i.has(r.id)) return l.default.warning("Cannot find a channel for incoming data.");
                            i.get(r.id).onMessage(t, r)
                        } else "stream" === t ? "add" === r.status ? function (e) {
                            var t = S(r.data);
                            g.set(t.id, t);
                            var n = new f.StreamEvent("streamadded", {stream: t});
                            o.dispatchEvent(n)
                        }() : "remove" === r.status ? function (e) {
                            if (g.has(e.id)) {
                                var t = g.get(e.id), n = new d.OwtEvent("ended");
                                g.delete(t.id), t.dispatchEvent(n)
                            } else l.default.warning("Cannot find specific remote stream.")
                        }(r) : "update" === r.status && ("audio.status" === r.data.field || "video.status" === r.data.field ? i.forEach(function (e) {
                            e.onMessage(t, r)
                        }) : "activeInput" === r.data.field ? function (e) {
                            if (g.has(e.id)) {
                                var t = g.get(e.id),
                                    n = new C.ActiveAudioInputChangeEvent("activeaudioinputchange", {activeAudioInputStreamId: e.data.value});
                                t.dispatchEvent(n)
                            } else l.default.warning("Cannot find specific remote stream.")
                        }(r) : "video.layout" === r.data.field ? function (e) {
                            if (g.has(e.id)) {
                                var t = g.get(e.id), n = new C.LayoutChangeEvent("layoutchange", {layout: e.data.value});
                                t.dispatchEvent(n)
                            } else l.default.warning("Cannot find specific remote stream.")
                        }(r) : "." === r.data.field ? function (e) {
                            if (g.has(e.id)) {
                                var t = g.get(e.id);
                                t.settings = E.convertToPublicationSettings(e.media), t.capabilities = E.convertToSubscriptionCapabilities(e.media);
                                var n = new d.OwtEvent("updated");
                                t.dispatchEvent(n)
                            } else l.default.warning("Cannot find specific remote stream.")
                        }(r.data.value) : l.default.warning("Unknown stream event from MCU.")) : "text" === t ? (e = r, n = new d.MessageEvent("messagereceived", {
                            message: e.message,
                            origin: e.from,
                            to: e.to
                        }), o.dispatchEvent(n)) : "participant" === t && function (e) {
                            if ("join" === e.action) {
                                e = e.data;
                                var t = new I.Participant(e.id, e.role, e.user);
                                y.set(e.id, t);
                                var n = new O("participantjoined", {participant: t});
                                o.dispatchEvent(n)
                            } else if ("leave" === e.action) {
                                var r = e.data;
                                if (!y.has(r)) return l.default.warning("Received leave message from MCU for an unknown participant.");
                                var i = y.get(r);
                                y.delete(r), i.dispatchEvent(new d.OwtEvent("left"))
                            }
                        }(r);
                        var e, n
                    }(e.message.notification, e.message.data)
                }), a.addEventListener("disconnect", function () {
                    t(), v = 1, o.dispatchEvent(new d.OwtEvent("serverdisconnected"))
                }), Object.defineProperty(this, "info", {
                    configurable: !1, get: function () {
                        return h ? new w.ConferenceInfo(h.id, Array.from(y, function (e) {
                            return e[1]
                        }), Array.from(g, function (e) {
                            return e[1]
                        }), m) : null
                    }
                }), this.join = function (o) {
                    return new Promise(function (f, t) {
                        var e = JSON.parse(p.Base64.decodeBase64(o)), n = !0 === e.secure, r = e.host;
                        if ("string" == typeof r) if (-1 === r.indexOf("http") && (r = n ? "https://" + r : "http://" + r), 1 === v) {
                            v = 2;
                            var i = {token: o, userAgent: _.sysInfo(), protocol: "1.0"};
                            a.connect(r, n, i).then(function (e) {
                                if (v = 3, void 0 !== (h = e.room).streams) {
                                    var t = !0, n = !1, r = void 0;
                                    try {
                                        for (var i, o = h.streams[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                                            var a = i.value;
                                            "mixed" === a.type && (a.viewport = a.info.label), g.set(a.id, S(a))
                                        }
                                    } catch (e) {
                                        n = !0, r = e
                                    } finally {
                                        try {
                                            t || null == o.return || o.return()
                                        } finally {
                                            if (n) throw r
                                        }
                                    }
                                }
                                if (e.room && void 0 !== e.room.participants) {
                                    var s = !0, c = !1, d = void 0;
                                    try {
                                        for (var u, l = e.room.participants[Symbol.iterator](); !(s = (u = l.next()).done); s = !0) {
                                            var p = u.value;
                                            y.set(p.id, new I.Participant(p.id, p.role, p.user)), p.id === e.id && (m = y.get(p.id))
                                        }
                                    } catch (e) {
                                        c = !0, d = e
                                    } finally {
                                        try {
                                            s || null == l.return || l.return()
                                        } finally {
                                            if (c) throw d
                                        }
                                    }
                                }
                                f(new w.ConferenceInfo(e.room.id, Array.from(y.values()), Array.from(g.values()), m))
                            }, function (e) {
                                v = 1, t(new b.ConferenceError(e))
                            })
                        } else t(new b.ConferenceError("connection state invalid")); else t(new b.ConferenceError("Invalid host."))
                    })
                }, this.publish = function (e, t) {
                    return e instanceof f.LocalStream ? r.has(e.mediaStream.id) ? Promise.reject(new b.ConferenceError("Cannot publish a published stream.")) : c().publish(e, t) : Promise.reject(new b.ConferenceError("Invalid stream."))
                }, this.subscribe = function (e, t) {
                    return e instanceof f.RemoteStream ? c().subscribe(e, t) : Promise.reject(new b.ConferenceError("Invalid stream."))
                }, this.send = function (e, t) {
                    return void 0 === t && (t = "all"), s("text", {to: t, message: e})
                }, this.leave = function () {
                    return a.disconnect().then(function () {
                        t(), v = 1
                    })
                }
            }
        }, {
            "../base/base64.js": 1,
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/stream.js": 10,
            "../base/utils.js": 11,
            "./channel.js": 12,
            "./error.js": 14,
            "./info.js": 16,
            "./mixedstream.js": 17,
            "./participant.js": 18,
            "./signaling.js": 19,
            "./streamutils.js": 20
        }],
        14: [function (e, t, n) {
            "use strict";

            function r(e) {
                return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function i(e) {
                var r = "function" == typeof Map ? new Map : void 0;
                return (i = function (e) {
                    if (null === e || (t = e, -1 === Function.toString.call(t).indexOf("[native code]"))) return e;
                    var t;
                    if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
                    if (void 0 !== r) {
                        if (r.has(e)) return r.get(e);
                        r.set(e, n)
                    }

                    function n() {
                        return o(e, arguments, s(this).constructor)
                    }

                    return n.prototype = Object.create(e.prototype, {
                        constructor: {
                            value: n,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), a(n, e)
                })(e)
            }

            function o(e, t, n) {
                return (o = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {
                        })), !0
                    } catch (e) {
                        return !1
                    }
                }() ? Reflect.construct : function (e, t, n) {
                    var r = [null];
                    r.push.apply(r, t);
                    var i = new (Function.bind.apply(e, r));
                    return n && a(i, n.prototype), i
                }).apply(null, arguments)
            }

            function a(e, t) {
                return (a = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function s(e) {
                return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            Object.defineProperty(n, "__esModule", {value: !0}), n.ConferenceError = void 0;
            var c = function (e) {
                function n(e) {
                    return function (e, t) {
                        if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function")
                    }(this), function (e, t) {
                        return !t || "object" !== r(t) && "function" != typeof t ? function (e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e) : t
                    }(this, s(n).call(this, e))
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && a(e, t)
                }(n, i(Error)), n
            }();
            n.ConferenceError = c
        }, {}],
        15: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), Object.defineProperty(n, "ConferenceClient", {
                enumerable: !0, get: function () {
                    return r.ConferenceClient
                }
            }), Object.defineProperty(n, "SioSignaling", {
                enumerable: !0, get: function () {
                    return i.SioSignaling
                }
            });
            var r = e("./client.js"), i = e("./signaling.js")
        }, {"./client.js": 13, "./signaling.js": 19}],
        16: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.ConferenceInfo = void 0, n.ConferenceInfo = function n(e, t, r, i) {
                !function (e, t) {
                    if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function")
                }(this), this.id = e, this.participants = t, this.remoteStreams = r, this.self = i
            }
        }, {}],
        17: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.LayoutChangeEvent = n.ActiveAudioInputChangeEvent = n.RemoteMixedStream = void 0;
            var r = a(e("../base/stream.js")), i = a(e("./streamutils.js")), o = e("../base/event.js");

            function a(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function s(e) {
                return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function c(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function d(e, t) {
                return !t || "object" !== s(t) && "function" != typeof t ? function (e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
            }

            function u(e) {
                return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function l(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && p(e, t)
            }

            function p(e, t) {
                return (p = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            var f = function (e) {
                function n(e) {
                    var t;
                    if (c(this, n), "mixed" !== e.type) throw new TypeError("Not a mixed stream");
                    return (t = d(this, u(n).call(this, e.id, void 0, void 0, new r.StreamSourceInfo("mixed", "mixed")))).settings = i.convertToPublicationSettings(e.media), t.capabilities = new i.convertToSubscriptionCapabilities(e.media), t
                }

                return l(n, r.RemoteStream), n
            }();
            n.RemoteMixedStream = f;
            var m = function (e) {
                function r(e, t) {
                    var n;
                    return c(this, r), (n = d(this, u(r).call(this, e))).activeAudioInputStreamId = t.activeAudioInputStreamId, n
                }

                return l(r, o.OwtEvent), r
            }();
            n.ActiveAudioInputChangeEvent = m;
            var h = function (e) {
                function r(e, t) {
                    var n;
                    return c(this, r), (n = d(this, u(r).call(this, e))).layout = t.layout, n
                }

                return l(r, o.OwtEvent), r
            }();
            n.LayoutChangeEvent = h
        }, {"../base/event.js": 3, "../base/stream.js": 10, "./streamutils.js": 20}],
        18: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Participant = void 0;
            var r = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }(e("../base/event.js"));

            function a(e) {
                return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function s(e) {
                return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function i(e, t) {
                return (i = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function c(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            var o = function (e) {
                function o(e, t, n) {
                    var r, i;
                    return function (e, t) {
                        if (!(e instanceof o)) throw new TypeError("Cannot call a class as a function")
                    }(this), this, r = !(i = s(o).call(this)) || "object" !== a(i) && "function" != typeof i ? c(this) : i, Object.defineProperty(c(c(r)), "id", {
                        configurable: !1,
                        writable: !1,
                        value: e
                    }), Object.defineProperty(c(c(r)), "role", {
                        configurable: !1,
                        writable: !1,
                        value: t
                    }), Object.defineProperty(c(c(r)), "userId", {configurable: !1, writable: !1, value: n}), r
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && i(e, t)
                }(o, r.EventDispatcher), o
            }();
            n.Participant = o
        }, {"../base/event.js": 3}],
        19: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.SioSignaling = void 0;
            var r, i = (r = e("../base/logger.js")) && r.__esModule ? r : {default: r}, a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }(e("../base/event.js")), o = e("./error.js");

            function s(e) {
                return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function c(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            function d(e) {
                return (d = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function u(e, t) {
                return (u = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function l(e, t, n, r) {
                "ok" === e || "success" === e ? n(t) : "error" === e ? r(t) : i.default.error("MCU returns unknown ack.")
            }

            var p = function (e) {
                function n() {
                    var e;
                    return function (e, t) {
                        if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function")
                    }(this), (e = function (e, t) {
                        return !t || "object" !== s(t) && "function" != typeof t ? function (e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e) : t
                    }(this, d(n).call(this)))._socket = null, e._loggedIn = !1, e._reconnectTimes = 0, e._reconnectionTicket = null, e
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && u(e, t)
                }(n, a.EventDispatcher), c(n.prototype, [{
                    key: "connect", value: function (e, t, i) {
                        var o = this;
                        return new Promise(function (n, r) {
                            o._socket = io(e, {
                                reconnection: !0,
                                reconnectionAttempts: 5,
                                "force new connection": !0
                            }), ["participant", "text", "stream", "progress"].forEach(function (t) {
                                o._socket.on(t, function (e) {
                                    o.dispatchEvent(new a.MessageEvent("data", {message: {notification: t, data: e}}))
                                })
                            }), o._socket.on("reconnecting", function () {
                                o._reconnectTimes++
                            }), o._socket.on("reconnect_failed", function () {
                                5 <= o._reconnectTimes && o.dispatchEvent(new a.OwtEvent("disconnect"))
                            }), o._socket.on("drop", function () {
                                o._reconnectTimes = 5
                            }), o._socket.on("disconnect", function () {
                                5 <= o._reconnectTimes && (o._loggedIn = !1, o.dispatchEvent(new a.OwtEvent("disconnect")))
                            }), o._socket.emit("login", i, function (e, t) {
                                "ok" === e && (o._loggedIn = !0, o._reconnectionTicket = t.reconnectionTicket, o._socket.on("connect", function () {
                                    o._socket.emit("relogin", o._reconnectionTicket, function (e, t) {
                                        "ok" === e ? (o._reconnectTimes = 0, o._reconnectionTicket = t) : o.dispatchEvent(new a.OwtEvent("disconnect"))
                                    })
                                })), l(e, t, n, r)
                            })
                        })
                    }
                }, {
                    key: "disconnect", value: function () {
                        var i = this;
                        return !this._socket || this._socket.disconnected ? Promise.reject(new o.ConferenceError("Portal is not connected.")) : new Promise(function (n, r) {
                            i._socket.emit("logout", function (e, t) {
                                i._reconnectTimes = 5, i._socket.disconnect(), l(e, t, n, r)
                            })
                        })
                    }
                }, {
                    key: "send", value: function (e, t) {
                        var i = this;
                        return new Promise(function (n, r) {
                            i._socket.emit(e, t, function (e, t) {
                                l(e, t, n, r)
                            })
                        })
                    }
                }]), n
            }();
            n.SioSignaling = p
        }, {"../base/event.js": 3, "../base/logger.js": 5, "./error.js": 14}],
        20: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.convertToPublicationSettings = function (e) {
                var t, n, r, i, o, a, s, c;
                return e.audio && (e.audio.format && (n = new T.AudioCodecParameters(e.audio.format.codec, e.audio.format.channelNum, e.audio.format.sampleRate)), t = new d.AudioPublicationSettings(n)), e.video && (e.video.format && (i = new T.VideoCodecParameters(e.video.format.codec, e.video.format.profile)), e.video.parameters && (e.video.parameters.resolution && (o = new w.Resolution(e.video.parameters.resolution.width, e.video.parameters.resolution.height)), a = e.video.parameters.framerate, s = 1e3 * e.video.parameters.bitrate, c = e.video.parameters.keyFrameInterval), r = new d.VideoPublicationSettings(i, o, a, s, c)), new d.PublicationSettings(t, r)
            }, n.convertToSubscriptionCapabilities = function (e) {
                var t, n;
                if (e.audio) {
                    var r = [];
                    if (e.audio && e.audio.format && r.push(new T.AudioCodecParameters(e.audio.format.codec, e.audio.format.channelNum, e.audio.format.sampleRate)), e.audio && e.audio.optional && e.audio.optional.format) {
                        var i = !0, o = !1, a = void 0;
                        try {
                            for (var s, c = e.audio.optional.format[Symbol.iterator](); !(i = (s = c.next()).done); i = !0) {
                                var d = s.value, u = new T.AudioCodecParameters(d.codec, d.channelNum, d.sampleRate);
                                r.push(u)
                            }
                        } catch (e) {
                            o = !0, a = e
                        } finally {
                            try {
                                i || null == c.return || c.return()
                            } finally {
                                if (o) throw a
                            }
                        }
                    }
                    r.sort(), t = new C.AudioSubscriptionCapabilities(r)
                }
                if (e.video) {
                    var l = [];
                    if (e.video && e.video.format && l.push(new T.VideoCodecParameters(e.video.format.codec, e.video.format.profile)), e.video && e.video.optional && e.video.optional.format) {
                        var p = !0, f = !1, m = void 0;
                        try {
                            for (var h, v = e.video.optional.format[Symbol.iterator](); !(p = (h = v.next()).done); p = !0) {
                                var g = h.value, y = new T.VideoCodecParameters(g.codec, g.profile);
                                l.push(y)
                            }
                        } catch (e) {
                            f = !0, m = e
                        } finally {
                            try {
                                p || null == v.return || v.return()
                            } finally {
                                if (f) throw m
                            }
                        }
                    }
                    l.sort();
                    var S = Array.from(e.video.optional.parameters.resolution, function (e) {
                        return new w.Resolution(e.width, e.height)
                    });
                    e.video && e.video.parameters && e.video.parameters.resolution && S.push(new w.Resolution(e.video.parameters.resolution.width, e.video.parameters.resolution.height)), S.sort(O);
                    var b = Array.from(e.video.optional.parameters.bitrate, function (e) {
                        return "string" == typeof (t = e) && t.startsWith("x") ? Number.parseFloat(t.replace(/^x/, "")) : (L.Logger.warning("Invalid bitrate multiplier input."), 0);
                        var t
                    });
                    b.push(1), b.sort(E);
                    var _ = JSON.parse(JSON.stringify(e.video.optional.parameters.framerate));
                    e.video && e.video.parameters && e.video.parameters.framerate && _.push(e.video.parameters.framerate), _.sort(E);
                    var I = JSON.parse(JSON.stringify(e.video.optional.parameters.keyFrameInterval));
                    e.video && e.video.parameters && e.video.parameters.keyFrameInterval && I.push(e.video.parameters.keyFrameInterval), I.sort(E), n = new C.VideoSubscriptionCapabilities(l, S, _, b, I)
                }
                return new C.SubscriptionCapabilities(t, n)
            };
            var d = r(e("../base/publication.js")), w = r(e("../base/mediaformat.js")), T = r(e("../base/codec.js")), C = r(e("./subscription.js"));

            function r(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function E(e, t) {
                return e - t
            }

            function O(e, t) {
                return e.width !== t.width ? e.width - t.width : e.height - t.height
            }
        }, {"../base/codec.js": 2, "../base/mediaformat.js": 6, "../base/publication.js": 8, "./subscription.js": 21}],
        21: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Subscription = n.SubscriptionUpdateOptions = n.VideoSubscriptionUpdateOptions = n.SubscribeOptions = n.VideoSubscriptionConstraints = n.AudioSubscriptionConstraints = n.SubscriptionCapabilities = n.VideoSubscriptionCapabilities = n.AudioSubscriptionCapabilities = void 0, i(e("../base/mediaformat.js")), i(e("../base/codec.js"));
            var r = e("../base/event.js");

            function i(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function d(e) {
                return (d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function u(e) {
                return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            function o(e, t) {
                return (o = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function l(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }

            function p(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            n.AudioSubscriptionCapabilities = function e(t) {
                p(this, e), this.codecs = t
            }, n.VideoSubscriptionCapabilities = function e(t, n, r, i, o) {
                p(this, e), this.codecs = t, this.resolutions = n, this.frameRates = r, this.bitrateMultipliers = i, this.keyFrameIntervals = o
            }, n.SubscriptionCapabilities = function e(t, n) {
                p(this, e), this.audio = t, this.video = n
            }, n.AudioSubscriptionConstraints = function e(t) {
                p(this, e), this.codecs = t
            }, n.VideoSubscriptionConstraints = function e(t, n, r, i, o) {
                p(this, e), this.codecs = t, this.resolution = n, this.frameRate = r, this.bitrateMultiplier = i, this.keyFrameInterval = o
            }, n.SubscribeOptions = function e(t, n) {
                p(this, e), this.audio = t, this.video = n
            }, n.VideoSubscriptionUpdateOptions = function e() {
                p(this, e), this.resolution = void 0, this.frameRate = void 0, this.bitrateMultipliers = void 0, this.keyFrameInterval = void 0
            }, n.SubscriptionUpdateOptions = function e() {
                p(this, e), this.video = void 0
            };
            var a = function (e) {
                function c(e, t, n, r, i, o) {
                    var a, s;
                    if (p(this, c), this, a = !(s = u(c).call(this)) || "object" !== d(s) && "function" != typeof s ? l(this) : s, !e) throw new TypeError("ID cannot be null or undefined.");
                    return Object.defineProperty(l(l(a)), "id", {
                        configurable: !1,
                        writable: !1,
                        value: e
                    }), a.stop = t, a.getStats = n, a.mute = r, a.unmute = i, a.applyOptions = o, a
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && o(e, t)
                }(c, r.EventDispatcher), c
            }();
            n.Subscription = a
        }, {"../base/codec.js": 2, "../base/event.js": 3, "../base/mediaformat.js": 6}],
        22: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.Conference = n.P2P = n.Base = void 0;
            var r = a(e("./base/export.js")), i = a(e("./p2p/export.js")), o = a(e("./conference/export.js"));

            function a(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            var s = r;
            n.Base = s;
            var c = i;
            n.P2P = c;
            var d = o;
            n.Conference = d
        }, {"./base/export.js": 4, "./conference/export.js": 15, "./p2p/export.js": 24}],
        23: [function (e, t, n) {
            "use strict";

            function i(e) {
                return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function o(e) {
                var r = "function" == typeof Map ? new Map : void 0;
                return (o = function (e) {
                    if (null === e || (t = e, -1 === Function.toString.call(t).indexOf("[native code]"))) return e;
                    var t;
                    if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
                    if (void 0 !== r) {
                        if (r.has(e)) return r.get(e);
                        r.set(e, n)
                    }

                    function n() {
                        return a(e, arguments, c(this).constructor)
                    }

                    return n.prototype = Object.create(e.prototype, {
                        constructor: {
                            value: n,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), s(n, e)
                })(e)
            }

            function a(e, t, n) {
                return (a = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {
                        })), !0
                    } catch (e) {
                        return !1
                    }
                }() ? Reflect.construct : function (e, t, n) {
                    var r = [null];
                    r.push.apply(r, t);
                    var i = new (Function.bind.apply(e, r));
                    return n && s(i, n.prototype), i
                }).apply(null, arguments)
            }

            function s(e, t) {
                return (s = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function c(e) {
                return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            Object.defineProperty(n, "__esModule", {value: !0}), n.getErrorByCode = function (e) {
                return {
                    2100: r.P2P_CONN_SERVER_UNKNOWN,
                    2101: r.P2P_CONN_SERVER_UNAVAILABLE,
                    2102: r.P2P_CONN_SERVER_BUSY,
                    2103: r.P2P_CONN_SERVER_NOT_SUPPORTED,
                    2110: r.P2P_CONN_CLIENT_UNKNOWN,
                    2111: r.P2P_CONN_CLIENT_NOT_INITIALIZED,
                    2120: r.P2P_CONN_AUTH_UNKNOWN,
                    2121: r.P2P_CONN_AUTH_FAILED,
                    2201: r.P2P_MESSAGING_TARGET_UNREACHABLE,
                    2400: r.P2P_CLIENT_UNKNOWN,
                    2401: r.P2P_CLIENT_UNSUPPORTED_METHOD,
                    2402: r.P2P_CLIENT_ILLEGAL_ARGUMENT,
                    2403: r.P2P_CLIENT_INVALID_STATE,
                    2404: r.P2P_CLIENT_NOT_ALLOWED,
                    2500: r.P2P_WEBRTC_UNKNOWN,
                    2501: r.P2P_WEBRTC_SDP
                }[e]
            }, n.P2PError = n.errors = void 0;
            var r = {
                P2P_CONN_SERVER_UNKNOWN: {code: 2100, message: "Server unknown error."},
                P2P_CONN_SERVER_UNAVAILABLE: {code: 2101, message: "Server is unavaliable."},
                P2P_CONN_SERVER_BUSY: {code: 2102, message: "Server is too busy."},
                P2P_CONN_SERVER_NOT_SUPPORTED: {code: 2103, message: "Method has not been supported by server."},
                P2P_CONN_CLIENT_UNKNOWN: {code: 2110, message: "Client unknown error."},
                P2P_CONN_CLIENT_NOT_INITIALIZED: {code: 2111, message: "Connection is not initialized."},
                P2P_CONN_AUTH_UNKNOWN: {code: 2120, message: "Authentication unknown error."},
                P2P_CONN_AUTH_FAILED: {code: 2121, message: "Wrong username or token."},
                P2P_MESSAGING_TARGET_UNREACHABLE: {code: 2201, message: "Remote user cannot be reached."},
                P2P_CLIENT_DENIED: {code: 2202, message: "User is denied."},
                P2P_CLIENT_UNKNOWN: {code: 2400, message: "Unknown errors."},
                P2P_CLIENT_UNSUPPORTED_METHOD: {code: 2401, message: "This method is unsupported in current browser."},
                P2P_CLIENT_ILLEGAL_ARGUMENT: {code: 2402, message: "Illegal argument."},
                P2P_CLIENT_INVALID_STATE: {code: 2403, message: "Invalid peer state."},
                P2P_CLIENT_NOT_ALLOWED: {code: 2404, message: "Remote user is not allowed."},
                P2P_WEBRTC_UNKNOWN: {code: 2500, message: "WebRTC error."},
                P2P_WEBRTC_SDP: {code: 2502, message: "SDP error."}
            };
            n.errors = r;
            var d = function (e) {
                function r(e, t) {
                    var n;
                    return function (e, t) {
                        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
                    }(this), (n = function (e, t) {
                        return !t || "object" !== i(t) && "function" != typeof t ? function (e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e) : t
                    }(this, c(r).call(this, t))).code = "number" == typeof e ? e : e.code, n
                }

                return function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && s(e, t)
                }(r, o(Error)), r
            }();
            n.P2PError = d
        }, {}],
        24: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), Object.defineProperty(n, "P2PClient", {
                enumerable: !0, get: function () {
                    return i.default
                }
            }), Object.defineProperty(n, "P2PError", {
                enumerable: !0, get: function () {
                    return o.P2PError
                }
            });
            var r, i = (r = e("./p2pclient.js")) && r.__esModule ? r : {default: r}, o = e("./error.js")
        }, {"./error.js": 23, "./p2pclient.js": 25}],
        25: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.default = void 0;
            var l = i(e("../base/logger.js")), p = e("../base/event.js"), f = (r(e("../base/utils.js")), r(e("./error.js"))),
                m = i(e("./peerconnection-channel.js"));

            function r(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function i(e) {
                return e && e.__esModule ? e : {default: e}
            }

            n.default = function (e, t) {
                Object.setPrototypeOf(this, new p.EventDispatcher);
                var r, i = e, o = t, a = new Map, s = this, c = 1;
                o.onMessage = function (e, t) {
                    l.default.debug("Received signaling message from " + e + ": " + t);
                    var n = JSON.parse(t);
                    "chat-closed" !== n.type ? 0 <= s.allowedRemoteIds.indexOf(e) ? u(e).onMessage(n) : d(e, "chat-closed", f.errors.P2P_CLIENT_DENIED) : a.has(e) && (u(e).onMessage(n), a.delete(e))
                }, o.onServerDisconnected = function () {
                    c = 1, s.dispatchEvent(new p.OwtEvent("serverdisconnected"))
                }, this.allowedRemoteIds = [], this.connect = function (e) {
                    return 1 !== c ? (l.default.warning("Invalid connection state: " + c), Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE))) : (c = 2, new Promise(function (t, n) {
                        o.connect(e).then(function (e) {
                            c = 3, t(r = e)
                        }, function (e) {
                            n(new f.P2PError(f.getErrorByCode(e)))
                        })
                    }))
                }, this.disconnect = function () {
                    1 != c && (a.forEach(function (e) {
                        e.stop()
                    }), a.clear(), o.disconnect())
                }, this.publish = function (e, t) {
                    return 3 !== c ? Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE, "P2P Client is not connected to signaling channel.")) : this.allowedRemoteIds.indexOf(e) < 0 ? Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_NOT_ALLOWED)) : Promise.resolve(u(e).publish(t))
                }, this.send = function (e, t) {
                    return 3 !== c ? Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE, "P2P Client is not connected to signaling channel.")) : this.allowedRemoteIds.indexOf(e) < 0 ? Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_NOT_ALLOWED)) : Promise.resolve(u(e).send(t))
                }, this.stop = function (e) {
                    a.has(e) ? (a.get(e).stop(), a.delete(e)) : l.default.warning("No PeerConnection between current endpoint and specific remote endpoint.")
                }, this.getStats = function (e) {
                    return a.has(e) ? a.get(e).getStats() : Promise.reject(new f.P2PError(f.errors.P2P_CLIENT_INVALID_STATE, "No PeerConnection between current endpoint and specific remote endpoint."))
                };
                var d = function (e, t, n) {
                    var r = {type: t};
                    return n && (r.data = n), o.send(e, JSON.stringify(r)).catch(function (e) {
                        if ("number" == typeof e) throw f.getErrorByCode(e)
                    })
                }, u = function (e) {
                    if (!a.has(e)) {
                        var t = Object.create(p.EventDispatcher);
                        t.sendSignalingMessage = d;
                        var n = new m.default(i, r, e, t);
                        n.addEventListener("streamadded", function (e) {
                            s.dispatchEvent(e)
                        }), n.addEventListener("messagereceived", function (e) {
                            s.dispatchEvent(e)
                        }), n.addEventListener("ended", function () {
                            a.delete(e)
                        }), a.set(e, n)
                    }
                    return a.get(e)
                }
            }
        }, {"../base/event.js": 3, "../base/logger.js": 5, "../base/utils.js": 11, "./error.js": 23, "./peerconnection-channel.js": 26}],
        26: [function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", {value: !0}), n.default = n.P2PPeerConnectionChannelEvent = void 0;
            var r, k = (r = e("../base/logger.js")) && r.__esModule ? r : {default: r}, R = e("../base/event.js"), c = e("../base/publication.js"),
                s = o(e("../base/utils.js")), A = o(e("./error.js")), u = o(e("../base/stream.js")), i = o(e("../base/sdputils.js"));

            function o(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
                    var r = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, n) : {};
                    r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]
                }
                return t.default = e, t
            }

            function P(e, t) {
                return function (e) {
                    if (Array.isArray(e)) return e
                }(e) || function (e, t) {
                    var n = [], r = !0, i = !1, o = void 0;
                    try {
                        for (var a, s = e[Symbol.iterator](); !(r = (a = s.next()).done) && (n.push(a.value), !t || n.length !== t); r = !0) ;
                    } catch (e) {
                        i = !0, o = e
                    } finally {
                        try {
                            r || null == s.return || s.return()
                        } finally {
                            if (i) throw o
                        }
                    }
                    return n
                }(e, t) || function () {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }()
            }

            function a(e) {
                return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }

            function d(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            function l(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function p(e, t) {
                return !t || "object" !== a(t) && "function" != typeof t ? function (e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
            }

            function f(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {constructor: {value: e, writable: !0, configurable: !0}}), t && v(e, t)
            }

            function m(e) {
                var r = "function" == typeof Map ? new Map : void 0;
                return (m = function (e) {
                    if (null === e || (t = e, -1 === Function.toString.call(t).indexOf("[native code]"))) return e;
                    var t;
                    if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
                    if (void 0 !== r) {
                        if (r.has(e)) return r.get(e);
                        r.set(e, n)
                    }

                    function n() {
                        return h(e, arguments, g(this).constructor)
                    }

                    return n.prototype = Object.create(e.prototype, {
                        constructor: {
                            value: n,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), v(n, e)
                })(e)
            }

            function h(e, t, n) {
                return (h = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {
                        })), !0
                    } catch (e) {
                        return !1
                    }
                }() ? Reflect.construct : function (e, t, n) {
                    var r = [null];
                    r.push.apply(r, t);
                    var i = new (Function.bind.apply(e, r));
                    return n && v(i, n.prototype), i
                }).apply(null, arguments)
            }

            function v(e, t) {
                return (v = Object.setPrototypeOf || function (e, t) {
                    return e.__proto__ = t, e
                })(e, t)
            }

            function g(e) {
                return (g = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                })(e)
            }

            var y = function (e) {
                function n(e) {
                    var t;
                    return l(this, n), (t = p(this, g(n).call(this, e))).stream = e.stream, t
                }

                return f(n, m(Event)), n
            }();
            n.P2PPeerConnectionChannelEvent = y;
            var S = "message", D = "chat-closed", b = "chat-negotiation-needed", _ = "chat-track-sources", I = "chat-stream-info", w = "chat-signal",
                T = "chat-tracks-added", C = "chat-tracks-removed", E = "chat-data-received", O = "chat-ua",
                N = {offerToReceiveAudio: !0, offerToReceiveVideo: !0}, M = s.sysInfo(), x = function (e) {
                    function o(e, t, n, r) {
                        var i;
                        return l(this, o), (i = p(this, g(o).call(this)))._config = e, i._localId = t, i._remoteId = n, i._signaling = r, i._pc = null, i._publishedStreams = new Map, i._pendingStreams = [], i._publishingStreams = [], i._pendingUnpublishStreams = [], i._remoteStreamInfo = new Map, i._remoteStreams = [], i._remoteTrackSourceInfo = new Map, i._publishPromises = new Map, i._unpublishPromises = new Map, i._publishingStreamTracks = new Map, i._publishedStreamTracks = new Map, i._isNegotiationNeeded = !1, i._negotiating = !1, i._remoteSideSupportsRemoveStream = !0, i._remoteSideSupportsPlanB = !0, i._remoteSideSupportsUnifiedPlan = !0, i._remoteIceCandidates = [], i._dataChannels = new Map, i._pendingMessages = [], i._dataSeq = 1, i._sendDataPromises = new Map, i._addedTrackIds = [], i._isCaller = !0, i._infoSent = !1, i._disposed = !1, i._createPeerConnection(), i
                    }

                    return f(o, R.EventDispatcher), d(o.prototype, [{
                        key: "publish", value: function (r) {
                            var i = this;
                            return r instanceof u.LocalStream ? this._publishedStreams.has(r) ? Promise.reject(new A.P2PError(A.errors.P2P_CLIENT_ILLEGAL_ARGUMENT, "Duplicated stream.")) : this._areAllTracksEnded(r.mediaStream) ? Promise.reject(new A.P2PError(A.errors.P2P_CLIENT_INVALID_STATE, "All tracks are ended.")) : Promise.all([this._sendClosedMsgIfNecessary(), this._sendSysInfoIfNecessary(), this._sendStreamInfo(r)]).then(function () {
                                return new Promise(function (e, t) {
                                    i._pc.addStream(r.mediaStream), i._publishingStreams.push(r);
                                    var n = Array.from(r.mediaStream.getTracks(), function (e) {
                                        return e.id
                                    });
                                    i._publishingStreamTracks.set(r.mediaStream.id, n), i._publishPromises.set(r.mediaStream.id, {
                                        resolve: e,
                                        reject: t
                                    }), i._dataChannels.has(S) || i._createDataChannel(S)
                                })
                            }) : Promise.reject(new TypeError("Invalid stream."))
                        }
                    }, {
                        key: "send", value: function (e) {
                            var n = this;
                            if ("string" != typeof e) return Promise.reject(new TypeError("Invalid message."));
                            var r = {id: this._dataSeq++, data: e}, t = new Promise(function (e, t) {
                                n._sendDataPromises.set(r.id, {resolve: e, reject: t})
                            });
                            return this._dataChannels.has(S) || this._createDataChannel(S), this._sendClosedMsgIfNecessary().catch(function (e) {
                                k.default.debug("Failed to send closed message." + e.message)
                            }), this._sendSysInfoIfNecessary().catch(function (e) {
                                k.default.debug("Failed to send sysInfo." + e.message)
                            }), "open" === this._dataChannels.get(S).readyState ? this._dataChannels.get(S).send(JSON.stringify(r)) : this._pendingMessages.push(r), t
                        }
                    }, {
                        key: "stop", value: function () {
                            this._stop(void 0, !0)
                        }
                    }, {
                        key: "getStats", value: function (e) {
                            var t = this;
                            if (this._pc) {
                                if (void 0 === e) return this._pc.getStats();
                                var n = [];
                                return Promise.all([e.getTracks().forEach(function (e) {
                                    t._getStats(e, n)
                                })]).then(function () {
                                    return new Promise(function (e, t) {
                                        e(n)
                                    })
                                })
                            }
                            return Promise.reject(new A.P2PError(A.errors.P2P_CLIENT_INVALID_STATE))
                        }
                    }, {
                        key: "_getStats", value: function (e, t) {
                            return this._pc.getStats(e).then(function (e) {
                                t.push(e)
                            })
                        }
                    }, {
                        key: "onMessage", value: function (e) {
                            this._SignalingMesssageHandler(e)
                        }
                    }, {
                        key: "_sendSdp", value: function (e) {
                            return this._signaling.sendSignalingMessage(this._remoteId, w, e)
                        }
                    }, {
                        key: "_sendSignalingMessage", value: function (e, t) {
                            return this._signaling.sendSignalingMessage(this._remoteId, e, t)
                        }
                    }, {
                        key: "_SignalingMesssageHandler", value: function (e) {
                            switch (k.default.debug("Channel received message: " + e), e.type) {
                                case O:
                                    this._handleRemoteCapability(e.data), this._sendSysInfoIfNecessary();
                                    break;
                                case _:
                                    this._trackSourcesHandler(e.data);
                                    break;
                                case I:
                                    this._streamInfoHandler(e.data);
                                    break;
                                case w:
                                    this._sdpHandler(e.data);
                                    break;
                                case T:
                                    this._tracksAddedHandler(e.data);
                                    break;
                                case C:
                                    this._tracksRemovedHandler(e.data);
                                    break;
                                case E:
                                    this._dataReceivedHandler(e.data);
                                    break;
                                case D:
                                    this._chatClosedHandler(e.data);
                                    break;
                                case b:
                                    this._doNegotiate();
                                    break;
                                default:
                                    k.default.error("Invalid signaling message received. Type: " + e.type)
                            }
                        }
                    }, {
                        key: "_tracksAddedHandler", value: function (e) {
                            var o = this, t = !0, n = !1, r = void 0;
                            try {
                                for (var a, i = function () {
                                    var i = a.value;
                                    o._publishingStreamTracks.forEach(function (e, r) {
                                        for (var t = 0; t < e.length; t++) e[t] === i && (o._publishedStreamTracks.has(r) || o._publishedStreamTracks.set(r, []), o._publishedStreamTracks.get(r).push(e[t]), e.splice(t, 1)), 0 != e.length || function () {
                                            if (!o._publishPromises.has(r)) return k.default.warning("Cannot find the promise for publishing " + r);
                                            var e = o._publishingStreams.findIndex(function (e) {
                                                return e.mediaStream.id == r
                                            }), t = o._publishingStreams[e];
                                            o._publishingStreams.splice(e, 1);
                                            var n = new c.Publication(i, function () {
                                                o._unpublish(t).then(function () {
                                                    n.dispatchEvent(new R.OwtEvent("ended"))
                                                }, function (e) {
                                                    k.default.debug("Something wrong happened during stopping a publication. " + e.message)
                                                })
                                            }, function () {
                                                return t && t.mediaStream ? o.getStats(t.mediaStream) : Promise.reject(new A.P2PError(A.errors.P2P_CLIENT_INVALID_STATE, "Publication is not available."))
                                            });
                                            o._publishedStreams.set(t, n), o._publishPromises.get(r).resolve(n), o._publishPromises.delete(r)
                                        }()
                                    })
                                }, s = e[Symbol.iterator](); !(t = (a = s.next()).done); t = !0) i()
                            } catch (e) {
                                n = !0, r = e
                            } finally {
                                try {
                                    t || null == s.return || s.return()
                                } finally {
                                    if (n) throw r
                                }
                            }
                        }
                    }, {
                        key: "_tracksRemovedHandler", value: function (e) {
                            var t = this, n = !0, r = !1, i = void 0;
                            try {
                                for (var o, a = function () {
                                    var r = o.value;
                                    t._publishedStreamTracks.forEach(function (e, t) {
                                        for (var n = 0; n < e.length; n++) e[n] === r && e.splice(n, 1)
                                    })
                                }, s = e[Symbol.iterator](); !(n = (o = s.next()).done); n = !0) a()
                            } catch (e) {
                                r = !0, i = e
                            } finally {
                                try {
                                    n || null == s.return || s.return()
                                } finally {
                                    if (r) throw i
                                }
                            }
                        }
                    }, {
                        key: "_dataReceivedHandler", value: function (e) {
                            this._sendDataPromises.has(e) ? this._sendDataPromises.get(e).resolve() : k.default.warning("Received unknown data received message. ID: " + e)
                        }
                    }, {
                        key: "_sdpHandler", value: function (e) {
                            "offer" === e.type ? this._onOffer(e) : "answer" === e.type ? this._onAnswer(e) : "candidates" === e.type && this._onRemoteIceCandidate(e)
                        }
                    }, {
                        key: "_trackSourcesHandler", value: function (e) {
                            var t = !0, n = !1, r = void 0;
                            try {
                                for (var i, o = e[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                                    var a = i.value;
                                    this._remoteTrackSourceInfo.set(a.id, a.source)
                                }
                            } catch (e) {
                                n = !0, r = e
                            } finally {
                                try {
                                    t || null == o.return || o.return()
                                } finally {
                                    if (n) throw r
                                }
                            }
                        }
                    }, {
                        key: "_streamInfoHandler", value: function (e) {
                            e ? this._remoteStreamInfo.set(e.id, {
                                source: e.source,
                                attributes: e.attributes,
                                stream: null,
                                mediaStream: null,
                                trackIds: e.tracks
                            }) : k.default.warning("Unexpected stream info.")
                        }
                    }, {
                        key: "_chatClosedHandler", value: function (e) {
                            this._disposed = !0, this._stop(e, !1)
                        }
                    }, {
                        key: "_onOffer", value: function (e) {
                            var t = this;
                            k.default.debug("About to set remote description. Signaling state: " + this._pc.signalingState), e.sdp = this._setRtpSenderOptions(e.sdp, this._config), s.isFirefox() && (e.sdp = this._setCodecOrder(e.sdp));
                            var n = new RTCSessionDescription(e);
                            this._pc.setRemoteDescription(n).then(function () {
                                t._createAndSendAnswer()
                            }, function (e) {
                                k.default.debug("Set remote description failed. Message: " + e.message), t._stop(e, !0)
                            })
                        }
                    }, {
                        key: "_onAnswer", value: function (e) {
                            var t = this;
                            k.default.debug("About to set remote description. Signaling state: " + this._pc.signalingState), e.sdp = this._setRtpSenderOptions(e.sdp, this._config);
                            var n = new RTCSessionDescription(e);
                            this._pc.setRemoteDescription(new RTCSessionDescription(n)).then(function () {
                                k.default.debug("Set remote descripiton successfully."), t._drainPendingMessages()
                            }, function (e) {
                                k.default.debug("Set remote description failed. Message: " + e.message), t._stop(e, !0)
                            })
                        }
                    }, {
                        key: "_onLocalIceCandidate", value: function (e) {
                            e.candidate ? this._sendSdp({
                                type: "candidates",
                                candidate: e.candidate.candidate,
                                sdpMid: e.candidate.sdpMid,
                                sdpMLineIndex: e.candidate.sdpMLineIndex
                            }).catch(function (e) {
                                k.default.warning("Failed to send candidate.")
                            }) : k.default.debug("Empty candidate.")
                        }
                    }, {
                        key: "_onRemoteTrackAdded", value: function (e) {
                            k.default.debug("Remote track added.");
                            var t = !0, n = !1, r = void 0;
                            try {
                                for (var i, o = e.streams[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                                    var a = i.value;
                                    if (!this._remoteStreamInfo.has(a.id)) return void k.default.warning("Missing stream info.");
                                    this._remoteStreamInfo.get(a.id).stream || this._setStreamToRemoteStreamInfo(a)
                                }
                            } catch (e) {
                                n = !0, r = e
                            } finally {
                                try {
                                    t || null == o.return || o.return()
                                } finally {
                                    if (n) throw r
                                }
                            }
                            "connected" === this._pc.iceConnectionState || "completed" === this._pc.iceConnectionState ? this._checkIceConnectionStateAndFireEvent() : this._addedTrackIds.concat(e.track.id)
                        }
                    }, {
                        key: "_onRemoteStreamAdded", value: function (t) {
                            if (k.default.debug("Remote stream added."), this._remoteStreamInfo.has(t.stream.id)) {
                                "connected" === this._pc.iceConnectionState || "completed" === this._pc.iceConnectionState ? this._sendSignalingMessage(T, this._remoteStreamInfo.get(t.stream.id).trackIds) : this._addedTrackIds = this._addedTrackIds.concat(this._remoteStreamInfo.get(t.stream.id).trackIds);
                                var e = this._remoteStreamInfo.get(t.stream.id).source.audio, n = this._remoteStreamInfo.get(t.stream.id).source.video,
                                    r = new u.StreamSourceInfo(e, n);
                                s.isSafari() && (r.audio || t.stream.getAudioTracks().forEach(function (e) {
                                    t.stream.removeTrack(e)
                                }), r.video || t.stream.getVideoTracks().forEach(function (e) {
                                    t.stream.removeTrack(e)
                                }));
                                var i = this._remoteStreamInfo.get(t.stream.id).attributes,
                                    o = new u.RemoteStream(void 0, this._remoteId, t.stream, r, i);
                                if (o) {
                                    this._remoteStreams.push(o);
                                    var a = new u.StreamEvent("streamadded", {stream: o});
                                    this.dispatchEvent(a)
                                }
                            } else k.default.warning("Cannot find source info for stream " + t.stream.id)
                        }
                    }, {
                        key: "_onRemoteStreamRemoved", value: function (t) {
                            k.default.debug("Remote stream removed.");
                            var e = this._remoteStreams.findIndex(function (e) {
                                return e.mediaStream.id === t.stream.id
                            });
                            if (-1 !== e) {
                                var n = this._remoteStreams[e];
                                this._streamRemoved(n), this._remoteStreams.splice(e, 1)
                            }
                        }
                    }, {
                        key: "_onNegotiationneeded", value: function () {
                            k.default.debug("On negotiation needed."), "stable" === this._pc.signalingState && !1 === this._negotiating ? (this._negotiating = !0, this._doNegotiate(), this._isNegotiationNeeded = !1) : this._isNegotiationNeeded = !0
                        }
                    }, {
                        key: "_onRemoteIceCandidate", value: function (e) {
                            var t = new RTCIceCandidate({candidate: e.candidate, sdpMid: e.sdpMid, sdpMLineIndex: e.sdpMLineIndex});
                            this._pc.remoteDescription && "" !== this._pc.remoteDescription.sdp ? (k.default.debug("Add remote ice candidates."), this._pc.addIceCandidate(t).catch(function (e) {
                                k.default.warning("Error processing ICE candidate: " + e)
                            })) : (k.default.debug("Cache remote ice candidates."), this._remoteIceCandidates.push(t))
                        }
                    }, {
                        key: "_onSignalingStateChange", value: function (e) {
                            k.default.debug("Signaling state changed: " + this._pc.signalingState), "closed" === this._pc.signalingState || ("stable" === this._pc.signalingState ? (this._negotiating = !1, this._isNegotiationNeeded ? this._onNegotiationneeded() : (this._drainPendingStreams(), this._drainPendingMessages())) : "have-remote-offer" === this._pc.signalingState && this._drainPendingRemoteIceCandidates())
                        }
                    }, {
                        key: "_onIceConnectionStateChange", value: function (e) {
                            if ("closed" === e.currentTarget.iceConnectionState || "failed" === e.currentTarget.iceConnectionState) {
                                var t = new A.P2PError(A.errors.P2P_WEBRTC_UNKNOWN, "ICE connection failed or closed.");
                                this._stop(t, !0)
                            } else "connected" !== e.currentTarget.iceConnectionState && "completed" !== e.currentTarget.iceConnectionState || (this._sendSignalingMessage(T, this._addedTrackIds), this._addedTrackIds = [], this._checkIceConnectionStateAndFireEvent())
                        }
                    }, {
                        key: "_onDataChannelMessage", value: function (e) {
                            var t = JSON.parse(e.data);
                            k.default.debug("Data channel message received: " + t.data), this._sendSignalingMessage(E, t.id);
                            var n = new R.MessageEvent("messagereceived", {message: t.data, origin: this._remoteId});
                            this.dispatchEvent(n)
                        }
                    }, {
                        key: "_onDataChannelOpen", value: function (e) {
                            k.default.debug("Data Channel is opened."), e.target.label === S && (k.default.debug("Data channel for messages is opened."), this._drainPendingMessages())
                        }
                    }, {
                        key: "_onDataChannelClose", value: function (e) {
                            k.default.debug("Data Channel is closed.")
                        }
                    }, {
                        key: "_streamRemoved", value: function (e) {
                            this._remoteStreamInfo.has(e.mediaStream.id) || k.default.warning("Cannot find stream info."), this._sendSignalingMessage(C, this._remoteStreamInfo.get(e.mediaStream.id).trackIds);
                            var t = new R.OwtEvent("ended");
                            e.dispatchEvent(t)
                        }
                    }, {
                        key: "_isUnifiedPlan", value: function () {
                            if (s.isFirefox()) return !0;
                            var e = new RTCPeerConnection({sdpSemantics: "unified-plan"});
                            return e.getConfiguration() && "plan-b" === e.getConfiguration().sdpSemantics
                        }
                    }, {
                        key: "_createPeerConnection", value: function () {
                            var t = this, e = this._config.rtcConfiguration || {};
                            s.isChrome() && (e.sdpSemantics = "unified-plan"), this._pc = new RTCPeerConnection(e), "function" == typeof this._pc.addTransceiver && s.isSafari() && (this._pc.addTransceiver("audio"), this._pc.addTransceiver("video")), this._isUnifiedPlan() ? this._pc.ontrack = function (e) {
                                t._onRemoteTrackAdded.apply(t, [e])
                            } : (this._pc.onaddstream = function (e) {
                                t._onRemoteStreamAdded.apply(t, [e])
                            }, this._pc.onremovestream = function (e) {
                                t._onRemoteStreamRemoved.apply(t, [e])
                            }), this._pc.onnegotiationneeded = function (e) {
                                t._onNegotiationneeded.apply(t, [e])
                            }, this._pc.onicecandidate = function (e) {
                                t._onLocalIceCandidate.apply(t, [e])
                            }, this._pc.onsignalingstatechange = function (e) {
                                t._onSignalingStateChange.apply(t, [e])
                            }, this._pc.ondatachannel = function (e) {
                                k.default.debug("On data channel."), t._dataChannels.has(e.channel.label) || (t._dataChannels.set(e.channel.label, e.channel), k.default.debug("Save remote created data channel.")), t._bindEventsToDataChannel(e.channel)
                            }, this._pc.oniceconnectionstatechange = function (e) {
                                t._onIceConnectionStateChange.apply(t, [e])
                            }
                        }
                    }, {
                        key: "_drainPendingStreams", value: function () {
                            if (k.default.debug("Draining pending streams."), this._pc && "stable" === this._pc.signalingState) {
                                k.default.debug("Peer connection is ready for draining pending streams.");
                                for (var e = 0; e < this._pendingStreams.length; e++) {
                                    var t = this._pendingStreams[e];
                                    this._pendingStreams.shift(), t.mediaStream && (this._pc.addStream(t.mediaStream), k.default.debug("Added stream to peer connection."), this._publishingStreams.push(t))
                                }
                                for (var n = this._pendingStreams.length = 0; n < this._pendingUnpublishStreams.length; n++) this._pendingUnpublishStreams[n].mediaStream && (this._pc.removeStream(this._pendingUnpublishStreams[n].mediaStream), this._unpublishPromises.get(this._pendingUnpublishStreams[n].mediaStream.id).resolve(), this._publishedStreams.delete(this._pendingUnpublishStreams[n]), k.default.debug("Remove stream."));
                                this._pendingUnpublishStreams.length = 0
                            }
                        }
                    }, {
                        key: "_drainPendingRemoteIceCandidates", value: function () {
                            for (var e = 0; e < this._remoteIceCandidates.length; e++) k.default.debug("Add candidate"), this._pc.addIceCandidate(this._remoteIceCandidates[e]).catch(function (e) {
                                k.default.warning("Error processing ICE candidate: " + e)
                            });
                            this._remoteIceCandidates.length = 0
                        }
                    }, {
                        key: "_drainPendingMessages", value: function () {
                            if (k.default.debug("Draining pending messages."), 0 != this._pendingMessages.length) {
                                var e = this._dataChannels.get(S);
                                if (e && "open" === e.readyState) {
                                    for (var t = 0; t < this._pendingMessages.length; t++) k.default.debug("Sending message via data channel: " + this._pendingMessages[t]), e.send(JSON.stringify(this._pendingMessages[t]));
                                    this._pendingMessages.length = 0
                                } else this._pc && !e && this._createDataChannel(S)
                            }
                        }
                    }, {
                        key: "_sendStreamInfo", value: function (t) {
                            if (!t || !t.mediaStream) return new A.P2PError(A.errors.P2P_CLIENT_ILLEGAL_ARGUMENT);
                            var n = [];
                            return t.mediaStream.getTracks().map(function (e) {
                                n.push({id: e.id, source: t.source[e.kind]})
                            }), Promise.all([this._sendSignalingMessage(_, n), this._sendSignalingMessage(I, {
                                id: t.mediaStream.id,
                                attributes: t.attributes,
                                tracks: Array.from(n, function (e) {
                                    return e.id
                                }),
                                source: t.source
                            })])
                        }
                    }, {
                        key: "_sendSysInfoIfNecessary", value: function () {
                            return this._infoSent ? Promise.resolve() : (this._infoSent = !0, this._sendSignalingMessage(O, M))
                        }
                    }, {
                        key: "_sendClosedMsgIfNecessary", value: function () {
                            return null === this._pc.remoteDescription || "" === this._pc.remoteDescription.sdp ? this._sendSignalingMessage(D) : Promise.resolve()
                        }
                    }, {
                        key: "_handleRemoteCapability", value: function (e) {
                            e.sdk && e.sdk && "JavaScript" === e.sdk.type && e.runtime && "Firefox" === e.runtime.name ? (this._remoteSideSupportsRemoveStream = !1, this._remoteSideSupportsPlanB = !1, this._remoteSideSupportsUnifiedPlan = !0) : (this._remoteSideSupportsRemoveStream = !0, this._remoteSideSupportsPlanB = !0, this._remoteSideSupportsUnifiedPlan = !1)
                        }
                    }, {
                        key: "_doNegotiate", value: function () {
                            this._isCaller ? this._createAndSendOffer() : this._sendSignalingMessage(b)
                        }
                    }, {
                        key: "_setCodecOrder", value: function (e) {
                            if (this._config.audioEncodings) {
                                var t = Array.from(this._config.audioEncodings, function (e) {
                                    return e.codec.name
                                });
                                e = i.reorderCodecs(e, "audio", t)
                            }
                            if (this._config.videoEncodings) {
                                var n = Array.from(this._config.videoEncodings, function (e) {
                                    return e.codec.name
                                });
                                e = i.reorderCodecs(e, "video", n)
                            }
                            return e
                        }
                    }, {
                        key: "_setMaxBitrate", value: function (e, t) {
                            return "object" === a(t.audioEncodings) && (e = i.setMaxBitrate(e, t.audioEncodings)), "object" === a(t.videoEncodings) && (e = i.setMaxBitrate(e, t.videoEncodings)), e
                        }
                    }, {
                        key: "_setRtpSenderOptions", value: function (e, t) {
                            return this._setMaxBitrate(e, t)
                        }
                    }, {
                        key: "_setRtpReceiverOptions", value: function (e) {
                            return this._setCodecOrder(e)
                        }
                    }, {
                        key: "_createAndSendOffer", value: function () {
                            var t, n = this;
                            this._pc ? (this._isNegotiationNeeded = !1, this._isCaller = !0, this._pc.createOffer(N).then(function (e) {
                                return e.sdp = n._setRtpReceiverOptions(e.sdp), t = e, n._pc.setLocalDescription(e)
                            }).then(function () {
                                return n._sendSdp(t)
                            }).catch(function (e) {
                                k.default.error(e.message + " Please check your codec settings.");
                                var t = new A.P2PError(A.errors.P2P_WEBRTC_SDP, e.message);
                                n._stop(t, !0)
                            })) : k.default.error("Peer connection have not been created.")
                        }
                    }, {
                        key: "_createAndSendAnswer", value: function () {
                            var t, n = this;
                            this._drainPendingStreams(), this._isNegotiationNeeded = !1, this._isCaller = !1, this._pc.createAnswer().then(function (e) {
                                return e.sdp = n._setRtpReceiverOptions(e.sdp), t = e, n._pc.setLocalDescription(e)
                            }).then(function () {
                                return n._sendSdp(t)
                            }).catch(function (e) {
                                k.default.error(e.message + " Please check your codec settings.");
                                var t = new A.P2PError(A.errors.P2P_WEBRTC_SDP, e.message);
                                n._stop(t, !0)
                            })
                        }
                    }, {
                        key: "_getAndDeleteTrackSourceInfo", value: function (e) {
                            if (0 < e.length) {
                                var t = e[0].id;
                                if (this._remoteTrackSourceInfo.has(t)) {
                                    var n = this._remoteTrackSourceInfo.get(t);
                                    return this._remoteTrackSourceInfo.delete(t), n
                                }
                                k.default.warning("Cannot find source info for " + t)
                            }
                        }
                    }, {
                        key: "_unpublish", value: function (n) {
                            var r = this;
                            return navigator.mozGetUserMedia || !this._remoteSideSupportsRemoveStream ? (k.default.error("Stopping a publication is not supported on Firefox. Please use P2PClient.stop() to stop the connection with remote endpoint."), Promise.reject(new A.P2PError(A.errors.P2P_CLIENT_UNSUPPORTED_METHOD))) : this._publishedStreams.has(n) ? (this._pendingUnpublishStreams.push(n), new Promise(function (e, t) {
                                r._unpublishPromises.set(n.mediaStream.id, {resolve: e, reject: t}), r._drainPendingStreams()
                            })) : Promise.reject(new A.P2PError(A.errors.P2P_CLIENT_ILLEGAL_ARGUMENT))
                        }
                    }, {
                        key: "_createDataChannel", value: function (e) {
                            if (this._dataChannels.has(e)) k.default.warning("Data channel labeled " + e + " already exists."); else if (this._pc) {
                                k.default.debug("Create data channel.");
                                var t = this._pc.createDataChannel(e);
                                this._bindEventsToDataChannel(t), this._dataChannels.set(S, t)
                            } else k.default.debug("PeerConnection is not available before creating DataChannel.")
                        }
                    }, {
                        key: "_bindEventsToDataChannel", value: function (e) {
                            var t = this;
                            e.onmessage = function (e) {
                                t._onDataChannelMessage.apply(t, [e])
                            }, e.onopen = function (e) {
                                t._onDataChannelOpen.apply(t, [e])
                            }, e.onclose = function (e) {
                                t._onDataChannelClose.apply(t, [e])
                            }, e.onerror = function (e) {
                                k.default.debug("Data Channel Error:", error)
                            }
                        }
                    }, {
                        key: "_areAllTracksEnded", value: function (e) {
                            var t = !0, n = !1, r = void 0;
                            try {
                                for (var i, o = e.getTracks()[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) if ("live" === i.value.readyState) return !1
                            } catch (e) {
                                n = !0, r = e
                            } finally {
                                try {
                                    t || null == o.return || o.return()
                                } finally {
                                    if (n) throw r
                                }
                            }
                            return !0
                        }
                    }, {
                        key: "_stop", value: function (e, t) {
                            var n = e;
                            n || (n = new A.P2PError(A.errors.P2P_CLIENT_UNKNOWN));
                            var r = !0, i = !1, o = void 0;
                            try {
                                for (var a, s = this._dataChannels[Symbol.iterator](); !(r = (a = s.next()).done); r = !0) {
                                    var c = P(a.value, 2);
                                    c[0], c[1].close()
                                }
                            } catch (e) {
                                i = !0, o = e
                            } finally {
                                try {
                                    r || null == s.return || s.return()
                                } finally {
                                    if (i) throw o
                                }
                            }
                            this._dataChannels.clear(), this._pc && "closed" !== this._pc.iceConnectionState && this._pc.close();
                            var d = !0, u = !1, l = void 0;
                            try {
                                for (var p, f = this._publishPromises[Symbol.iterator](); !(d = (p = f.next()).done); d = !0) {
                                    var m = P(p.value, 2);
                                    m[0], m[1].reject(n)
                                }
                            } catch (e) {
                                u = !0, l = e
                            } finally {
                                try {
                                    d || null == f.return || f.return()
                                } finally {
                                    if (u) throw l
                                }
                            }
                            this._publishPromises.clear();
                            var h = !0, v = !1, g = void 0;
                            try {
                                for (var y, S = this._unpublishPromises[Symbol.iterator](); !(h = (y = S.next()).done); h = !0) {
                                    var b = P(y.value, 2);
                                    b[0], b[1].reject(n)
                                }
                            } catch (e) {
                                v = !0, g = e
                            } finally {
                                try {
                                    h || null == S.return || S.return()
                                } finally {
                                    if (v) throw g
                                }
                            }
                            this._unpublishPromises.clear();
                            var _, I = !0, w = !1, T = void 0;
                            try {
                                for (var C, E = this._sendDataPromises[Symbol.iterator](); !(I = (C = E.next()).done); I = !0) {
                                    var O = P(C.value, 2);
                                    O[0], O[1].reject(n)
                                }
                            } catch (e) {
                                w = !0, T = e
                            } finally {
                                try {
                                    I || null == E.return || E.return()
                                } finally {
                                    if (w) throw T
                                }
                            }
                            (this._sendDataPromises.clear(), this._publishedStreams.forEach(function (e) {
                                e.dispatchEvent(new R.OwtEvent("ended"))
                            }), this._publishedStreams.clear(), this._remoteStreams.forEach(function (e) {
                                e.dispatchEvent(new R.OwtEvent("ended"))
                            }), this._remoteStreams = [], this._disposed) || (t && (e && ((_ = JSON.parse(JSON.stringify(e))).message = "Error happened at remote side."), this._sendSignalingMessage(D, _).catch(function (e) {
                                k.default.debug("Failed to send close." + e.message)
                            })), this.dispatchEvent(new Event("ended")))
                        }
                    }, {
                        key: "_setStreamToRemoteStreamInfo", value: function (e) {
                            var t = this._remoteStreamInfo.get(e.id), n = t.attributes,
                                r = new u.StreamSourceInfo(this._remoteStreamInfo.get(e.id).source.audio, this._remoteStreamInfo.get(e.id).source.video);
                            t.stream = new u.RemoteStream(void 0, this._remoteId, e, r, n), t.mediaStream = e;
                            var i = t.stream;
                            i ? this._remoteStreams.push(i) : k.default.warning("Failed to create RemoteStream.")
                        }
                    }, {
                        key: "_checkIceConnectionStateAndFireEvent", value: function () {
                            var c = this;
                            if ("connected" === this._pc.iceConnectionState || "completed" === this._pc.iceConnectionState) {
                                var e = !0, t = !1, n = void 0;
                                try {
                                    for (var d, r = function () {
                                        var e = P(d.value, 2), t = (e[0], e[1]);
                                        if (t.mediaStream) {
                                            var n = new u.StreamEvent("streamadded", {stream: t.stream});
                                            if (c._isUnifiedPlan()) {
                                                var r = !0, i = !1, o = void 0;
                                                try {
                                                    for (var a, s = t.mediaStream.getTracks()[Symbol.iterator](); !(r = (a = s.next()).done); r = !0) a.value.addEventListener("ended", function () {
                                                        self._areAllTracksEnded(t.mediaStream) && self._onRemoteStreamRemoved(t.stream)
                                                    })
                                                } catch (e) {
                                                    i = !0, o = e
                                                } finally {
                                                    try {
                                                        r || null == s.return || s.return()
                                                    } finally {
                                                        if (i) throw o
                                                    }
                                                }
                                            }
                                            c._sendSignalingMessage(T, t.trackIds), c._remoteStreamInfo.get(t.mediaStream.id).mediaStream = null, c.dispatchEvent(n)
                                        }
                                    }, i = this._remoteStreamInfo[Symbol.iterator](); !(e = (d = i.next()).done); e = !0) r()
                                } catch (c) {
                                    t = !0, n = c
                                } finally {
                                    try {
                                        e || null == i.return || i.return()
                                    } finally {
                                        if (t) throw n
                                    }
                                }
                            }
                        }
                    }]), o
                }();
            n.default = x
        }, {
            "../base/event.js": 3,
            "../base/logger.js": 5,
            "../base/publication.js": 8,
            "../base/sdputils.js": 9,
            "../base/stream.js": 10,
            "../base/utils.js": 11,
            "./error.js": 23
        }]
    }, {}, [22])(22)
}), function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("AgoraRTC", [], t) : "object" == typeof exports ? exports.AgoraRTC = t() : e.AgoraRTC = t()
}(window, function () {
    return function (n) {
        var r = {};

        function i(e) {
            if (r[e]) return r[e].exports;
            var t = r[e] = {i: e, l: !1, exports: {}};
            return n[e].call(t.exports, t, t.exports, i), t.l = !0, t.exports
        }

        return i.m = n, i.c = r, i.d = function (e, t, n) {
            i.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n})
        }, i.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
        }, i.t = function (t, e) {
            if (1 & e && (t = i(t)), 8 & e) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if (i.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: t
            }), 2 & e && "string" != typeof t) for (var r in t) i.d(n, r, function (e) {
                return t[e]
            }.bind(null, r));
            return n
        }, i.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return i.d(t, "a", t), t
        }, i.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, i.p = "", i(i.s = 18)
    }([function (e, t, n) {
        "use strict";
        n.r(t);
        var r = n(6), u = n.n(r), l = n(5), p = n(3), f = n(1), m = 0, h = "free", v = [], g = [], y = 0;
        setInterval(function () {
            Object(p.getParameter)("UPLOAD_LOG") && i.info("console log upload")
        }, 9e5);
        var i = function () {
            var n, e, t, r, i, o, a = "https://".concat(Object(p.getParameter)("LOG_UPLOAD_SERVER"), "/upload/v1"),
                s = ["DEBUG", "INFO", "WARNING", "ERROR", "NONE"], c = 0;
            e = function () {
                for (var e = [0], t = 0; t < arguments.length; t++) e.push(arguments[t]);
                n.apply(this, e)
            }, t = function () {
                for (var e = [1], t = 0; t < arguments.length; t++) e.push(arguments[t]);
                n.apply(this, e)
            }, r = function () {
                for (var e = [2], t = 0; t < arguments.length; t++) e.push(arguments[t]);
                n.apply(this, e)
            }, i = function () {
                for (var e = [3], t = 0; t < arguments.length; t++) e.push(arguments[t]);
                n.apply(this, e)
            };
            var d = {};
            return o = function (e) {
                d[e] || (r.apply(void 0, arguments), d[e] = !0)
            }, {
                DEBUG: 0, INFO: 1, WARNING: 2, ERROR: 3, NONE: 4, enableLogUpload: function () {
                    Object(p.setParameter)("UPLOAD_LOG", !0)
                }, disableLogUpload: function () {
                    Object(p.setParameter)("UPLOAD_LOG", !1)
                }, setProxyServer: function (e) {
                    a = e ? "https://".concat(e, "/ls/?h=").concat(Object(p.getParameter)("LOG_UPLOAD_SERVER"), "&p=443&d=upload/v1") : "https://".concat(Object(p.getParameter)("LOG_UPLOAD_SERVER"), "/upload/v1")
                }, setLogLevel: function (e) {
                    4 < e ? e = 4 : e < 0 && (e = 0), c = e
                }, log: n = function () {
                    var e, t = arguments[0], n = arguments;
                    if (n[0] = (e = new Date).toTimeString().split(" ")[0] + ":" + e.getMilliseconds() + " Agora-SDK [" + (s[t] || "DEFAULT") + "]:", function (e, t) {
                        if (Object(p.getParameter)("UPLOAD_LOG")) try {
                            t = Array.prototype.slice.call(t);
                            var n = "";
                            t.forEach(function (e) {
                                "object" === u()(e) && (e = JSON.stringify(e)), n = n + e + " "
                            }), v.push({payload: n, log_level: e}), "free" === h && function e(t) {
                                h = "uploading", setTimeout(function () {
                                    !function (e, t, n) {
                                        var r;
                                        Array.isArray(e) || (e = [e]), e = e.map(function (e) {
                                            return {log_item_id: m++, log_level: e.log_level, payload_str: e.payload}
                                        }), r = {sdk_version: p.VERSION, process_id: Object(f.a)(), payload: JSON.stringify(e)};
                                        try {
                                            Object(l.c)(a, r, function (e) {
                                                "OK" === e ? t() : n()
                                            }, function (e) {
                                                n()
                                            }, {withCredentials: !0})
                                        } catch (e) {
                                            n()
                                        }
                                    }(t, function () {
                                        (y = 0) !== v.length ? (g = v.length < 10 ? v.splice(0, v.length) : v.splice(0, 10), e(g)) : h = "free"
                                    }, function () {
                                        setTimeout(function () {
                                            e(g)
                                        }, y++ < 2 ? 200 : 1e4)
                                    })
                                }, 3e3)
                            }(g = v.length < 10 ? v.splice(0, v.length) : v.splice(0, 10))
                        } catch (e) {
                        }
                    }(t, n), !(t < c)) switch (t) {
                        case 0:
                        case 1:
                            console.log.apply(console, n);
                            break;
                        case 2:
                            console.warn.apply(console, n);
                            break;
                        case 3:
                            console.error.apply(console, n);
                            break;
                        default:
                            return void console.log.apply(console, n)
                    }
                }, debug: e, info: t, warning: r, deprecate: o, error: i
            }
        }();
        t.default = i
    }, function (e, t, n) {
        "use strict";
        var r = n(9), I = n.n(r), i = n(4), o = n.n(i), w = n(3), a = n(0), s = n(5), c = n(10), d = n.n(c);
        n.d(t, "b", function () {
            return g
        }), n.d(t, "a", function () {
            return p
        });
        var u = {
            eventType: null,
            sid: null,
            lts: null,
            success: null,
            cname: null,
            uid: null,
            peer: null,
            cid: null,
            elapse: null,
            extend: null,
            vid: 0
        }, l = null, p = function () {
            return l || (l = "process-" + d()(), a.default.info("processId: " + l)), l
        }, g = function () {
            var _ = {list: {}};
            _.url = Object(s.e)() ? "https://".concat(Object(w.getParameter)("EVENT_REPORT_DOMAIN"), ":6443/events/message") : "http://".concat(Object(w.getParameter)("EVENT_REPORT_DOMAIN"), ":6080/events/message"), _.urlBackup = Object(s.e)() ? "https://".concat(Object(w.getParameter)("EVENT_REPORT_BACKUP_DOMAIN"), ":6443/events/message") : "http://".concat(Object(w.getParameter)("EVENT_REPORT_BACKUP_DOMAIN"), ":6080/events/message"), _.setProxyServer = function (e) {
                e ? (_.url = Object(s.e)() ? "https://".concat(e, "/rs/?h=").concat(Object(w.getParameter)("EVENT_REPORT_DOMAIN"), "&p=6443&d=events/message") : "http://".concat(e, "/rs/?h=").concat(Object(w.getParameter)("EVENT_REPORT_DOMAIN"), "&p=6080&d=events/message"), _.urlBackup = Object(s.e)() ? "https://".concat(e, "/rs/?h=").concat(Object(w.getParameter)("EVENT_REPORT_BACKUP_DOMAIN"), "&p=6443&d=events/message") : "http://".concat(e, "/rs/?h=").concat(Object(w.getParameter)("EVENT_REPORT_BACKUP_DOMAIN"), "&p=6080&d=events/message"), a.default.debug("reportProxyServerURL: ".concat(_.url)), a.default.debug("reportProxyServerBackupURL: ".concat(_.urlBackup))) : (_.url = Object(s.e)() ? "https://".concat(Object(w.getParameter)("EVENT_REPORT_DOMAIN"), ":6443/events/message") : "http://".concat(Object(w.getParameter)("EVENT_REPORT_DOMAIN"), ":6080/events/message"), _.urlBackup = Object(s.e)() ? "https://".concat(Object(w.getParameter)("EVENT_REPORT_BACKUP_DOMAIN"), ":6443/events/message") : "http://".concat(Object(w.getParameter)("EVENT_REPORT_BACKUP_DOMAIN"), ":6080/events/message"))
            }, _.sessionInit = function (e, t) {
                var n = o()({}, u);
                n.startTime = +new Date, n.sid = e, n.cname = t.cname, _.list[e] = n;
                var r = o()({}, {willUploadConsoleLog: Object(w.getParameter)("UPLOAD_LOG")}, t.extend), i = o()({}, n);
                i.eventType = "session_init", i.appid = t.appid, i.browser = navigator.userAgent, i.build = w.BUILD, i.lts = +new Date, i.elapse = i.lts - i.startTime, i.extend = JSON.stringify(r), i.mode = t.mode, i.process = p(), i.success = t.succ, i.version = w.VERSION, delete i.startTime, _.send({
                    type: "io.agora.pb.Wrtc.Session",
                    data: i
                }), _._flushInvokeReport(e)
            }, _.joinChooseServer = function (e, t, n) {
                t.uid && (_.list[e].uid = parseInt(t.uid)), t.cid && (_.list[e].cid = parseInt(t.cid));
                var r = o()({}, _.list[e]);
                r.eventType = "join_choose_server";
                var i = t.lts;
                r.lts = Date.now(), r.eventElapse = r.lts - i, r.chooseServerAddr = t.csAddr, r.errorCode = t.ec, r.elapse = r.lts - r.startTime, r.success = t.succ, r.chooseServerAddrList = JSON.stringify(t.serverList), delete r.startTime, _.send({
                    type: "io.agora.pb.Wrtc.JoinChooseServer",
                    data: r
                })
            }, _.joinGateway = function (e, t) {
                t.vid && (_.list[e].vid = t.vid);
                var n = o()({}, _.list[e]), r = t.lts;
                n.eventType = "join_gateway", n.lts = Date.now(), n.gatewayAddr = t.addr, n.success = t.succ, n.errorCode = t.ec, n.elapse = n.lts - n.startTime, n.eventElapse = n.lts - r, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.JoinGateway",
                    data: n
                })
            }, _.publish = function (e, t) {
                var n = o()({}, _.list[e]);
                n.eventType = "publish";
                var r = t.lts;
                n.lts = Date.now(), n.eventElapse = n.lts - r, n.elapse = n.lts - n.startTime, n.success = t.succ, n.errorCode = t.ec, t.videoName && (n.videoName = t.videoName), t.audioName && (n.audioName = t.audioName), t.screenName && (n.screenName = t.screenName), delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.Publish",
                    data: n
                }), _._flushInvokeReport(e)
            }, _.subscribe = function (e, t) {
                var n = o()({}, _.list[e]);
                n.eventType = "subscribe";
                var r = t.lts;
                n.lts = Date.now(), n.eventElapse = n.lts - r, n.elapse = n.lts - n.startTime, n.errorCode = t.ec, n.success = t.succ, isFinite(t.peerid) ? n.peer = t.peerid : n.peerSuid = "" + t.peerid, "boolean" == typeof t.video && (n.video = t.video), "boolean" == typeof t.audio && (n.audio = t.audio), delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.Subscribe",
                    data: n
                }), _._flushInvokeReport(e)
            }, _.firstRemoteFrame = function (e, t) {
                var n = o()({}, _.list[e]);
                n.eventType = "first_remote_frame";
                var r = t.lts;
                n.lts = Date.now(), n.eventElapse = n.lts - r, n.elapse = n.lts - n.startTime, n.width = t.width, n.height = t.height, n.success = t.succ, n.errorCode = t.ec, isFinite(t.peerid) ? n.peer = t.peerid : n.peerSuid = "" + t.peerid, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.FirstFrame",
                    data: n
                })
            }, _.streamSwitch = function (e, t) {
                var n = o()({}, _.list[e]);
                n.eventType = "stream_switch", n.lts = Date.now(), n.isDual = t.isdual, n.elapse = n.lts - n.startTime, n.success = n.succ, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.StreamSwitch",
                    data: n
                })
            }, _.audioSendingStopped = function (e, t) {
                var n = o()({}, _.list[e]);
                n.eventType = "audio_sending_stopped", n.lts = Date.now(), n.elapse = n.lts - n.startTime, n.reason = t.reason, n.success = t.succ, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.AudioSendingStopped",
                    data: n
                })
            }, _.videoSendingStopped = function (e, t) {
                var n = o()({}, _.list[e]);
                n.eventType = "video_sending_stopped", n.lts = Date.now(), n.elapse = n.lts - n.startTime, n.reson = t.reason, n.success = t.succ, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.VideoSendingStopped",
                    data: n
                })
            }, _.requestProxyAppCenter = function (e, t) {
                var n = o()({}, _.list[e]), r = t.lts;
                n.eventType = "request_proxy_appcenter", n.lts = Date.now(), n.eventElapse = n.lts - r, n.elapse = n.lts - n.startTime, n.extend = t.extend + "", n.APAddr = t.APAddr, n.workerManagerList = t.workerManagerList, n.response = t.response, n.errorCode = t.ec, n.success = t.succ, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.RequestProxyAppCenter",
                    data: n
                })
            }, _.requestProxyWorkerManager = function (e, t) {
                var n = o()({}, _.list[e]), r = t.lts;
                n.eventType = "request_proxy_worker_manager", n.lts = Date.now(), n.eventElapse = n.lts - r, n.elapse = n.lts - n.startTime, n.extend = t.extend, n.workerManagerAddr = t.workerManagerAddr, n.response = t.response, n.errorCode = t.ec, n.success = t.succ, delete n.startTime, _.send({
                    type: "io.agora.pb.Wrtc.RequestProxyWorkerManager",
                    data: n
                })
            };
            var v = 0;
            return _.reportApiInvoke = function (e, t) {
                var n = t.tag, i = t.name, o = t.getStates, a = t.options, r = t.timeout, s = void 0 === r ? 6e4 : r, c = t.callback,
                    d = t.reportResult, u = void 0 === d || d, l = Date.now(), p = 0, f = v++, m = function () {
                        return I()({
                            tag: n,
                            invokeId: f,
                            sid: e,
                            name: i,
                            apiInvokeTime: l,
                            options: a
                        }, o && {
                            states: (r = o(), Object.keys(r).reduce(function (e, t) {
                                var n = e;
                                return null != r[t] && (n[t] = r[t]), n
                            }, {}))
                        });
                        var r
                    }, h = setTimeout(function () {
                        g._sendApiInvoke(I()({}, m(), {error: "API_INVOKE_TIMEOUT", success: !1}))
                    }, s);
                return function (e, t) {
                    if (clearTimeout(h), 1 < ++p && (e = "EXECUTOR_INVOKE_".concat(p)), e) return g._sendApiInvoke(I()({}, m(), {
                        success: !1,
                        error: e
                    }, o && {states: o()})), c && c(e);
                    g._sendApiInvoke(I()({}, m(), {success: !0}, u && {result: t}, o && {states: o()})), c && c(null, t)
                }
            }, _._cachedItems = [], _._cacheInvokeReport = function (e) {
                e.lts || (e.lts = Date.now()), _._cachedItems.push(e), 50 < _._cachedItems.length && _._cachedItems.shift()
            }, _._flushInvokeReport = function (n) {
                if (_._cachedItems.length) {
                    var e = _._cachedItems;
                    _._cachedItems = [], a.default.debug("Flush cached event reporting:", e.length), e.forEach(function (e, t) {
                        e.sid = n, setTimeout(function () {
                            _._sendApiInvoke(e)
                        }, 5e3 + 500 * t)
                    })
                }
            }, _._sendApiInvoke = function (e) {
                var t = e.tag, n = e.invokeId, r = e.sid, i = e.name, o = e.result, a = e.states, s = e.options, c = e.error, d = e.success,
                    u = e.apiInvokeTime, l = e.lts, p = Object(w.getParameter)("NOT_REPORT_EVENT");
                if (!(t && p instanceof Array && -1 !== p.indexOf(t))) if (_.list[r]) {
                    var f = _.list[r], m = f.startTime, h = f.cname, v = f.uid, g = f.cid, y = (l = l || Date.now()) - m, S = l - u, b = I()({
                        invokeId: n,
                        sid: r,
                        cname: h,
                        cid: g,
                        lts: l,
                        uid: v,
                        success: d,
                        elapse: y,
                        apiName: i,
                        execElapse: S
                    }, void 0 !== s && {options: JSON.stringify(s)}, void 0 !== a && {execStates: JSON.stringify(a)}, void 0 !== c && {errorCode: JSON.stringify(c)}, void 0 !== o && {execResult: JSON.stringify(o)});
                    _.send({type: "io.agora.pb.Wrtc.ApiInvoke", data: b})
                } else _._cacheInvokeReport(e)
            }, _._send = function (n) {
                try {
                    var e = [];
                    n && n.data && n.data.apiName ? e.push(["apiName", "" + n.data.apiName]) : n && n.data && n.data.eventType && e.push(["eventType", n.data.eventType]);
                    var r = e.map(function (e) {
                        return "".concat(e[0], "=").concat(encodeURIComponent(e[1]))
                    }).join("&"), t = -1 === _.url.indexOf("?") ? "".concat(_.url, "?").concat(r) : _.url;
                    Object(s.c)(t, n, null, function (e) {
                        var t = -1 === _.urlBackup.indexOf("?") ? "".concat(_.urlBackup, "?").concat(r) : _.urlBackup;
                        Object(s.c)(t, n, null, function (e) {
                        }, {timeout: 1e4})
                    }, {timeout: 1e4})
                } catch (e) {
                }
            }, _.sendCache = [], _.sendTimer = null, _.send = function (e) {
                if (_.sendCache.push(e), null === _.sendTimer) return function e() {
                    _.sendTimer = setTimeout(function () {
                        if (0 !== _.sendCache.length) return _._send(_.sendCache.shift()), e();
                        _.sendTimer = null
                    }, Object(w.getParameter)("EVENT_REPORT_SEND_INTERVAL"))
                }()
            }, _
        }()
    }, function (e, t, n) {
        "use strict";
        n.r(t), n.d(t, "getBrowserInfo", function () {
            return y
        }), n.d(t, "getBrowserVersion", function () {
            return p
        }), n.d(t, "getBrowserOS", function () {
            return f
        }), n.d(t, "isChrome", function () {
            return r
        }), n.d(t, "isSafari", function () {
            return i
        }), n.d(t, "isFireFox", function () {
            return a
        }), n.d(t, "isOpera", function () {
            return s
        }), n.d(t, "isEdge", function () {
            return o
        }), n.d(t, "isQQBrowser", function () {
            return c
        }), n.d(t, "isWeChatBrowser", function () {
            return d
        }), n.d(t, "isLegacyChrome", function () {
            return h
        }), n.d(t, "isSupportedPC", function () {
            return u
        }), n.d(t, "isSupportedMobile", function () {
            return l
        }), n.d(t, "getChromeKernelVersion", function () {
            return g
        }), n.d(t, "isChromeKernel", function () {
            return m
        });
        var r = function () {
            var e = y();
            return e.name && "Chrome" === e.name
        }, i = function () {
            var e = y();
            return e.name && "Safari" === e.name
        }, o = function () {
            var e = y();
            return e.name && "Edge" === e.name
        }, a = function () {
            var e = y();
            return e.name && "Firefox" === e.name
        }, s = function () {
            var e = y();
            return e.name && "OPR" === e.name
        }, c = function () {
            var e = y();
            return e.name && "QQBrowser" === e.name
        }, d = function () {
            var e = y();
            return e.name && "MicroMessenger" === e.name
        }, u = function () {
            var e = f();
            return "Linux" === e || "Mac OS X" === e || "Mac OS" === e || -1 !== e.indexOf("Windows")
        }, l = function () {
            var e = f();
            return "Android" === e || "iOS" === e
        }, p = function () {
            return y().version
        }, f = function () {
            return y().os
        }, m = function () {
            return !!navigator.userAgent.match(/chrome\/[\d]./i)
        };

        function h() {
            return window.navigator.appVersion && null !== window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./) && window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] <= 35
        }

        var v, g = function () {
            var e = navigator.userAgent.match(/chrome\/[\d]./i);
            return e && e[0] && e[0].split("/")[1]
        }, y = (v = function () {
            var e, t = navigator.userAgent, n = t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            "Chrome" === n[1] && null != (e = t.match(/(OPR(?=\/))\/?(\d+)/i)) && (n = e), "Safari" === n[1] && null != (e = t.match(/version\/(\d+)/i)) && (n[2] = e[1]), ~t.toLowerCase().indexOf("qqbrowser") && null != (e = t.match(/(qqbrowser(?=\/))\/?(\d+)/i)) && (n = e), ~t.toLowerCase().indexOf("micromessenger") && null != (e = t.match(/(micromessenger(?=\/))\/?(\d+)/i)) && (n = e), ~t.toLowerCase().indexOf("edge") && null != (e = t.match(/(edge(?=\/))\/?(\d+)/i)) && (n = e), ~t.toLowerCase().indexOf("trident") && null != (e = /\brv[ :]+(\d+)/g.exec(t) || []) && (n = [null, "IE", e[1]]);
            var r = void 0, i = [{s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/}, {s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/}, {
                s: "Windows 8",
                r: /(Windows 8|Windows NT 6.2)/
            }, {s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/}, {s: "Windows Vista", r: /Windows NT 6.0/}, {
                s: "Windows Server 2003",
                r: /Windows NT 5.2/
            }, {s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/}, {s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/}, {
                s: "Windows ME",
                r: /(Win 9x 4.90|Windows ME)/
            }, {s: "Windows 98", r: /(Windows 98|Win98)/}, {s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/}, {
                s: "Windows NT 4.0",
                r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
            }, {s: "Windows CE", r: /Windows CE/}, {s: "Windows 3.11", r: /Win16/}, {s: "Android", r: /Android/}, {
                s: "Open BSD",
                r: /OpenBSD/
            }, {s: "Sun OS", r: /SunOS/}, {s: "Linux", r: /(Linux|X11)/}, {s: "iOS", r: /(iPhone|iPad|iPod)/}, {
                s: "Mac OS X",
                r: /Mac OS X/
            }, {s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/}, {s: "QNX", r: /QNX/}, {s: "UNIX", r: /UNIX/}, {
                s: "BeOS",
                r: /BeOS/
            }, {s: "OS/2", r: /OS\/2/}, {s: "Search Bot", r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}];
            for (var o in i) {
                var a = i[o];
                if (a.r.test(navigator.userAgent)) {
                    r = a.s;
                    break
                }
            }
            return {name: n[1], version: n[2], os: r}
        }(), function () {
            return v
        })
    }, function (e, t, n) {
        "use strict";
        t.__esModule = !0, t.BUILD = "v2.7.1-0-g86b47d1", t.VERSION = "2.7.1", t.SUPPORT_RESOLUTION_LIST = {
            "90p_1": [160, 90, null, null, null, null],
            "120p_1": [160, 120, 15, 15, 30, 65],
            "120p_3": [120, 120, 15, 15, 30, 50],
            "120p_4": [212, 120, null, null, null, null],
            "180p_1": [320, 180, 15, 15, 30, 140],
            "180p_3": [180, 180, 15, 15, 30, 100],
            "180p_4": [240, 180, 15, 15, 30, 120],
            "240p_1": [320, 240, 15, 15, 40, 200],
            "240p_3": [240, 240, 15, 15, 40, 140],
            "240p_4": [424, 240, 15, 15, 40, 220],
            "360p_1": [640, 360, 15, 15, 80, 400],
            "360p_3": [360, 360, 15, 15, 80, 260],
            "360p_4": [640, 360, 30, 30, 80, 600],
            "360p_6": [360, 360, 30, 30, 80, 400],
            "360p_7": [480, 360, 15, 15, 80, 320],
            "360p_8": [480, 360, 30, 30, 80, 490],
            "360p_9": [640, 360, 15, 15, 80, 800],
            "360p_10": [640, 360, 24, 24, 80, 800],
            "360p_11": [640, 360, 24, 24, 80, 1e3],
            "480p_1": [640, 480, 15, 15, 20, 500, 1, 5],
            "480p_2": [640, 480, 30, 30, 100, 1e3, 25, 30],
            "480p_3": [480, 480, 15, 15, 100, 400],
            "480p_4": [640, 480, 30, 30, 100, 750],
            "480p_6": [480, 480, 30, 30, 100, 600],
            "480p_8": [848, 480, 15, 15, 100, 610],
            "480p_9": [848, 480, 30, 30, 100, 930],
            "480p_10": [640, 480, 10, 10, 100, 400],
            "720p_1": [1280, 720, 15, 15, 120, 1130, 1, 5],
            "720p_2": [1280, 720, 30, 30, 120, 2e3, 25, 30],
            "720p_3": [1280, 720, 30, 30, 120, 1710],
            "720p_5": [960, 720, 15, 15, 120, 910],
            "720p_6": [960, 720, 30, 30, 120, 1380],
            "1080p_1": [1920, 1080, 15, 15, 120, 2080, 1, 5],
            "1080p_2": [1920, 1080, 30, 30, 120, 3e3, 25, 30],
            "1080p_3": [1920, 1080, 30, 30, 120, 3150],
            "1080p_5": [1920, 1080, 60, 60, 120, 4780],
            "1440p_1": [2560, 1440, 30, 30, 120, 4850],
            "1440p_2": [2560, 1440, 60, 60, 120, 7350],
            "4k_1": [3840, 2160, 30, 30, 120, 8910],
            "4k_3": [3840, 2160, 60, 60, 120, 13500]
        };
        var r = {
            WEBCS_DOMAIN: ["ap-web-1.agora.io", "ap-web-2.agoraio.cn"],
            WEBCS_DOMAIN_BACKUP_LIST: ["ap-web-3.agora.io", "ap-web-4.agoraio.cn"],
            PROXY_CS: ["ap-proxy-1.agora.io", "ap-proxy-2.agora.io"],
            AUDIO_CONTEXT: null,
            LOG_UPLOAD_SERVER: "logservice.agora.io",
            EVENT_REPORT_DOMAIN: "webcollector-1.agora.io",
            EVENT_REPORT_BACKUP_DOMAIN: "webcollector-2.agoraio.cn",
            WEBCS_BACKUP_CONNECT_TIMEOUT: 6e3,
            HTTP_CONNECT_TIMEOUT: 5e3,
            PLAYER_STATE_DEFER: 2e3,
            UPLOAD_LOG: !(t.AUDIO_PROFILE_SETTINGS = {
                speech_low_quality: [!1, !1, !0, !0],
                speech_standard: [!1, !1, !0, !1],
                music_standard: [!1, !1, !1, !1],
                standard_stereo: [!1, !0, !1, !1],
                high_quality: [!0, !1, !1, !1],
                high_quality_stereo: [!0, !0, !1, !1],
                default: [!1, !1, !1, !1]
            }),
            NOT_REPORT_EVENT: [],
            FILEPATH_LENMAX: 255,
            SUBSCRIBE_TCC: !1,
            PING_PONG_TIME_OUT: 10,
            WEBSOCKET_TIMEOUT_MIN: 1e4,
            EVENT_REPORT_SEND_INTERVAL: 1e3,
            MEDIA_ELEMENT_EXISTS_DEPTH: 3,
            CANDIDATE_TIMEOUT: 2e3,
            SHIM_CANDIDATE: !1,
            LEAVE_MSG_TIMEOUT: 2e3
        };
        t.setParameter = function (e, t) {
            return void 0 !== r[e] && (r[e] = t, !0)
        }, t.getParameter = function (e) {
            return void 0 !== r[e] ? r[e] : null
        }
    }, function (e, t) {
        function n() {
            return e.exports = n = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                }
                return e
            }, n.apply(this, arguments)
        }

        e.exports = n
    }, function (e, t, n) {
        "use strict";
        n.d(t, "c", function () {
            return a
        }), n.d(t, "e", function () {
            return s
        }), n.d(t, "b", function () {
            return r
        }), n.d(t, "a", function () {
            return i
        }), n.d(t, "d", function () {
            return o
        });
        var c = n(3), d = n(7), u = 0, l = 0, r = function () {
            return u
        }, i = function () {
            return l
        }, o = function () {
            l = u = 0
        }, a = function (t, e, n, r, i) {
            var o = new XMLHttpRequest;
            if (o.timeout = e.timeout || Object(c.getParameter)("HTTP_CONNECT_TIMEOUT"), o.open("POST", t, !0), o.setRequestHeader("Content-type", "application/json; charset=utf-8"), i) for (var a in i) "withCredentials" == a ? o.withCredentials = !0 : o.setRequestHeader(a, i[a]);
            o.onload = function (e) {
                l += Object(d.e)(o.responseText), n && n(o.responseText)
            }, o.onerror = function (e) {
                r && r(e, t)
            }, o.ontimeout = function (e) {
                r && r(e, t)
            };
            var s = JSON.stringify(e);
            u += Object(d.e)(s), o.send(s)
        }, s = function () {
            return "https:" == document.location.protocol
        }
    }, function (t, e) {
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }

        function r(e) {
            return "function" == typeof Symbol && "symbol" === n(Symbol.iterator) ? t.exports = r = function (e) {
                return n(e)
            } : t.exports = r = function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : n(e)
            }, r(e)
        }

        t.exports = r
    }, function (e, t, n) {
        "use strict";
        n.d(t, "d", function () {
            return h
        }), n.d(t, "b", function () {
            return p
        }), n.d(t, "a", function () {
            return l
        }), n.d(t, "h", function () {
            return f
        }), n.d(t, "c", function () {
            return m
        }), n.d(t, "g", function () {
            return g
        }), n.d(t, "f", function () {
            return S
        }), n.d(t, "e", function () {
            return y
        });
        var r = n(6), i = n.n(r), o = n(2), a = n(0), s = n(10), c = n.n(s), d = n(11), u = n(8), l = function (e) {
            return this.audioContext = Object(d.a)(), this.sourceNode = e.otWebkitAudioSource || this.audioContext.createMediaStreamSource(e), this.analyser = this.audioContext.createAnalyser(), this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount), this.sourceNode.connect(this.analyser), this.getAudioLevel = function () {
                if (this.analyser) {
                    this.analyser.getByteTimeDomainData(this.timeDomainData);
                    for (var e = 0, t = 0; t < this.timeDomainData.length; t++) e = Math.max(e, Math.abs(this.timeDomainData[t] - 128));
                    return e / 128
                }
                return a.default.warning("can't find analyser in audioLevelHelper"), 0
            }, this
        };

        function p() {
            return c()().replace(/-/g, "").toUpperCase()
        }

        var f = function (e, t, n) {
            try {
                var r = document.createElement("video");
                r.setAttribute("autoplay", ""), r.setAttribute("muted", ""), r.muted = !0, r.setAttribute("playsinline", ""), r.setAttribute("style", "position: absolute; top: 0; left: 0; width:1px; high:1px;"), document.body.appendChild(r), r.addEventListener("playing", function (e) {
                    o.isFireFox() ? r.videoWidth && (t(r.videoWidth, r.videoHeight), document.body.removeChild(r)) : (t(r.videoWidth, r.videoHeight), document.body.removeChild(r))
                }), Object(u.setSrcObject)(r, e)
            } catch (e) {
                n(e)
            }
        }, m = function (e) {
            return "number" == typeof e && 0 <= e && e <= 4294967295
        }, h = function (e) {
            var t = ["lowLatency", "userConfigExtraInfo", "transcodingUsers"];
            for (var n in e) if ("lowLatency" === n && "boolean" != typeof e[n] || "userConfigExtraInfo" === n && "object" !== i()(e[n]) || "transcodingUsers" === n && !v(e[n]) || !~t.indexOf(n) && "number" != typeof e[n]) throw new Error("Param [" + n + "] is inValid");
            return !0
        }, v = function (e) {
            for (var t = 0; t < e.length; t++) for (var n in e[t]) if ("number" != typeof e[t][n]) throw new Error("Param user[" + t + "] - [" + n + "] is inValid");
            return !0
        }, g = function (e) {
            isNaN(e) && (e = 1e3);
            var t = +new Date, n = (t = (9301 * t + 49297) % 233280) / 233280;
            return Math.ceil(n * e)
        }, y = function (e) {
            var t = encodeURIComponent(e).match(/%[89ABab]/g);
            return e.length + (t ? t.length : 0)
        }, S = function () {
            if (!document.getElementById("agora-ban-tip")) {
                var e = document.createElement("div");
                e.id = "agora-ban-tip", e.style = "position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: #fff;", document.querySelector("body").prepend(e);
                var t = document.createElement("div");
                t.style = "background: #000; width: 346px; height: 116px; z-index: 100000; opacity: 0.6; border-radius: 10px; box-shadow: 0 2px 4px #000;", e.append(t);
                var n = document.createElement("div");
                n.style = "height: 76px; display: flex; justify-content: center; align-items: center;";
                var r = document.createElement("span");
                r.style = "height: 28px; width: 28px; color: #000; text-align: center; line-height: 30px; background: #fff; border-radius: 50%; font-weight: 600; font-size: 20px;margin-right: 5px;", r.innerText = "!";
                var i = document.createElement("span");
                i.innerText = "This browser does not support webRTC", n.append(r), n.append(i);
                var o = document.createElement("div");
                o.style = "height: 38px; display: flex; border-top: #fff 1px solid; justify-content: center; align-items: center;", o.innerText = "OK", t.append(n), t.append(o), o.onclick = function () {
                    var e = document.getElementById("agora-ban-tip");
                    e.parentNode.removeChild(e)
                }
            }
        }
    }, function (e, t, n) {
        "use strict";
        n.r(t), n.d(t, "RTCPeerConnection", function () {
            return I
        }), n.d(t, "getUserMedia", function () {
            return i
        }), n.d(t, "attachMediaStream", function () {
            return o
        }), n.d(t, "reattachMediaStream", function () {
            return s
        }), n.d(t, "setSrcObject", function () {
            return p
        }), n.d(t, "getSrcObject", function () {
            return f
        }), n.d(t, "webrtcDetectedBrowser", function () {
            return c
        }), n.d(t, "webrtcDetectedVersion", function () {
            return d
        }), n.d(t, "webrtcMinimumVersion", function () {
            return u
        }), n.d(t, "webrtcTesting", function () {
            return w
        }), n.d(t, "webrtcUtils", function () {
            return v
        });
        var r = n(6), a = n.n(r), i = null, o = null, s = null, c = null, d = null, u = null, l = null, p = null, f = null, m = null,
            h = {addStream: null}, v = {
                log: function () {
                }, extractVersion: function (e, t, n) {
                    var r = e.match(t);
                    return r && r.length >= n && parseInt(r[n])
                }
            };
        if ("object" == ("undefined" == typeof window ? "undefined" : a()(window)) ? (f = !window.HTMLMediaElement || "srcObject" in window.HTMLMediaElement.prototype ? (p = function (e, t) {
            e.srcObject = t
        }, function (e) {
            return e.srcObject
        }) : (p = function (e, t) {
            "mozSrcObject" in e ? e.mozSrcObject = t : (e._srcObject = t, e.src = t ? URL.createObjectURL(t) : null)
        }, function (e) {
            return "mozSrcObject" in e ? e.mozSrcObject : e._srcObject
        }), i = window.navigator && window.navigator.getUserMedia) : (p = function (e, t) {
            e.srcObject = t
        }, f = function (e) {
            return e.srcObject
        }), o = function (e, t) {
            p(e, t)
        }, s = function (e, t) {
            p(e, f(t))
        }, "undefined" != typeof window && window.navigator) if (navigator.mozGetUserMedia && window.mozRTCPeerConnection) {
            for (var g in v.log("This appears to be Firefox"), c = "firefox", d = v.extractVersion(navigator.userAgent, /Firefox\/([0-9]+)\./, 1), u = 31, m = mozRTCPeerConnection, h) h[g] = m.prototype[g];
            if (l = function (e, t) {
                if (d < 38 && e && e.iceServers) {
                    for (var n = [], r = 0; r < e.iceServers.length; r++) {
                        var i = e.iceServers[r];
                        if (i.hasOwnProperty("urls")) for (var o = 0; o < i.urls.length; o++) {
                            var a = {url: i.urls[o]};
                            0 === i.urls[o].indexOf("turn") && (a.username = i.username, a.credential = i.credential), n.push(a)
                        } else n.push(e.iceServers[r])
                    }
                    e.iceServers = n
                }
                var s = new m(e, t);
                for (var c in h) s[c] = h[c];
                return s
            }, window.RTCSessionDescription || (window.RTCSessionDescription = mozRTCSessionDescription), window.RTCIceCandidate || (window.RTCIceCandidate = mozRTCIceCandidate), i = function (e, t, n) {
                var r = function (r) {
                    if ("object" !== a()(r) || r.require) return r;
                    var i = [];
                    return Object.keys(r).forEach(function (e) {
                        if ("require" !== e && "advanced" !== e && "mediaSource" !== e) {
                            var t = r[e] = "object" === a()(r[e]) ? r[e] : {ideal: r[e]};
                            if (void 0 === t.min && void 0 === t.max && void 0 === t.exact || i.push(e), void 0 !== t.exact && ("number" == typeof t.exact ? t.min = t.max = t.exact : r[e] = t.exact, delete t.exact), void 0 !== t.ideal) {
                                r.advanced = r.advanced || [];
                                var n = {};
                                "number" == typeof t.ideal ? n[e] = {
                                    min: t.ideal,
                                    max: t.ideal
                                } : n[e] = t.ideal, r.advanced.push(n), delete t.ideal, Object.keys(t).length || delete r[e]
                            }
                        }
                    }), i.length && (r.require = i), r
                };
                return d < 38 && (v.log("spec: " + JSON.stringify(e)), e.audio && (e.audio = r(e.audio)), e.video && (e.video = r(e.video)), v.log("ff37: " + JSON.stringify(e))), navigator.mozGetUserMedia(e, t, n)
            }, navigator.getUserMedia = i, navigator.mediaDevices || (navigator.mediaDevices = {
                getUserMedia: _, addEventListener: function () {
                }, removeEventListener: function () {
                }
            }), navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
                return new Promise(function (e) {
                    e([{kind: "audioinput", deviceId: "default", label: "", groupId: ""}, {
                        kind: "videoinput",
                        deviceId: "default",
                        label: "",
                        groupId: ""
                    }])
                })
            }, d < 41) {
                var y = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                navigator.mediaDevices.enumerateDevices = function () {
                    return y().then(void 0, function (e) {
                        if ("NotFoundError" === e.name) return [];
                        throw e
                    })
                }
            }
        } else if (navigator.webkitGetUserMedia && window.webkitRTCPeerConnection) {
            for (var g in v.log("This appears to be Chrome"), c = "chrome", d = v.extractVersion(navigator.userAgent, /Chrom(e|ium)\/([0-9]+)\./, 2), u = 38, m = webkitRTCPeerConnection, h) h[g] = m.prototype[g];
            l = function (e, t) {
                e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy);
                var n = new m(e, t);
                for (var r in h) n[r] = h[r];
                var a = n.getStats.bind(n);
                return n.getStats = function (n, e, t) {
                    var r = this, i = arguments;
                    0 < i.length && "function" == typeof n && (i = e ? (t = e, e = n, [n = null, e, t]) : (e = n, [n = null, e]));
                    var o = function (e) {
                        var r = {};
                        return e.result().forEach(function (t) {
                            var n = {id: t.id, timestamp: t.timestamp, type: t.type};
                            t.names().forEach(function (e) {
                                n[e] = t.stat(e)
                            }), r[n.id] = n
                        }), r
                    };
                    return 2 <= i.length ? a.apply(this, [function (e) {
                        i[1](o(e))
                    }, i[0]]) : new Promise(function (t, e) {
                        1 === i.length && null === n ? a.apply(r, [function (e) {
                            t.apply(null, [o(e)])
                        }, e]) : a.apply(r, [t, e])
                    })
                }, n
            }, ["createOffer", "createAnswer"].forEach(function (e) {
                var i = webkitRTCPeerConnection.prototype[e];
                webkitRTCPeerConnection.prototype[e] = function () {
                    var n = this;
                    if (arguments.length < 1 || 1 === arguments.length && "object" === a()(arguments[0])) {
                        var r = 1 === arguments.length ? arguments[0] : void 0;
                        return new Promise(function (e, t) {
                            i.apply(n, [e, t, r])
                        })
                    }
                    return i.apply(this, arguments)
                }
            }), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                var i = webkitRTCPeerConnection.prototype[e];
                webkitRTCPeerConnection.prototype[e] = function () {
                    var n = arguments, r = this;
                    return new Promise(function (e, t) {
                        i.apply(r, [n[0], function () {
                            e(), 2 <= n.length && n[1].apply(null, [])
                        }, function (e) {
                            t(e), 3 <= n.length && n[2].apply(null, [e])
                        }])
                    })
                }
            });
            var S = function (i) {
                if ("object" !== a()(i) || i.mandatory || i.optional) return i;
                var o = {};
                return Object.keys(i).forEach(function (t) {
                    if ("require" !== t && "advanced" !== t && "mediaSource" !== t) {
                        var n = "object" === a()(i[t]) ? i[t] : {ideal: i[t]};
                        void 0 !== n.exact && "number" == typeof n.exact && (n.min = n.max = n.exact);
                        var r = function (e, t) {
                            return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                        };
                        if (void 0 !== n.ideal) {
                            o.optional = o.optional || [];
                            var e = {};
                            "number" == typeof n.ideal ? (e[r("min", t)] = n.ideal, o.optional.push(e), (e = {})[r("max", t)] = n.ideal) : e[r("", t)] = n.ideal, o.optional.push(e)
                        }
                        void 0 !== n.exact && "number" != typeof n.exact ? (o.mandatory = o.mandatory || {}, o.mandatory[r("", t)] = n.exact) : ["min", "max"].forEach(function (e) {
                            void 0 !== n[e] && (o.mandatory = o.mandatory || {}, o.mandatory[r(e, t)] = n[e])
                        })
                    }
                }), i.advanced && (o.optional = (o.optional || []).concat(i.advanced)), o
            };
            if (i = function (e, t, n) {
                return e.audio && (e.audio = S(e.audio)), e.video && (e.video = S(e.video)), v.log("chrome: " + JSON.stringify(e)), navigator.webkitGetUserMedia(e, t, n)
            }, navigator.getUserMedia = i, navigator.mediaDevices || (navigator.mediaDevices = {
                getUserMedia: _, enumerateDevices: function () {
                    return new Promise(function (t) {
                        var n = {audio: "audioinput", video: "videoinput"};
                        return MediaStreamTrack.getSources(function (e) {
                            t(e.map(function (e) {
                                return {label: e.label, kind: n[e.kind], deviceId: e.id, groupId: ""}
                            }))
                        })
                    })
                }
            }), navigator.mediaDevices.getUserMedia) {
                var b = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = function (e) {
                    return v.log("spec:   " + JSON.stringify(e)), e.audio = S(e.audio), e.video = S(e.video), v.log("chrome: " + JSON.stringify(e)), b(e)
                }
            } else navigator.mediaDevices.getUserMedia = function (e) {
                return _(e)
            };
            void 0 === navigator.mediaDevices.addEventListener && (navigator.mediaDevices.addEventListener = function () {
                v.log("Dummy mediaDevices.addEventListener called.")
            }), void 0 === navigator.mediaDevices.removeEventListener && (navigator.mediaDevices.removeEventListener = function () {
                v.log("Dummy mediaDevices.removeEventListener called.")
            }), o = function (e, t) {
                43 <= d ? p(e, t) : void 0 !== e.src ? e.src = t ? URL.createObjectURL(t) : null : v.log("Error attaching stream to element.")
            }, s = function (e, t) {
                43 <= d ? p(e, f(t)) : e.src = t.src
            }
        } else navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) ? (v.log("This appears to be Edge"), c = "edge", d = v.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2), u = 12) : v.log("Browser does not appear to be WebRTC-capable"); else v.log("This does not appear to be a browser"), c = "not a browser";

        function _(n) {
            return new Promise(function (e, t) {
                i(n, e, t)
            })
        }

        var I, w = {};
        try {
            Object.defineProperty(w, "version", {
                set: function (e) {
                    d = e
                }
            })
        } catch (e) {
        }
        l ? I = l : "undefined" != typeof window && (I = window.RTCPeerConnection)
    }, function (e, t, n) {
        var i = n(16);
        e.exports = function (t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = null != arguments[e] ? arguments[e] : {}, r = Object.keys(n);
                "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter(function (e) {
                    return Object.getOwnPropertyDescriptor(n, e).enumerable
                }))), r.forEach(function (e) {
                    i(t, e, n[e])
                })
            }
            return t
        }
    }, function (e, t, n) {
        var a = n(14), s = n(15);
        e.exports = function (e, t, n) {
            var r = t && n || 0;
            "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
            var i = (e = e || {}).random || (e.rng || a)();
            if (i[6] = 15 & i[6] | 64, i[8] = 63 & i[8] | 128, t) for (var o = 0; o < 16; ++o) t[r + o] = i[o];
            return t || s(i)
        }
    }, function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
            return s
        });
        var r = window.AudioContext || window.webkitAudioContext, i = n(3), o = i.getParameter, a = i.setParameter, s = function () {
            return o("AUDIO_CONTEXT") || (console.log("Creating Audio Context"), a("AUDIO_CONTEXT", function () {
                if (r) return new r;
                throw new Error("AUDIO_CONTEXT_NOT_SUPPORTED")
            }())), o("AUDIO_CONTEXT")
        }
    }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var r, i, l = n(0), o = n(8);
        (i = r || (r = {})).NEW = "new", i.PREPARING_OFFER = "preparing-offer", i.OFFER_SENT = "offer-sent", i.ESTABLISHED = "established", i.CLOSED = "closed";
        var a = function () {
            function e(e) {
                this.candidate = null, this.state = r.NEW, this.config = e, this.isSubscriber = this.config.isSubscriber, this.peerConnection = this.initPeecConnection(e), this.peerConnection.onicecandidate = this._onicecandidate.bind(this), this.peerConnection.oniceconnectionstatechange = this._oniceconnectionstatechange.bind(this), this.peerConnection.onaddstream = this._onaddstream.bind(this), this.peerConnection.ontrack = this._ontrack.bind(this), this.processSignalingMessage = this.setAnswer.bind(this), this.peerConnection.createOffer({
                    offerToReceiveAudio: !0,
                    offerToReceiveVideo: !0
                }).then(this.setLocalSDP.bind(this)), this.sendVideoStats = {
                    id: "",
                    type: "",
                    mediaType: "",
                    googCodecName: "h264" === this.config.codec ? "H264" : "VP8",
                    bytesSent: "0",
                    packetsLost: "0",
                    packetsSent: "0",
                    googAdaptationChanges: "0",
                    googAvgEncodeMs: "0",
                    googEncodeUsagePercent: "0",
                    googFirsReceived: "0",
                    googFrameHeightSent: "0",
                    googFrameHeightInput: "0",
                    googFrameRateInput: "0",
                    googFrameRateSent: "0",
                    googFrameWidthSent: "0",
                    googFrameWidthInput: "0",
                    googNacksReceived: "0",
                    googPlisReceived: "0",
                    googRtt: "0",
                    googFramesEncoded: "0"
                }, this.sendAudioStats = {
                    id: "",
                    type: "",
                    mediaType: "",
                    googCodecName: "opus",
                    aecDivergentFilterFraction: "0",
                    audioInputLevel: "0",
                    bytesSent: "0",
                    packetsSent: "0",
                    googEchoCancellationReturnLoss: "0",
                    googEchoCancellationReturnLossEnhancement: "0"
                }, this.receiveAudioStats = {
                    id: "",
                    type: "",
                    mediaType: "",
                    audioOutputLevel: "0",
                    bytesReceived: "0",
                    packetsLost: "0",
                    packetsReceived: "0",
                    googAccelerateRate: "0",
                    googCurrentDelayMs: "0",
                    googDecodingCNG: "0",
                    googDecodingCTN: "0",
                    googDecodingCTSG: "0",
                    googDecodingNormal: "0",
                    googDecodingPLC: "0",
                    googDecodingPLCCNG: "0",
                    googExpandRate: "0",
                    googJitterBufferMs: "0",
                    googJitterReceived: "0",
                    googPreemptiveExpandRate: "0",
                    googPreferredJitterBufferMs: "0",
                    googSecondaryDecodedRate: "0",
                    googSpeechExpandRate: "0"
                }, this.receiveVideoStats = {
                    id: "",
                    type: "",
                    mediaType: "",
                    googTargetDelayMs: "0",
                    packetsLost: "0",
                    googDecodeMs: "0",
                    googMaxDecodeMs: "0",
                    googRenderDelayMs: "0",
                    googFrameWidthReceived: "0",
                    googFrameHeightReceived: "0",
                    googFrameRateReceived: "0",
                    googFrameRateDecoded: "0",
                    googFrameRateOutput: "0",
                    googFramesDecoded: "0",
                    googFrameReceived: "0",
                    googJitterBufferMs: "0",
                    googCurrentDelayMs: "0",
                    googMinPlayoutDelayMs: "0",
                    googNacksSent: "0",
                    googPlisSent: "0",
                    googFirsSent: "0",
                    bytesReceived: "0",
                    packetsReceived: "0"
                }
            }

            return e.prototype.addStream = function (e) {
                this.peerConnection.addStream(e)
            }, e.prototype.setAnswer = function (e) {
                var t = JSON.parse(e);
                this.peerConnection.setRemoteDescription(new RTCSessionDescription({
                    sdp: t.sdp,
                    type: "answer"
                })), this.onsignalingmessage && this.onsignalingmessage("")
            }, e.prototype.close = function () {
                this.peerConnection.close()
            }, e.prototype.getStats = function (e, t) {
                if (void 0 === t && (t = 500), t = 500 < t ? 500 : t, Date.now() - this.lastTimeGetStats < t) {
                    var n = [];
                    this.config.isSubscriber ? (n.push(this.receiveVideoStats), n.push(this.receiveAudioStats)) : (n.push(this.sendAudioStats), n.push(this.sendVideoStats)), n.push({
                        id: "time",
                        startTime: this.connectedTime,
                        timestamp: Date.now()
                    }), e && e(n)
                } else this._getStats(e)
            }, e.prototype._getStats = function (e) {
                var r = this, t = [];
                this.peerConnection.getStats(null).then(function (n) {
                    r.lastTimeGetStats = Date.now(), Object.keys(n).map(function (e) {
                        var t = n[e];
                        r.config.isSubscriber ? t.type && "inboundrtp" === t.type && t.mediaType && "audio" === t.mediaType ? (r.receiveAudioStats.id = t.id + "recv", r.receiveAudioStats.type = t.type + "", r.receiveAudioStats.mediaType = t.mediaType + "", r.receiveAudioStats.packetsReceived = t.packetsReceived + "", r.receiveAudioStats.bytesReceived = t.bytesReceived + "", r.receiveAudioStats.packetsLost = t.packetsLost + "", r.receiveAudioStats.googJitterReceived = t.jitter + "") : t.type && "inboundrtp" === t.type && t.mediaType && "video" === t.mediaType ? (r.receiveVideoStats.id = t.id + "recv", r.receiveVideoStats.type = t.type + "", r.receiveVideoStats.mediaType = t.mediaType + "", r.receiveVideoStats.packetsReceived = t.packetsReceived + "", r.receiveVideoStats.bytesReceived = t.bytesReceived + "", r.receiveVideoStats.packetsLost = t.packetsLost + "", r.receiveVideoStats.googJitterBufferMs = t.jitter + "", r.receiveVideoStats.googPlisSent = t.pliCount + "", r.receiveVideoStats.googFirsSent = t.firCount + "", r.receiveVideoStats.googNacksSent = t.nackCount + "") : t.remoteSource && t.type && "track" === t.type && t.trackIdentifier && -1 !== t.trackIdentifier.indexOf("v") ? (r.receiveVideoStats.googFrameHeightReceived = t.frameHeight + "", r.receiveVideoStats.googFrameWidthReceived = t.frameWidth + "", r.receiveVideoStats.googFrameRateDecoded = t.framesPerSecond + "", r.receiveVideoStats.googFrameRateOutput = t.framesPerSecond + "", r.receiveVideoStats.googFrameRateReceived = t.framesPerSecond + "", r.receiveVideoStats.googFramesDecoded = t.framesDecoded + "", r.receiveVideoStats.googFrameReceived = t.framesReceived + "") : t.remoteSource && t.type && "track" === t.type && t.trackIdentifier && -1 !== t.trackIdentifier.indexOf("a") && (r.receiveAudioStats.audioOutputLevel = t.audioLevel + "") : !t.isRemote && t.type && "outboundrtp" === t.type && t.mediaType && "audio" === t.mediaType ? (r.sendAudioStats.id = t.id + "send", r.sendAudioStats.type = t.type + "", r.sendAudioStats.mediaType = t.mediaType + "", r.sendAudioStats.packetsSent = t.packetsSent + "", r.sendAudioStats.bytesSent = t.bytesSent + "") : !t.isRemote && t.type && "outboundrtp" === t.type && t.mediaType && "video" === t.mediaType ? (r.sendVideoStats.id = t.id + "send", r.sendVideoStats.type = t.type + "", r.sendVideoStats.mediaType = t.mediaType + "", r.sendVideoStats.packetsSent = t.packetsSent + "", r.sendVideoStats.bytesSent = t.bytesSent + "", r.sendVideoStats.googRtt = t.roundTripTime + "", r.sendVideoStats.googPlisReceived = t.pliCount + "", r.sendVideoStats.googFirsReceived = t.firCount + "", r.sendVideoStats.googNacksReceived = t.nackCount + "") : !t.remoteSource && t.type && "track" === t.type && t.framesSent && 0 !== t.framesSent && (r.sendVideoStats.googFrameHeightSent = t.frameHeight + "", r.sendVideoStats.googFrameHeightInput = t.frameHeight + "", r.sendVideoStats.googFrameWidthSent = t.frameWidth + "", r.sendVideoStats.googFrameWidthInput = t.frameWidth + "", r.sendVideoStats.googFramesEncoded = t.framesSent + "", r.sendVideoStats.googFrameRateSent = t.framesPerSecond + "")
                    }), r.config.isSubscriber ? (t.push(r.receiveVideoStats), t.push(r.receiveAudioStats)) : (t.push(r.sendAudioStats), t.push(r.sendVideoStats)), t.push({
                        id: "time",
                        startTime: r.connectedTime,
                        timestamp: Date.now()
                    }), e && e(t)
                })
            }, e.prototype.getStatsRate = function (e) {
                this.getStats(e)
            }, e.prototype.initPeecConnection = function (e) {
                var t = e.stunServerUrl, n = e.turnServer, r = e.iceServers;
                return this.pcConfig = {iceServers: [{urls: "stun:webcs.agora.io:3478"}]}, r instanceof Array ? this.pcConfig.iceServers = e.iceServers : t && (t instanceof Array ? t.map(function (e) {
                    "string" == typeof e && "" !== e && this.pcConfig.iceServers.push({urls: e})
                }) : "string" == typeof t && "" !== t && this.pcConfig.iceServers.push({urls: t})), n && (n instanceof Array ? n.map(function (e) {
                    "string" == typeof e.url && "" !== e.url && this.pcConfig.iceServers.push({
                        username: e.username,
                        credential: e.credential,
                        url: e.url
                    })
                }) : "string" == typeof n.url && "" !== n.url && (this.pcConfig.iceServers.push({
                    username: n.username,
                    credential: n.credential,
                    credentialType: "password",
                    urls: "turn:" + n.url + ":" + n.udpport + "?transport=udp"
                }), "string" == typeof n.tcpport && "" !== n.tcpport && this.pcConfig.iceServers.push({
                    username: n.username,
                    credential: n.credential,
                    credentialType: "password",
                    urls: "turn:" + n.url + ":" + n.tcpport + "?transport=tcp"
                }), !0 === n.forceturn && (this.pcConfig.iceTransportPolicy = "relay"))), new o.RTCPeerConnection(this.pcConfig)
            }, e.prototype._ontrack = function (e) {
                this.onaddstream && this.onaddstream(e, "ontrack")
            }, e.prototype._onaddstream = function (e) {
                this.onaddstream && this.onaddstream(e, "onaddstream")
            }, e.prototype._oniceconnectionstatechange = function (e) {
                "connected" === e.currentTarget.iceConnectionState && (this.state = r.ESTABLISHED, this.connectedTime = Date.now()), this.oniceconnectionstatechange && this.oniceconnectionstatechange(e.currentTarget.iceConnectionState)
            }, e.prototype._onicecandidate = function (e) {
                !this.candidate && e && (this.candidate = e.candidate, this.peerConnection.createOffer({
                    offerToReceiveAudio: !0,
                    offerToReceiveVideo: !0
                }).then(this.editLocalSDP.bind(this)).then(this.setLocalSDP.bind(this)).then(this.sendOffer.bind(this)).catch())
            }, e.prototype.setLocalSDP = function (e) {
                return this.peerConnection.setLocalDescription(new RTCSessionDescription({
                    sdp: e.sdp,
                    type: "offer"
                })), this.state = r.PREPARING_OFFER, e
            }, e.prototype.editLocalSDP = function (e) {
                return e.sdp = this.setBandWidth(e.sdp), e.sdp = this.reviseOpus(e.sdp), e.sdp = this.addCandidate(e.sdp), e
            }, e.prototype.setSendRecv = function (e) {
                return (e = (e = e.replace(/a=recvonly\r\n/g, "a=sendrecv\r\n")).replace(/a=sendonly\r\n/g, "a=sendrecv\r\n")).replace(/a=inactive\r\n/g, "a=sendrecv\r\n")
            }, e.prototype.setBandWidth = function (e) {
                var t, n, r = this.config, i = r.codec, o = r.minVideoBW, a = r.maxVideoBW, s = r.maxAudioBW, c = r.clientId;
                if ((t = e.match(/m=video.*\r\n/)) && o && a) {
                    n = t[0] + "b=AS:" + a + "\r\n";
                    var d = 0, u = 0;
                    "h264" === i ? (d = e.search(/a=rtpmap:(\d+) H264\/90000\r\n/), u = e.search(/H264\/90000\r\n/)) : "vp8" === i && (d = e.search(/a=rtpmap:(\d+) VP8\/90000\r\n/), u = e.search(/VP8\/90000\r\n/)), -1 !== d && -1 !== u && 10 < u - d && (n = n + "a=fmtp:" + e.slice(d + 9, u - 1) + " x-google-min-bitrate=" + o + "\r\n"), e = e.replace(t[0], n), l.default.debug("[" + c + "]Set Video Bitrate - min:" + o + " max:" + a)
                }
                return (t = e.match(/m=audio.*\r\n/)) && s && (n = t[0] + "b=AS:" + s + "\r\n", e = e.replace(t[0], n)), e
            }, e.prototype.reviseOpus = function (e) {
                return (e = e.replace(/a=rtpmap:102 opus\/48000\/2/g, "a=rtpmap:111 opus/48000/2")).replace(/m=audio 9 UDP\/TLS\/RTP\/SAVPF 102 0 8 97 13 118 101/g, "m=audio 9 UDP/TLS/RTP/SAVPF 111 0 8 97 13 118 101")
            }, e.prototype.addCandidate = function (e) {
                return e + "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n"
            }, e.prototype.sendOffer = function (e) {
                this.config.callback(JSON.stringify({
                    sdp: e.sdp,
                    messageType: "OFFER",
                    tiebreaker: Math.floor(429496723 * Math.random() + 1)
                })), this.state = r.OFFER_SENT
            }, e
        }();
        t.default = a
    }, function (e, t, n) {
        "use strict";
        var r = this && this.__awaiter || function (o, a, s, c) {
            return new (s || (s = Promise))(function (e, t) {
                function n(e) {
                    try {
                        i(c.next(e))
                    } catch (e) {
                        t(e)
                    }
                }

                function r(e) {
                    try {
                        i(c.throw(e))
                    } catch (e) {
                        t(e)
                    }
                }

                function i(t) {
                    t.done ? e(t.value) : new s(function (e) {
                        e(t.value)
                    }).then(n, r)
                }

                i((c = c.apply(o, a || [])).next())
            })
        }, s = this && this.__generator || function (n, r) {
            var i, o, a, e, s = {
                label: 0, sent: function () {
                    if (1 & a[0]) throw a[1];
                    return a[1]
                }, trys: [], ops: []
            };
            return e = {next: t(0), throw: t(1), return: t(2)}, "function" == typeof Symbol && (e[Symbol.iterator] = function () {
                return this
            }), e;

            function t(t) {
                return function (e) {
                    return function (t) {
                        if (i) throw new TypeError("Generator is already executing.");
                        for (; s;) try {
                            if (i = 1, o && (a = 2 & t[0] ? o.return : t[0] ? o.throw || ((a = o.return) && a.call(o), 0) : o.next) && !(a = a.call(o, t[1])).done) return a;
                            switch (o = 0, a && (t = [2 & t[0], a.value]), t[0]) {
                                case 0:
                                case 1:
                                    a = t;
                                    break;
                                case 4:
                                    return s.label++, {value: t[1], done: !1};
                                case 5:
                                    s.label++, o = t[1], t = [0];
                                    continue;
                                case 7:
                                    t = s.ops.pop(), s.trys.pop();
                                    continue;
                                default:
                                    if (!(a = 0 < (a = s.trys).length && a[a.length - 1]) && (6 === t[0] || 2 === t[0])) {
                                        s = 0;
                                        continue
                                    }
                                    if (3 === t[0] && (!a || t[1] > a[0] && t[1] < a[3])) {
                                        s.label = t[1];
                                        break
                                    }
                                    if (6 === t[0] && s.label < a[1]) {
                                        s.label = a[1], a = t;
                                        break
                                    }
                                    if (a && s.label < a[2]) {
                                        s.label = a[2], s.ops.push(t);
                                        break
                                    }
                                    a[2] && s.ops.pop(), s.trys.pop();
                                    continue
                            }
                            t = r.call(n, s)
                        } catch (e) {
                            t = [6, e], o = 0
                        } finally {
                            i = a = 0
                        }
                        if (5 & t[0]) throw t[1];
                        return {value: t[0] ? t[1] : void 0, done: !0}
                    }([t, e])
                }
            }
        }, i = this;
        t.__esModule = !0;
        var c = n(17), d = n(2), u = n(0);
        t.getSupportedCodec = function (a) {
            return r(i, void 0, void 0, function () {
                var t, i, o, n, r;
                return s(this, function (e) {
                    switch (e.label) {
                        case 0:
                            return t = {
                                video: [],
                                audio: []
                            }, "undefined" != typeof window ? [3, 1] : (u.default.error("getSupportedCodec: NOT_BROWSER_ENV"), [2, Promise.reject("NOT_BROWSER_ENV")]);
                        case 1:
                            try {
                                i = c.createRTCPeerConnection({iceServers: []})
                            } catch (e) {
                                return u.default.error("Failed to init RTCPeerConnection", e), [2, Promise.reject(e)]
                            }
                            return i ? [3, 2] : (u.default.warning("getSupportedCodec: no RTCPeerConnection constructor is detected"), [2, Promise.resolve(t)]);
                        case 2:
                            return a && a.stream ? [3, 7] : (o = {
                                mandatory: {
                                    OfferToReceiveAudio: !0,
                                    OfferToReceiveVideo: !0
                                }
                            }, n = void 0, (d.isSafari() || d.isFireFox() || d.isWeChatBrowser()) && i.addTransceiver ? (i.addTransceiver("audio"), i.addTransceiver("video"), [4, i.createOffer()]) : [3, 4]);
                        case 3:
                            return n = e.sent(), [3, 6];
                        case 4:
                            return [4, new Promise(function (t, n) {
                                var r = setTimeout(function () {
                                    n("CREATEOFFER_TIMEOUT")
                                }, 3e3);
                                i.createOffer(function (e) {
                                    clearTimeout(r), t(e)
                                }, function (e) {
                                    clearTimeout(r), n(e)
                                }, o)
                            })];
                        case 5:
                            n = e.sent(), e.label = 6;
                        case 6:
                            return i.close(), r = n.sdp, [2, l(r)];
                        case 7:
                            return a.stream.getTracks && i.addTrack ? a.stream.getTracks().forEach(function (e) {
                                i.addTrack(e, a.stream)
                            }) : i.addStream(a.stream), n = void 0, d.isSafari() || d.isFireFox() ? [4, i.createOffer()] : [3, 9];
                        case 8:
                            return n = e.sent(), [3, 11];
                        case 9:
                            return [4, new Promise(function (e, t) {
                                i.createOffer(e, t)
                            })];
                        case 10:
                            n = e.sent(), e.label = 11;
                        case 11:
                            return i.close(), r = n.sdp, [2, l(r)]
                    }
                })
            })
        };
        var l = function (e) {
            var t = {video: [], audio: []};
            return e.match(/ VP8/i) && t.video.push("VP8"), e.match(/ H264/i) && t.video.push("H264"), e.match(/ opus/i) && t.audio.push("OPUS"), Promise.resolve(t)
        }
    }, function (e, t) {
        var n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
        if (n) {
            var r = new Uint8Array(16);
            e.exports = function () {
                return n(r), r
            }
        } else {
            var i = new Array(16);
            e.exports = function () {
                for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()), i[t] = e >>> ((3 & t) << 3) & 255;
                return i
            }
        }
    }, function (e, t) {
        for (var i = [], n = 0; n < 256; ++n) i[n] = (n + 256).toString(16).substr(1);
        e.exports = function (e, t) {
            var n = t || 0, r = i;
            return [r[e[n++]], r[e[n++]], r[e[n++]], r[e[n++]], "-", r[e[n++]], r[e[n++]], "-", r[e[n++]], r[e[n++]], "-", r[e[n++]], r[e[n++]], "-", r[e[n++]], r[e[n++]], r[e[n++]], r[e[n++]], r[e[n++]], r[e[n++]]].join("")
        }
    }, function (e, t) {
        e.exports = function (e, t, n) {
            return t in e ? Object.defineProperty(e, t, {value: n, enumerable: !0, configurable: !0, writable: !0}) : e[t] = n, e
        }
    }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var r = "object" == typeof window && window.RTCPeerConnection, i = "object" == typeof window && window.webkitRTCPeerConnection,
            o = "object" == typeof window && window.mozRTCPeerConnection;
        t.createRTCPeerConnection = function (e) {
            var t = r || i || o;
            return t ? new t(e) : null
        }
    }, function (e, t, n) {
        "use strict";
        n.r(t);
        var _ = n(3), I = n(0), w = n(1), T = function () {
            var r = {dispatcher: {}};
            return r.dispatcher.eventListeners = {}, r.addEventListener = function (e, t) {
                void 0 === r.dispatcher.eventListeners[e] && (r.dispatcher.eventListeners[e] = []), r.dispatcher.eventListeners[e].push(t)
            }, r.hasListeners = function (e) {
                return !(!r.dispatcher.eventListeners[e] || !r.dispatcher.eventListeners[e].length)
            }, r.on = r.addEventListener, r.removeEventListener = function (e, t) {
                var n;
                -1 !== (n = r.dispatcher.eventListeners[e].indexOf(t)) && r.dispatcher.eventListeners[e].splice(n, 1)
            }, r.dispatchEvent = function (e) {
                var t;
                for (t in r.dispatcher.eventListeners[e.type]) r.dispatcher.eventListeners[e.type] && r.dispatcher.eventListeners[e.type].hasOwnProperty(t) && "function" == typeof r.dispatcher.eventListeners[e.type][t] && r.dispatcher.eventListeners[e.type][t](e)
            }, r.dispatchSocketEvent = function (e) {
                var t;
                for (t in r.dispatcher.eventListeners[e.type]) r.dispatcher.eventListeners[e.type] && r.dispatcher.eventListeners[e.type].hasOwnProperty(t) && "function" == typeof r.dispatcher.eventListeners[e.type][t] && r.dispatcher.eventListeners[e.type][t](e.msg)
            }, r
        }, r = function (e) {
            var t = {};
            return t.type = e.type, t
        }, C = function (e) {
            var t = r(e);
            return t.stream = e.stream, t.reason = e.reason, t.msg = e.msg, t
        }, E = function (e) {
            var t = r(e);
            return t.uid = e.uid, t.attr = e.attr, t.stream = e.stream, t
        }, O = function (e) {
            var t = r(e);
            return t.msg = e.msg, t
        }, k = function (e) {
            var t = r(e);
            return t.url = e.url, t.uid = e.uid, t.status = e.status, t.reason = e.reason, t
        }, R = n(2), o = function () {
        };
        o.prototype.set = function (e, t) {
            -1 < ["BatteryLevel"].indexOf(e) && (this[e] = t)
        };
        var a = new function () {
                var i = T();
                return i.states = {
                    UNINIT: "UNINIT",
                    INITING: "INITING",
                    INITED: "INITED"
                }, i.state = i.states.UNINIT, i.batteryManager = null, i._init = function (t, e) {
                    i.state = i.states.INITING, navigator.getBattery ? navigator.getBattery().then(function (e) {
                        i.batteryManager = e, t && setTimeout(function () {
                            t()
                        }, 0)
                    }).catch(function (e) {
                        I.default.debug("navigator.getBattery is disabled", e), t && t()
                    }) : (i.state = i.states.INITED, t && t())
                }, i._getBatteryStats = function () {
                    var e = {};
                    return i.batteryManager && i.batteryManager.level ? e.BatteryLevel = Math.floor(100 * i.batteryManager.level) : e.BatteryLevel = "UNSUPPORTED", e
                }, i.getStats = function (e, t) {
                    var n = new o, r = i._getBatteryStats();
                    r && r.BatteryLevel && n.set("BatteryLevel", r.BatteryLevel), e && e(n)
                }, i._init(), i
            }, i = n(4), A = n.n(i), h = n(8), m = {
                101100: "NO_FLAG_SET",
                101101: "FLAG_SET_BUT_EMPTY",
                101102: "INVALID_FALG_SET",
                101203: "NO_SERVICE_AVIABLE",
                0: "OK_CODE",
                5: "INVALID_VENDOR_KEY",
                7: "INVALID_CHANNEL_NAME",
                8: "INTERNAL_ERROR",
                9: "NO_AUTHORIZED",
                10: "DYNAMIC_KEY_TIMEOUT",
                11: "NO_ACTIVE_STATUS",
                13: "DYNAMIC_KEY_EXPIRED",
                14: "STATIC_USE_DYANMIC_KEY",
                15: "DYNAMIC_USE_STATIC_KEY"
            }, P = {
                2e3: "ERR_NO_VOCS_AVAILABLE",
                2001: "ERR_NO_VOS_AVAILABLE",
                2002: "ERR_JOIN_CHANNEL_TIMEOUT",
                2003: "WARN_REPEAT_JOIN",
                2004: "ERR_JOIN_BY_MULTI_IP",
                101: "ERR_INVALID_VENDOR_KEY",
                102: "ERR_INVALID_CHANNEL_NAME",
                103: "WARN_NO_AVAILABLE_CHANNEL",
                104: "WARN_LOOKUP_CHANNEL_TIMEOUT",
                105: "WARN_LOOKUP_CHANNEL_REJECTED",
                106: "WARN_OPEN_CHANNEL_TIMEOUT",
                107: "WARN_OPEN_CHANNEL_REJECTED",
                108: "WARN_REQUEST_DEFERRED",
                109: "ERR_DYNAMIC_KEY_TIMEOUT",
                110: "ERR_NO_AUTHORIZED",
                111: "ERR_VOM_SERVICE_UNAVAILABLE",
                112: "ERR_NO_CHANNEL_AVAILABLE_CODE",
                113: "ERR_TOO_MANY_USERS",
                114: "ERR_MASTER_VOCS_UNAVAILABLE",
                115: "ERR_INTERNAL_ERROR",
                116: "ERR_NO_ACTIVE_STATUS",
                117: "ERR_INVALID_UID",
                118: "ERR_DYNAMIC_KEY_EXPIRED",
                119: "ERR_STATIC_USE_DYANMIC_KE",
                120: "ERR_DYNAMIC_USE_STATIC_KE",
                2: "K_TIMESTAMP_EXPIRED",
                3: "K_CHANNEL_PERMISSION_INVALID",
                4: "K_CERTIFICATE_INVALID",
                5: "K_CHANNEL_NAME_EMPTY",
                6: "K_CHANNEL_NOT_FOUND",
                7: "K_TICKET_INVALID",
                8: "K_CHANNEL_CONFLICTED",
                9: "K_SERVICE_NOT_READY",
                10: "K_SERVICE_TOO_HEAVY",
                14: "K_UID_BANNED",
                15: "K_IP_BANNED",
                16: "K_CHANNEL_BANNED"
            }, b = ["NO_SERVICE_AVIABLE"],
            D = {19: "ERR_ALREADY_IN_USE", 10: "ERR_TIMEDOUT", 3: "ERR_NOT_READY", 9: "ERR_NO_PERMISSION", 0: "UNKNOW_ERROR"},
            s = "INVALID_CLIENT_MODE", c = "INVALID_CLIENT_CODEC", d = "CLIENT_MODE_CODEC_MISMATCH", v = "WEB_API_NOT_SUPPORTED",
            N = "INVALID_PARAMETER", M = "INVALID_OPERATION", x = "INVALID_LOCAL_STREAM", L = "INVALID_REMOTE_STREAM", u = "STREAM_ALREADY_PUBLISHED",
            l = "STREAM_NOT_YET_PUBLISHED", j = "SOCKET_ERROR", U = "SOCKET_DISCONNECTED", B = "PEERCONNECTION_FAILED", V = "JOIN_CHANNEL_FAILED",
            F = "PUBLISH_STREAM_FAILED", W = "SUBSCRIBE_STREAM_FAILED", H = "UNSUBSCRIBE_STREAM_FAILED", G = "NO_SUCH_REMOTE_STREAM",
            p = "IOS_NOT_SUPPORT", g = "WECHAT_NOT_SUPPORT", y = "SHARING_SCREEN_NOT_SUPPORT", S = "STILL_ON_PUBLISHING",
            q = "LOW_STREAM_ALREADY_PUBLISHED", J = "LOW_STREAM_ALREADY_PUBLISHED", K = "HIGH_STREAM_NOT_VIDEO_TRACE", f = "NOT_FIND_DEVICE_BY_LABEL",
            z = "ENABLE_DUALSTREAM_FAILED", Y = "DISABLE_DUALSTREAM_FAILED", Q = "PLAYER_NOT_FOUND", X = "BAD_ENVIRONMENT", $ = 0, Z = function (c) {
                var d = function (e) {
                    var t = T();
                    return t.url = ".", t
                }();
                d.id = c.id, d.playerId = $++, d.fit = c.options && c.options.fit, "contain" !== d.fit && "cover" !== d.fit && (d.fit = null), d.url = c.url, d.stream = c.stream.stream, d.elementID = c.elementID, d.setAudioOutput = function (e, t, n) {
                    var r = d.video || d.audio;
                    return r ? r.setSinkId ? void r.setSinkId(e).then(function () {
                        return I.default.debug("[" + d.id + "] " + "video ".concat(d.id, " setAudioOutput ").concat(e, " SUCCESS")), r == d.video && d.audio ? d.audio.setSinkId(e) : Promise.resolve()
                    }).then(function () {
                        return I.default.debug("[" + d.id + "] " + "audio ".concat(d.id, " setAudioOutput ").concat(e, " SUCCESS")), t && t()
                    }).catch(function (e) {
                        return I.default.error("[" + d.id + "] VideoPlayer.setAudioOutput", e), n && n(e)
                    }) : (I.default.error("[" + d.id + "] ", v), n && n(v)) : (I.default.error("[" + d.id + "] ", Q), n && n(Q))
                }, d.destroy = function () {
                    I.default.debug("destroy ".concat(c.stream.local ? "local" : "remote", " Player ").concat(d.id)), Object(h.setSrcObject)(d.video, null), Object(h.setSrcObject)(d.audio, null), d.video.pause(), delete d.resizer, clearInterval(d.mediaPlayerTimer), d.mediaPlayerTimer = null, document.getElementById(d.div.id) && d.parentNode.contains(d.div) && d.parentNode.removeChild(d.div), ["video", "audio"].forEach(function (e) {
                        d[e];
                        var t = l[e];
                        clearTimeout(t.playDeferTimeout), t.formerMediaState = null;
                        var n = {
                            playerId: d.playerId,
                            stateId: t.stateId + 1,
                            playDeferTimeout: null,
                            error: !1,
                            status: "aborted",
                            reason: "stop",
                            updatedAt: Date.now()
                        };
                        l[e] = n;
                        var r = {type: "player-status-change", playerId: d.playerId, mediaType: e, status: n.status, reason: n.reason, isErrorState: !1};
                        I.default.debug("Media Player Status Change Triggered by destroy()", r), c.stream.dispatchEvent(r), w.b.reportApiInvoke(c.stream.sid, {
                            name: "Stream.playerStatusChange",
                            options: r,
                            tag: "tracer"
                        })()
                    })
                }, d.div = document.createElement("div"), d.div.setAttribute("id", "player_" + d.id), c.stream.video ? d.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;") : d.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"), d.video = document.createElement("video"), d.video.setAttribute("id", "video" + d.id), c.stream.local && !c.stream.screen ? c.stream.mirror ? d.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; transform: rotateY(180deg); object-fit: ".concat(d.fit || "cover", ";")) : d.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; object-fit: ".concat(d.fit || "cover", ";")) : c.stream.video ? d.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; object-fit: ".concat(d.fit || "cover", ";")) : c.stream.screen ? d.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; object-fit: ".concat(d.fit || "contain")) : d.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; display: none; object-fit: ".concat(d.fit || "cover"));
                var e = {
                    autoplay: !0,
                    muted: !!c.stream.local || !(!R.isSafari() && "iOS" !== R.getBrowserOS()) && "video_element_muted",
                    playsinline: !0,
                    controls: !(!R.isSafari() && "iOS" !== R.getBrowserOS() || c.stream.local),
                    volume: null
                }, u = A()({}, e, c.options);
                !0 !== u.muted || u.volume || (u.volume = 0), u.autoplay && d.video.setAttribute("autoplay", ""), !0 !== u.muted && "video_element_muted" !== u.muted || (d.video.setAttribute("muted", ""), d.video.muted = !0), u.playsinline && d.video.setAttribute("playsinline", ""), u.controls && d.video.setAttribute("controls", ""), Number.isFinite(u.volume) && (d.video.volume = u.volume), d.audio = document.createElement("audio"), d.audio.setAttribute("id", "audio" + d.id), u.autoplay && d.audio.setAttribute("autoplay", ""), !0 === u.muted && d.audio.setAttribute("muted", ""), !0 === u.muted && (d.audio.muted = !0), u.playsinline && d.audio.setAttribute("playsinline", ""), Number.isFinite(u.volume) && (d.audio.volume = u.volume), void 0 !== d.elementID ? (document.getElementById(d.elementID).appendChild(d.div), d.container = document.getElementById(d.elementID)) : (document.body.appendChild(d.div), d.container = document.body), d.parentNode = d.div.parentNode;
                var l = {
                    video: {
                        playerId: d.playerId,
                        stateId: 0,
                        playDeferTimeout: null,
                        error: !1,
                        status: "init",
                        reason: null,
                        updatedAt: Date.now()
                    }, audio: {playerId: d.playerId, stateId: 0, playDeferTimeout: null, error: !1, status: "init", reason: null, updatedAt: Date.now()}
                };
                d.mediaElemExists = function (e) {
                    for (var t = e, n = 0; n < Object(_.getParameter)("MEDIA_ELEMENT_EXISTS_DEPTH") && t; n++) t = t.parentNode;
                    return !!t
                };
                var p = function (e) {
                    return d.mediaElemExists(e) ? e.paused ? "paused" : "play" : "aborted"
                }, f = function (e, t, n) {
                    var r = p(e), i = !0;
                    return "paused" === r ? ("audio" === t && !0 === n.muted && (i = !1), n.autoplay || (i = !1)) : "play" === r ? "video" === t ? i = !1 : !0 === n.muted ? e.muted && (i = !1) : e.muted || (i = !1) : "aborted" === r && (i = !1), i
                }, t = function (i) {
                    var o, a = this;
                    if (a === d.video ? o = "video" : a === d.audio && (o = "audio"), o) {
                        i.type || I.default.error("Unexpected evt", i);
                        var s = p(a);
                        clearTimeout(l[o].playDeferTimeout), l[o].playDeferTimeout = setTimeout(function () {
                            l[o].playDeferTimeout = null;
                            var e = l[o], t = p(a);
                            if (s === t) {
                                var n = {
                                    playerId: d.playerId,
                                    stateId: e.stateId + 1,
                                    playDeferTimeout: null,
                                    error: f(a, o, u),
                                    status: p(a),
                                    reason: i.type,
                                    updatedAt: Date.now()
                                };
                                if (e.status !== n.status) {
                                    l[o] = n;
                                    var r = {
                                        type: "player-status-change",
                                        playerId: d.playerId,
                                        mediaType: o,
                                        status: n.status,
                                        reason: n.reason,
                                        isErrorState: n.error
                                    };
                                    I.default.debug("Media Player Status Change", r), c.stream.dispatchEvent(r), w.b.reportApiInvoke(c.stream.sid, {
                                        name: "Stream.playerStatusChange",
                                        options: r,
                                        tag: "tracer"
                                    })()
                                }
                            } else I.default.debug("Status Change after event Triggered." + "Stream ".concat(d.id, " PlayerId ").concat(d.playerId, " mediaType ").concat(o, " Status ").concat(s, "=>").concat(t))
                        }, Object(_.getParameter)("PLAYER_STATE_DEFER"))
                    } else I.default.error("Unknown media element", a)
                };
                if (d.mediaPlayerTimer = setInterval(function () {
                    ["video", "audio"].forEach(function (e) {
                        var t = d[e], n = l[e];
                        if (!n.playDeferTimeout) {
                            var r = {
                                playerId: d.playerId,
                                stateId: n.stateId + 1,
                                playDeferTimeout: null,
                                error: f(t, e, u),
                                status: p(t),
                                reason: "timer",
                                updatedAt: Date.now()
                            };
                            if (n.status !== r.status) {
                                I.default.debug("Player ".concat(d.playerId, " ").concat(e, " Status Changed Detected by Timer: ").concat(n.status, "=>").concat(r.status)), l[e] = r;
                                var i = {
                                    type: "player-status-change",
                                    playerId: d.playerId,
                                    mediaType: e,
                                    status: r.status,
                                    reason: r.reason,
                                    isErrorState: r.error
                                };
                                I.default.debug("Media Player Status Change", i), c.stream.dispatchEvent(i), w.b.reportApiInvoke(c.stream.sid, {
                                    name: "Stream.playerStatusChange",
                                    options: i,
                                    tag: "tracer"
                                })()
                            }
                        }
                    })
                }, Object(_.getParameter)("PLAYER_STATE_DEFER")), d.video.addEventListener("playing", function (e) {
                    !function e() {
                        4 < d.video.videoWidth * d.video.videoHeight ? I.default.debug("[" + d.id + "] video dimensions:", d.video.videoWidth, d.video.videoHeight) : setTimeout(e, 50)
                    }()
                }), d.video.addEventListener("playing", t), d.video.addEventListener("canplay", t), d.video.addEventListener("abort", t), d.video.addEventListener("onerror", t), d.video.addEventListener("suspend", t), d.video.addEventListener("stalled", t), d.video.addEventListener("pause", t), d.audio.addEventListener("playing", t), d.audio.addEventListener("canplay", t), d.audio.addEventListener("abort", t), d.audio.addEventListener("onerror", t), d.audio.addEventListener("suspend", t), d.audio.addEventListener("stalled", t), d.audio.addEventListener("pause", t), c.stream.hasVideo() || c.stream.hasScreen()) d.div.appendChild(d.video), d.div.appendChild(d.audio), R.isEdge() ? d.video.srcObject = c.stream.stream : (Object(h.attachMediaStream)(d.video, c.stream.stream), Object(h.attachMediaStream)(d.audio, c.stream.stream)); else if (!1 !== u.muted && "video_element_muted" !== u.muted || (d.video.removeAttribute("muted"), d.video.muted = !1), d.div.appendChild(d.video), window.MediaStream && R.isSafari()) {
                    var n = new MediaStream(c.stream.stream.getAudioTracks());
                    Object(h.setSrcObject)(d.video, n)
                } else Object(h.setSrcObject)(d.video, c.stream.stream);
                return d.setAudioVolume = function (e) {
                    var t = parseInt(e) / 100;
                    isFinite(t) && (t < 0 ? t = 0 : 1 < t && (t = 1), d.video && (d.video.volume = t), d.audio && (d.audio.volume = t))
                }, d
            }, ee = n(12), te = n.n(ee), ne = null, re = function () {
                try {
                    ne = window.require("electron")
                } catch (e) {
                }
                return ne
            }, ie = function (e) {
                var n = w.b.reportApiInvoke(null, {callback: e, name: "getScreenSources", options: arguments, tag: "tracer"}), t = re();
                if (!t) return n && n("electron is null");
                t.desktopCapturer.getSources({types: ["window", "screen"]}, function (e, t) {
                    if (e) return n && n(e);
                    n && n(null, t)
                })
            }, oe = function (e, t, n) {
                var r = t.width;
                t = {
                    audio: !1,
                    video: {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: e,
                            maxHeight: t.height,
                            maxWidth: r,
                            maxFrameRate: t.frameRate && t.frameRate.max,
                            minFrameRate: t.frameRate && t.frameRate.min
                        }
                    }
                }, navigator.webkitGetUserMedia(t, function (e) {
                    n && n(null, e)
                }, function (e) {
                    n && n(e)
                })
            }, ae = ie, se = oe, ce = 103, de = function (e) {
                var t = {};
                if (t.clientId = e.clientId, e.session_id = ce += 1, "undefined" == typeof window || !window.navigator) throw I.default.error("[" + t.streamId + "][" + t.clientId + "]Publish/subscribe video/audio streams not supported yet"), new Error("NON_BROWSER_ENV_DETECTED");
                return null !== window.navigator.userAgent.match("Firefox") ? (t.browser = "mozilla", t = function (r) {
                    var u = {}, i = (mozRTCPeerConnection, mozRTCSessionDescription), t = !1;
                    u.uid = r.uid, u.isVideoMute = r.isVideoMute, u.isAudioMute = r.isAudioMute, u.isSubscriber = r.isSubscriber, u.clientId = r.clientId, u.filterStatsCache = [], u.originStatsCache = [], u.lastTimeGetStats = null, u.pc_config = {iceServers: []}, r.iceServers instanceof Array ? r.iceServers.map(function (e) {
                        0 === e.url.indexOf("stun:") && u.pc_config.iceServers.push({url: e.url})
                    }) : (r.stunServerUrl && (r.stunServerUrl instanceof Array ? r.stunServerUrl.map(function (e) {
                        "string" == typeof e && "" !== e && u.pc_config.iceServers.push({url: e})
                    }) : "string" == typeof r.stunServerUrl && "" !== r.stunServerUrl && u.pc_config.iceServers.push({url: r.stunServerUrl})), r.turnServer && "string" == typeof r.turnServer.url && "" !== r.turnServer.url && (u.pc_config.iceServers.push({
                        username: r.turnServer.username,
                        credential: r.turnServer.credential,
                        credentialType: "password",
                        urls: "turn:" + r.turnServer.url + ":" + r.turnServer.udpport + "?transport=udp"
                    }), "string" == typeof r.turnServer.tcpport && "" !== r.turnServer.tcpport && u.pc_config.iceServers.push({
                        username: r.turnServer.username,
                        credential: r.turnServer.credential,
                        credentialType: "password",
                        urls: "turn:" + r.turnServer.url + ":" + r.turnServer.tcpport + "?transport=tcp"
                    }), !0 === r.turnServer.forceturn && (u.pc_config.iceTransportPolicy = "relay"))), void 0 === r.audio && (r.audio = !0), void 0 === r.video && (r.video = !0), u.mediaConstraints = {
                        offerToReceiveAudio: r.audio,
                        offerToReceiveVideo: r.video,
                        mozDontOfferDataChannel: !0
                    }, u.roapSessionId = 103, u.peerConnection = new h.RTCPeerConnection(u.pc_config), I.default.debug("[" + u.clientId + ']safari Created RTCPeerConnnection with config "' + JSON.stringify(u.pc_config) + '".'), u.iceCandidateTimer = setTimeout(function () {
                        u.iceCandidateTimer = null, I.default.debug("[".concat(u.clientId, "]Candidates collected: ").concat(u.iceCandidateCount)), u.moreIceComing && (u.moreIceComing = !1, u.markActionNeeded())
                    }, Object(_.getParameter)("CANDIDATE_TIMEOUT")), u.peerConnection.onicecandidate = function (e) {
                        var t, n, r, i;
                        n = (t = u.peerConnection.localDescription.sdp).match(/a=candidate:.+typ\ssrflx.+\r\n/), r = t.match(/a=candidate:.+typ\shost.+\r\n/), i = t.match(/a=candidate:.+typ\srelay.+\r\n/), null === n && null === r && null === i || void 0 !== u.ice || !u.iceCandidateTimer || (I.default.debug("[" + u.clientId + "]srflx candidate : " + n + " relay candidate: " + i + " host candidate : " + r), clearTimeout(u.iceCandidateTimer), u.iceCandidateTimer = null, u.ice = 0, u.moreIceComing = !1, u.markActionNeeded()), u.iceCandidateCount = u.iceCandidateCount + 1
                    }, u.checkMLineReverseInSDP = function (e) {
                        return !(!~e.indexOf("m=audio") || !~e.indexOf("m=video")) && e.indexOf("m=audio") > e.indexOf("m=video")
                    }, u.reverseMLineInSDP = function (e) {
                        var t = e.split("m=audio"), n = t[1].split("m=video"), r = "m=video" + n[1], i = "m=audio" + n[0];
                        return t[0] + r + i
                    }, u.processSignalingMessage = function (e) {
                        var t, n = JSON.parse(e);
                        u.incomingMessage = n, "new" === u.state ? "OFFER" === n.messageType ? (n.sdp = o(n.sdp), t = {
                            sdp: n.sdp,
                            type: "offer"
                        }, u.peerConnection.setRemoteDescription(new i(t), function () {
                            I.default.debug("[" + u.clientId + "]setRemoteDescription succeeded")
                        }, function (e) {
                            I.default.info("[" + u.clientId + "]setRemoteDescription failed: " + e.name)
                        }), u.state = "offer-received", u.markActionNeeded()) : u.error("Illegal message for this state: " + n.messageType + " in state " + u.state) : "offer-sent" === u.state ? "ANSWER" === n.messageType ? (n.sdp = o(n.sdp), n.sdp = n.sdp.replace(/ generation 0/g, ""), n.sdp = n.sdp.replace(/ udp /g, " UDP "), -1 !== n.sdp.indexOf("a=group:BUNDLE") ? (n.sdp = n.sdp.replace(/a=group:BUNDLE audio video/, "a=group:BUNDLE sdparta_0 sdparta_1"), n.sdp = n.sdp.replace(/a=mid:audio/, "a=mid:sdparta_0"), n.sdp = n.sdp.replace(/a=mid:video/, "a=mid:sdparta_1")) : (n.sdp = n.sdp.replace(/a=mid:audio/, "a=mid:sdparta_0"), n.sdp = n.sdp.replace(/a=mid:video/, "a=mid:sdparta_0")), t = {
                            sdp: n.sdp,
                            type: "answer"
                        }, u.peerConnection.setRemoteDescription(new i(t), function () {
                            I.default.debug("[" + u.clientId + "]setRemoteDescription succeeded")
                        }, function (e) {
                            I.default.info("[" + u.clientId + "]setRemoteDescription failed: " + e)
                        }), u.sendOK(), u.state = "established") : "pr-answer" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "pr-answer"
                        }, u.peerConnection.setRemoteDescription(new i(t), function () {
                            I.default.debug("[" + u.clientId + "]setRemoteDescription succeeded")
                        }, function (e) {
                            I.default.info("[" + u.clientId + "]setRemoteDescription failed: " + e.name)
                        })) : "offer" === n.messageType ? u.error("Not written yet") : u.error("Illegal message for this state: " + n.messageType + " in state " + u.state) : "established" === u.state && ("OFFER" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "offer"
                        }, u.peerConnection.setRemoteDescription(new i(t), function () {
                            I.default.debug("[" + u.clientId + "]setRemoteDescription succeeded")
                        }, function (e) {
                            I.default.info("[" + u.clientId + "]setRemoteDescription failed: " + e.name)
                        }), u.state = "offer-received", u.markActionNeeded()) : u.error("Illegal message for this state: " + n.messageType + " in state " + u.state))
                    };
                    var l = {
                        id: "",
                        type: "",
                        mediaType: "opus",
                        googCodecName: "opus",
                        aecDivergentFilterFraction: "0",
                        audioInputLevel: "0",
                        bytesSent: "0",
                        packetsSent: "0",
                        googEchoCancellationReturnLoss: "0",
                        googEchoCancellationReturnLossEnhancement: "0"
                    }, p = {
                        id: "",
                        type: "",
                        mediaType: "",
                        googCodecName: "h264" === r.codec ? "H264" : "VP8",
                        bytesSent: "0",
                        packetsLost: "0",
                        packetsSent: "0",
                        googAdaptationChanges: "0",
                        googAvgEncodeMs: "0",
                        googEncodeUsagePercent: "0",
                        googFirsReceived: "0",
                        googFrameHeightSent: "0",
                        googFrameHeightInput: "0",
                        googFrameRateInput: "0",
                        googFrameRateSent: "0",
                        googFrameWidthSent: "0",
                        googFrameWidthInput: "0",
                        googNacksReceived: "0",
                        googPlisReceived: "0",
                        googRtt: "0"
                    }, f = {
                        id: "",
                        type: "",
                        mediaType: "",
                        audioOutputLevel: "0",
                        bytesReceived: "0",
                        packetsLost: "0",
                        packetsReceived: "0",
                        googAccelerateRate: "0",
                        googCurrentDelayMs: "0",
                        googDecodingCNG: "0",
                        googDecodingCTN: "0",
                        googDecodingCTSG: "0",
                        googDecodingNormal: "0",
                        googDecodingPLC: "0",
                        googDecodingPLCCNG: "0",
                        googExpandRate: "0",
                        googJitterBufferMs: "0",
                        googJitterReceived: "0",
                        googPreemptiveExpandRate: "0",
                        googPreferredJitterBufferMs: "0",
                        googSecondaryDecodedRate: "0",
                        googSpeechExpandRate: "0"
                    }, m = {
                        id: "",
                        type: "",
                        mediaType: "",
                        googTargetDelayMs: "0",
                        packetsLost: "0",
                        googDecodeMs: "0",
                        googMaxDecodeMs: "0",
                        googRenderDelayMs: "0",
                        googFrameWidthReceived: "0",
                        googFrameHeightReceived: "0",
                        googFrameRateReceived: "0",
                        googFrameRateDecoded: "0",
                        googFrameRateOutput: "0",
                        googJitterBufferMs: "0",
                        googCurrentDelayMs: "0",
                        googMinPlayoutDelayMs: "0",
                        googNacksSent: "0",
                        googPlisSent: "0",
                        googFirsSent: "0",
                        bytesReceived: "0",
                        packetsReceived: "0",
                        googFramesDecoded: "0"
                    }, n = 0;
                    u.getVideoRelatedStats = function (s) {
                        u.peerConnection.getStats().then(function (e) {
                            var t = !0, n = !1, r = void 0;
                            try {
                                for (var i, o = e.values()[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                                    var a = i.value;
                                    if (u.isSubscriber) {
                                        if (("inbound-rtp" === a.type || "inboundrtp" === a.type) && "video" === a.mediaType) {
                                            if (!u.lastReport) return void (u.lastReport = a);
                                            s && s({
                                                browser: "firefox",
                                                mediaType: "video",
                                                peerId: u.uid,
                                                isVideoMute: u.isVideoMute,
                                                frameRateReceived: a.framerateMean + "",
                                                frameRateDecoded: a.framesDecoded - u.lastReport.framesDecoded + "",
                                                bytesReceived: a.bytesReceived + "",
                                                packetsReceived: a.packetsReceived + "",
                                                packetsLost: a.packetsLost + ""
                                            }), u.lastReport = a
                                        }
                                    } else if (("outbound-rtp" === a.type || "outboundrtp" === a.type) && "video" === a.mediaType) {
                                        if (!u.lastReport) return void (u.lastReport = a);
                                        s && s({
                                            mediaType: "video",
                                            isVideoMute: u.isVideoMute,
                                            frameRateInput: a.framerateMean + "",
                                            frameRateSent: a.framesEncoded - u.lastReport.framesEncoded + ""
                                        }), u.lastReport = a
                                    }
                                }
                            } catch (e) {
                                n = !0, r = e
                            } finally {
                                try {
                                    t || null == o.return || o.return()
                                } finally {
                                    if (n) throw r
                                }
                            }
                        })
                    }, u.getAudioRelatedStats = function (s) {
                        u.peerConnection.getStats().then(function (e) {
                            var t = !0, n = !1, r = void 0;
                            try {
                                for (var i, o = e.values()[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                                    var a = i.value;
                                    u.isSubscriber && ("inbound-rtp" !== a.type && "inboundrtp" !== a.type || "audio" !== a.mediaType || s && s({
                                        browser: "firefox",
                                        mediaType: "audio",
                                        peerId: u.uid,
                                        isAudioMute: u.isAudioMute,
                                        frameDropped: a.packetsLost + "",
                                        frameReceived: a.packetsReceived + "",
                                        googJitterReceived: a.jitter + "",
                                        bytesReceived: a.bytesReceived + "",
                                        packetsReceived: a.packetsReceived + "",
                                        packetsLost: a.packetsLost + ""
                                    }))
                                }
                            } catch (e) {
                                n = !0, r = e
                            } finally {
                                try {
                                    t || null == o.return || o.return()
                                } finally {
                                    if (n) throw r
                                }
                            }
                        })
                    }, u.getStatsRate = function (t) {
                        u.getStats(function (e) {
                            e.forEach(function (e) {
                                "inbound-rtp" !== e.type && "inboundrtp" !== e.type || "video" !== e.mediaType || e.googFrameRateDecoded && (e.googFrameRateDecoded = ((e.googFramesDecoded - n) / 3).toString(), n = e.googFramesDecoded)
                            }), t(e)
                        })
                    }, u.getStats = function (n, e) {
                        e = 500 < (e = e || 500) ? 500 : e, u.lastTimeGetStats && Date.now() - u.lastTimeGetStats < e ? n && n(u.filterStatsCache, u.originStatsCache) : this._getStats(function (e, t) {
                            u.filterStatsCache = e, u.originStatsCache = t, u.lastTimeGetStats = Date.now(), n && n(e, t)
                        })
                    }, u._getStats = function (d) {
                        u.peerConnection.getStats().then(function (e) {
                            var t = [], n = !0, r = !1, i = void 0;
                            try {
                                for (var o, a = e.values()[Symbol.iterator](); !(n = (o = a.next()).done); n = !0) {
                                    var s = o.value;
                                    t.push(s), "outbound-rtp" !== s.type && "outboundrtp" !== s.type || "video" !== s.mediaType || -1 !== s.id.indexOf("rtcp") || (p.id = s.id, p.type = s.type, p.mediaType = s.mediaType, p.bytesSent = s.bytesSent ? s.bytesSent + "" : "0", p.packetsSent = s.packetsSent ? s.packetsSent + "" : "0", p.googPlisReceived = s.pliCount ? s.pliCount + "" : "0", p.googNacksReceived = s.nackCount ? s.nackCount + "" : "0", p.googFirsReceived = s.firCount ? s.firCount + "" : "0", p.googFrameRateSent = s.framerateMean ? s.framerateMean + "" : "0"), "outbound-rtp" !== s.type && "outboundrtp" !== s.type || "audio" !== s.mediaType || -1 !== s.id.indexOf("rtcp") || (l.id = s.id, l.type = s.type, l.mediaType = s.mediaType, l.bytesSent = s.bytesSent ? s.bytesSent + "" : "0", l.packetsSent = s.packetsSent ? s.packetsSent + "" : "0"), "inbound-rtp" !== s.type && "inboundrtp" !== s.type || "audio" !== s.mediaType || s.isRemote || -1 !== s.id.indexOf("rtcp") || (f.id = s.id, f.type = s.type, f.mediaType = s.mediaType, f.bytesReceived = s.bytesReceived ? s.bytesReceived + "" : "0", f.packetsLost = s.packetsLost ? s.packetsLost + "" : "0", f.packetsReceived = s.packetsReceived ? s.packetsReceived + "" : "0", f.googJitterReceived = s.jitter ? s.jitter + "" : "0"), "inbound-rtp" !== s.type && "inboundrtp" !== s.type || "video" !== s.mediaType || s.isRemote || -1 !== s.id.indexOf("rtcp") || (m.id = s.id, m.type = s.type, m.mediaType = s.mediaType, m.bytesReceived = s.bytesReceived ? s.bytesReceived + "" : "0", m.googFrameRateReceived = s.framerateMean ? s.framerateMean + "" : "0", m.googFramesDecoded = s.framesDecoded ? s.framesDecoded + "" : "0", m.packetsLost = s.packetsLost ? s.packetsLost + "" : "0", m.packetsReceived = s.packetsReceived ? s.packetsReceived + "" : "0", m.googJitterBufferMs = s.jitter ? s.jitter + "" : "0", m.googNacksSent = s.nackCount ? s.nackCount + "" : "0", m.googPlisSent = s.pliCount ? s.pliCount + "" : "0", m.googFirsSent = s.firCount ? s.firCount + "" : "0"), -1 !== s.id.indexOf("outbound_rtcp_video") && (p.packetsLost = s.packetsLost ? s.packetsLost + "" : "0")
                                }
                            } catch (e) {
                                r = !0, i = e
                            } finally {
                                try {
                                    n || null == a.return || a.return()
                                } finally {
                                    if (r) throw i
                                }
                            }
                            var c = [p, l, f, m];
                            c.push({id: "time", startTime: u.connectedTime, timestamp: new Date}), d(c, t)
                        }, function (e) {
                            I.default.error("[" + u.clientId + "]" + e)
                        })
                    }, u.addStream = function (e) {
                        t = !0, u.peerConnection.addStream(e), u.markActionNeeded()
                    }, u.removeStream = function () {
                        u.markActionNeeded()
                    }, u.close = function () {
                        u.state = "closed", u.peerConnection.close()
                    }, u.markActionNeeded = function () {
                        u.actionNeeded = !0, u.doLater(function () {
                            u.onstablestate()
                        })
                    }, u.doLater = function (e) {
                        window.setTimeout(e, 1)
                    }, u.onstablestate = function () {
                        if (u.actionNeeded) {
                            if ("new" === u.state || "established" === u.state) t && (u.mediaConstraints = void 0), u.peerConnection.createOffer(function (e) {
                                if (e.sdp = o(e.sdp), e.sdp = e.sdp.replace(/a=extmap:1 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time/, "a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time"), e.sdp !== u.prevOffer) return u.peerConnection.setLocalDescription(e), u.state = "preparing-offer", void u.markActionNeeded();
                                I.default.debug("[" + u.clientId + "]Not sending a new offer")
                            }, function (e) {
                                I.default.debug("[" + u.clientId + "]Ups! create offer failed ", e)
                            }, u.mediaConstraints); else if ("preparing-offer" === u.state) {
                                if (u.moreIceComing) return;
                                u.prevOffer = u.peerConnection.localDescription.sdp, u.offerCandidates = u.prevOffer.match(/a=candidate.+\r\n/g) || [], u.offerCandidates.length || (I.default.warning("[".concat(u.clientId, "]No Ice Candidate generated")), Object(_.getParameter)("SHIM_CANDIDATE") ? (I.default.debug("Shimming fake candidate"), u.prevOffer += "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n") : I.default.error("[".concat(u.clientId, "]None Ice Candidate not allowed"))), u.prevOffer = u.prevOffer.replace(/a=candidate:.+typ\shost.+\r\n/g, "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n"), u.sendMessage("OFFER", u.prevOffer), u.state = "offer-sent"
                            } else if ("offer-received" === u.state) u.peerConnection.createAnswer(function (e) {
                                if (u.peerConnection.setLocalDescription(e), u.state = "offer-received-preparing-answer", u.iceStarted) u.markActionNeeded(); else {
                                    var t = new Date;
                                    I.default.debug("[" + u.clientId + "]" + t.getTime() + ": Starting ICE in responder"), u.iceStarted = !0
                                }
                            }, function () {
                                I.default.debug("[" + u.clientId + "]Ups! Something went wrong")
                            }); else if ("offer-received-preparing-answer" === u.state) {
                                if (u.moreIceComing) return;
                                var e = u.peerConnection.localDescription.sdp;
                                u.sendMessage("ANSWER", e), u.state = "established"
                            } else u.error("Dazed and confused in state " + u.state + ", stopping here");
                            u.actionNeeded = !1
                        }
                    }, u.sendOK = function () {
                        u.sendMessage("OK")
                    }, u.sendMessage = function (e, t) {
                        var n = {};
                        n.messageType = e, n.sdp = t, "OFFER" === e ? (n.offererSessionId = u.sessionId, n.answererSessionId = u.otherSessionId, n.seq = u.sequenceNumber += 1, n.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (n.offererSessionId = u.incomingMessage.offererSessionId, n.answererSessionId = u.sessionId, n.seq = u.incomingMessage.seq), u.onsignalingmessage(JSON.stringify(n))
                    }, u._getSender = function (t) {
                        if (u.peerConnection && u.peerConnection.getSenders) {
                            var e = u.peerConnection.getSenders().find(function (e) {
                                return e.track.kind == t
                            });
                            if (e) return e
                        }
                        return null
                    }, u.hasSender = function (e) {
                        return !!u._getSender(e)
                    }, u.replaceTrack = function (e, t, n) {
                        var r = u._getSender(e.kind);
                        if (!r) return n("NO_SENDER_FOUND");
                        try {
                            r.replaceTrack(e)
                        } catch (e) {
                            return n && n(e)
                        }
                        setTimeout(function () {
                            return t && t()
                        }, 50)
                    }, u.error = function (e) {
                        throw"Error in RoapOnJsep: " + e
                    }, u.sessionId = u.roapSessionId += 1, u.sequenceNumber = 0, u.actionNeeded = !1, u.iceStarted = !1, u.moreIceComing = !0, u.iceCandidateCount = 0, u.onsignalingmessage = r.callback, u.peerConnection.ontrack = function (e) {
                        u.onaddstream && u.onaddstream(e, "ontrack")
                    }, u.peerConnection.onremovestream = function (e) {
                        u.onremovestream && u.onremovestream(e)
                    }, u.peerConnection.oniceconnectionstatechange = function (e) {
                        "connected" === e.currentTarget.iceConnectionState && (u.connectedTime = new Date), u.oniceconnectionstatechange && u.oniceconnectionstatechange(e.currentTarget.iceConnectionState)
                    };
                    var o = function (e) {
                        var t;
                        if (r.video && r.maxVideoBW && (null == (t = e.match(/m=video.*\r\n/)) && (t = e.match(/m=video.*\n/)), t && 0 < t.length)) {
                            var n = t[0] + "b=TIAS:" + 1e3 * r.maxVideoBW + "\r\n";
                            e = e.replace(t[0], n)
                        }
                        return r.audio && r.maxAudioBW && (null == (t = e.match(/m=audio.*\r\n/)) && (t = e.match(/m=audio.*\n/)), t && 0 < t.length) && (n = t[0] + "b=TIAS:" + 1e3 * r.maxAudioBW + "\r\n", e = e.replace(t[0], n)), e
                    };
                    return u.onaddstream = null, u.onremovestream = null, u.state = "new", u.markActionNeeded(), u
                }(e)) : "iOS" === R.getBrowserOS() || R.isSafari() ? (I.default.debug("[" + t.streamId + "][" + t.clientId + "]Safari"), (t = function (r) {
                    var o = {}, e = h.RTCPeerConnection;
                    o.uid = r.uid, o.isVideoMute = r.isVideoMute, o.isAudioMute = r.isAudioMute, o.isSubscriber = r.isSubscriber, o.clientId = r.clientId, o.filterStatsCache = [], o.originStatsCache = [], o.lastTimeGetStats = null, o.pc_config = {
                        iceServers: [{urls: ["stun:webcs.agora.io:3478", "stun:stun.l.google.com:19302"]}],
                        bundlePolicy: "max-bundle"
                    }, o.con = {optional: [{DtlsSrtpKeyAgreement: !0}]}, r.iceServers instanceof Array ? o.pc_config.iceServers = r.iceServers : (r.stunServerUrl && (r.stunServerUrl instanceof Array ? r.stunServerUrl.map(function (e) {
                        "string" == typeof e && "" !== e && o.pc_config.iceServers.push({url: e})
                    }) : "string" == typeof r.stunServerUrl && "" !== r.stunServerUrl && o.pc_config.iceServers.push({url: r.stunServerUrl})), r.turnServer && (r.turnServer instanceof Array ? r.turnServer.map(function (e) {
                        "string" == typeof e.url && "" !== e.url && o.pc_config.iceServers.push({
                            username: e.username,
                            credential: e.credential,
                            url: e.url
                        })
                    }) : "string" == typeof r.turnServer.url && "" !== r.turnServer.url && (o.pc_config.iceServers.push({
                        username: r.turnServer.username,
                        credential: r.turnServer.credential,
                        credentialType: "password",
                        urls: ["turn:" + r.turnServer.url + ":" + r.turnServer.udpport + "?transport=udp"]
                    }), "string" == typeof r.turnServer.tcpport && "" !== r.turnServer.tcpport && o.pc_config.iceServers.push({
                        username: r.turnServer.username,
                        credential: r.turnServer.credential,
                        credentialType: "password",
                        urls: ["turn:" + r.turnServer.url + ":" + r.turnServer.tcpport + "?transport=tcp"]
                    }), !0 === r.turnServer.forceturn && (o.pc_config.iceTransportPolicy = "relay")))), void 0 === r.audio && (r.audio = !0), void 0 === r.video && (r.video = !0), o.mediaConstraints = {
                        mandatory: {
                            OfferToReceiveVideo: r.video,
                            OfferToReceiveAudio: r.audio
                        }
                    }, o.roapSessionId = 103;
                    try {
                        o.pc_config.sdpSemantics = "plan-b", o.peerConnection = new e(o.pc_config, o.con)
                    } catch (r) {
                        delete o.pc_config.sdpSemantics, o.peerConnection = new e(o.pc_config, o.con)
                    }
                    I.default.debug("[" + o.clientId + ']safari Created RTCPeerConnnection with config "' + JSON.stringify(o.pc_config) + '".'), o.iceCandidateTimer = setTimeout(function () {
                        o.iceCandidateTimer = null, I.default.debug("[".concat(o.clientId, "]Candidates collected: ").concat(o.iceCandidateCount)), o.moreIceComing && (o.moreIceComing = !1, o.markActionNeeded())
                    }, Object(_.getParameter)("CANDIDATE_TIMEOUT")), o.peerConnection.onicecandidate = function (e) {
                        var t, n, r, i;
                        n = (t = o.peerConnection.localDescription.sdp).match(/a=candidate:.+typ\ssrflx.+\r\n/), r = t.match(/a=candidate:.+typ\shost.+\r\n/), i = t.match(/a=candidate:.+typ\srelay.+\r\n/), 0 === o.iceCandidateCount && (o.timeout = setTimeout(function () {
                            o.moreIceComing && (o.moreIceComing = !1, o.markActionNeeded())
                        }, 1e3)), null === n && null === r && null === i || void 0 !== o.ice || !o.iceCandidateTimer || (I.default.debug("[" + o.clientId + "]srflx candidate : " + n + " relay candidate: " + i + " host candidate : " + r), clearTimeout(o.iceCandidateTimer), o.iceCandidateTimer = null, o.ice = 0, o.moreIceComing = !1, o.markActionNeeded()), o.iceCandidateCount = o.iceCandidateCount + 1
                    };
                    var i = function (e) {
                        return r.screen && (e = e.replace("a=x-google-flag:conference\r\n", "")), e
                    }, a = function (e) {
                        var t, n;
                        return (t = e.match(/m=video.*\r\n/)) && r.minVideoBW && r.maxVideoBW && (n = t[0] + "b=AS:" + r.maxVideoBW + "\r\n", e = e.replace(t[0], n), I.default.debug("[" + o.clientId + "]Set Video Bitrate - min:" + r.minVideoBW + " max:" + r.maxVideoBW)), (t = e.match(/m=audio.*\r\n/)) && r.maxAudioBW && (n = t[0] + "b=AS:" + r.maxAudioBW + "\r\n", e = e.replace(t[0], n)), e
                    };
                    o.processSignalingMessage = function (e) {
                        var t, n = JSON.parse(e);
                        o.incomingMessage = n, "new" === o.state ? "OFFER" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "offer"
                        }, o.peerConnection.setRemoteDescription(new RTCSessionDescription(t)), o.state = "offer-received", o.markActionNeeded()) : o.error("Illegal message for this state: " + n.messageType + " in state " + o.state) : "offer-sent" === o.state ? "ANSWER" === n.messageType ? ((t = {
                            sdp: n.sdp,
                            type: "answer"
                        }).sdp = i(t.sdp), t.sdp = a(t.sdp), t.sdp = t.sdp.replace(/a=x-google-flag:conference\r\n/g, ""), o.peerConnection.setRemoteDescription(new RTCSessionDescription(t)), o.sendOK(), o.state = "established") : "pr-answer" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "pr-answer"
                        }, o.peerConnection.setRemoteDescription(new RTCSessionDescription(t))) : "offer" === n.messageType ? o.error("Not written yet") : o.error("Illegal message for this state: " + n.messageType + " in state " + o.state) : "established" === o.state && ("OFFER" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "offer"
                        }, o.peerConnection.setRemoteDescription(new RTCSessionDescription(t)), o.state = "offer-received", o.markActionNeeded()) : "ANSWER" === n.messageType ? ((t = {
                            sdp: n.sdp,
                            type: "answer"
                        }).sdp = i(t.sdp), t.sdp = a(t.sdp), o.peerConnection.setRemoteDescription(new RTCSessionDescription(t))) : o.error("Illegal message for this state: " + n.messageType + " in state " + o.state))
                    };
                    var s = {
                        id: "",
                        type: "",
                        mediaType: "",
                        googCodecName: "opus",
                        aecDivergentFilterFraction: "0",
                        audioInputLevel: "0",
                        bytesSent: "0",
                        packetsSent: "0",
                        googEchoCancellationReturnLoss: "0",
                        googEchoCancellationReturnLossEnhancement: "0"
                    }, c = {
                        id: "",
                        type: "",
                        mediaType: "",
                        googCodecName: "h264" === r.codec ? "H264" : "VP8",
                        bytesSent: "0",
                        packetsLost: "0",
                        packetsSent: "0",
                        googAdaptationChanges: "0",
                        googAvgEncodeMs: "0",
                        googEncodeUsagePercent: "0",
                        googFirsReceived: "0",
                        googFrameHeightSent: "0",
                        googFrameHeightInput: "0",
                        googFrameRateInput: "0",
                        googFrameRateSent: "0",
                        googFrameWidthSent: "0",
                        googFrameWidthInput: "0",
                        googNacksReceived: "0",
                        googPlisReceived: "0",
                        googRtt: "0",
                        googFramesEncoded: "0"
                    }, d = {
                        id: "",
                        type: "",
                        mediaType: "",
                        audioOutputLevel: "0",
                        bytesReceived: "0",
                        packetsLost: "0",
                        packetsReceived: "0",
                        googAccelerateRate: "0",
                        googCurrentDelayMs: "0",
                        googDecodingCNG: "0",
                        googDecodingCTN: "0",
                        googDecodingCTSG: "0",
                        googDecodingNormal: "0",
                        googDecodingPLC: "0",
                        googDecodingPLCCNG: "0",
                        googExpandRate: "0",
                        googJitterBufferMs: "0",
                        googJitterReceived: "0",
                        googPreemptiveExpandRate: "0",
                        googPreferredJitterBufferMs: "0",
                        googSecondaryDecodedRate: "0",
                        googSpeechExpandRate: "0"
                    }, u = {
                        id: "",
                        type: "",
                        mediaType: "",
                        googTargetDelayMs: "0",
                        packetsLost: "0",
                        googDecodeMs: "0",
                        googMaxDecodeMs: "0",
                        googRenderDelayMs: "0",
                        googFrameWidthReceived: "0",
                        googFrameHeightReceived: "0",
                        googFrameRateReceived: "0",
                        googFrameRateDecoded: "0",
                        googFrameRateOutput: "0",
                        googFramesDecoded: "0",
                        googFrameReceived: "0",
                        googJitterBufferMs: "0",
                        googCurrentDelayMs: "0",
                        googMinPlayoutDelayMs: "0",
                        googNacksSent: "0",
                        googPlisSent: "0",
                        googFirsSent: "0",
                        bytesReceived: "0",
                        packetsReceived: "0"
                    }, l = {
                        id: "bweforvideo",
                        type: "VideoBwe",
                        googAvailableSendBandwidth: "0",
                        googAvailableReceiveBandwidth: "0",
                        googActualEncBitrate: "0",
                        googRetransmitBitrate: "0",
                        googTargetEncBitrate: "0",
                        googBucketDelay: "0",
                        googTransmitBitrate: "0"
                    }, n = 0, p = 0, f = 0;
                    return o.getVideoRelatedStats = function (n) {
                        o.peerConnection.getStats().then(function (e) {
                            var t = {peerId: o.uid, mediaType: "video", isVideoMute: o.isVideoMute};
                            e.forEach(function (e) {
                                if (o.isSubscriber) {
                                    if ("track" === e.type && (~e.id.indexOf("video") || ~e.trackIdentifier.indexOf("v"))) {
                                        if (!o.lastReport) return void (o.lastReport = e);
                                        t.frameRateReceived = e.framesReceived - o.lastReport.framesReceived + "", t.frameRateDecoded = e.framesDecoded - o.lastReport.framesDecoded + "", o.lastReport = e
                                    }
                                    "inbound-rtp" === e.type && ~e.id.indexOf("Video") && (t.bytesReceived = e.bytesReceived + "", t.packetsReceived = e.packetsReceived + "", t.packetsLost = e.packetsLost + "")
                                } else if ("outbound-rtp" === e.type && ~e.id.indexOf("Video")) {
                                    if (!o.lastReport) return void (o.lastReport = e);
                                    n && n({
                                        mediaType: "video",
                                        isVideoMute: o.isVideoMute,
                                        frameRateInput: r.maxFrameRate + "",
                                        frameRateSent: e.framesEncoded - o.lastReport.framesEncoded + ""
                                    }), o.lastReport = e
                                }
                            }), n && n(t)
                        })
                    }, o.getAudioRelatedStats = function (t) {
                        o.peerConnection.getStats().then(function (e) {
                            e.forEach(function (e) {
                                o.isSubscriber && "inbound-rtp" === e.type && ~e.id.indexOf("Audio") && t && t({
                                    peerId: o.uid,
                                    mediaType: "audio",
                                    isAudioMute: o.isAudioMute,
                                    frameDropped: e.packetsLost + "",
                                    frameReceived: e.packetsReceived + "",
                                    googJitterReceived: e.jitter + "",
                                    bytesReceived: e.bytesReceived + "",
                                    packetsReceived: e.packetsReceived + "",
                                    packetsLost: e.packetsLost + ""
                                })
                            })
                        })
                    }, o.getStatsRate = function (t) {
                        o.getStats(function (e) {
                            e.forEach(function (e) {
                                "outbound-rtp" === e.type && "video" === e.mediaType && e.googFramesEncoded && (e.googFrameRateSent = ((e.googFramesEncoded - n) / 3).toString(), n = e.googFramesEncoded), "inbound-rtp" === e.type && -1 != e.id.indexOf("55543") && (e.googFrameRateReceived && (e.googFrameRateReceived = ((e.googFrameReceived - f) / 3).toString(), f = e.googFrameReceived), e.googFrameRateDecoded && (e.googFrameRateDecoded = ((e.googFramesDecoded - p) / 3).toString(), p = e.googFramesDecoded))
                            }), t(e)
                        })
                    }, o.getStats = function (n, e) {
                        e = 500 < (e = e || 500) ? 500 : e, o.lastTimeGetStats && Date.now() - o.lastTimeGetStats < e ? n && n(o.filterStatsCache, o.originStatsCache) : this._getStats(function (e, t) {
                            o.filterStatsCache = e, o.originStatsCache = t, o.lastTimeGetStats = Date.now(), n && n(e, t)
                        })
                    }, o._getStats = function (n) {
                        var r = [];
                        o.peerConnection.getStats().then(function (e) {
                            e.forEach(function (e) {
                                r.push(e), "outbound-rtp" === e.type && "audio" === e.mediaType && (s.id = e.id, s.type = e.type, s.mediaType = e.mediaType, s.bytesSent = e.bytesSent ? e.bytesSent + "" : "0", s.packetsSent = e.packetsSent ? e.packetsSent + "" : "0"), "outbound-rtp" === e.type && "video" === e.mediaType && (c.id = e.id, c.type = e.type, c.mediaType = e.mediaType, c.bytesSent = e.bytesSent ? e.bytesSent + "" : "0", c.packetsSent = e.packetsSent ? e.packetsSent + "" : "0", c.googPlisReceived = e.pliCount ? e.pliCount + "" : "0", c.googNacksReceived = e.nackCount ? e.nackCount + "" : "0", c.googFirsReceived = e.firCount ? e.firCount + "" : "0", c.googFramesEncoded = e.framesEncoded ? e.framesEncoded + "" : "0"), "inbound-rtp" === e.type && -1 != e.id.indexOf("44444") && (d.id = e.id, d.type = e.type, d.mediaType = "audio", d.packetsReceived = e.packetsReceived ? e.packetsReceived + "" : "0", d.bytesReceived = e.bytesReceived ? e.bytesReceived + "" : "0", d.packetsLost = e.packetsLost ? e.packetsLost + "" : "0", d.packetsReceived = e.packetsReceived ? e.packetsReceived + "" : "0", d.googJitterReceived = e.jitter ? e.jitter + "" : "0"), "inbound-rtp" === e.type && -1 != e.id.indexOf("55543") && (u.id = e.id, u.type = e.type, u.mediaType = "video", u.packetsReceived = e.packetsReceived ? e.packetsReceived + "" : "0", u.bytesReceived = e.bytesReceived ? e.bytesReceived + "" : "0", u.packetsLost = e.packetsLost ? e.packetsLost + "" : "0", u.googJitterBufferMs = e.jitter ? e.jitter + "" : "0", u.googNacksSent = e.nackCount ? e.nackCount + "" : "0", u.googPlisSent = e.pliCount ? e.pliCount + "" : "0", u.googFirsSent = e.firCount ? e.firCount + "" : "0"), "track" !== e.type || -1 == e.id.indexOf("55543") && !~e.trackIdentifier.indexOf("v") && null != e.audioLevel || (u.googFrameWidthReceived = e.frameWidth ? e.frameWidth + "" : "0", u.googFrameHeightReceived = e.frameHeight ? e.frameHeight + "" : "0", u.googFrameReceived = e.framesReceived ? e.framesReceived + "" : "0", u.googFramesDecoded = e.framesDecoded ? e.framesDecoded + "" : "0"), "track" !== e.type || -1 == e.id.indexOf("44444") && !~e.trackIdentifier.indexOf("a") && void 0 === e.audioLevel || (d.audioOutputLevel = e.audioLevel + "", s.audioInputLevel = e.audioLevel + ""), "candidate-pair" === e.type && (0 == e.availableIncomingBitrate ? l.googAvailableSendBandwidth = e.availableOutgoingBitrate + "" : l.googAvailableReceiveBandwidth = e.availableIncomingBitrate + "")
                            });
                            var t = [l, s, c, d, u];
                            t.push({id: "time", startTime: o.connectedTime, timestamp: new Date}), n(t, r)
                        }).catch(function (e) {
                            console.error(e)
                        })
                    }, o.addTrack = function (e, t) {
                        o.peerConnection.addTrack(e, t)
                    }, o.removeTrack = function (t, e) {
                        var n = o.peerConnection.getSenders().find(function (e) {
                            return e.track == t
                        });
                        n.replaceTrack(null), o.peerConnection.removeTrack(n)
                    }, o.addStream = function (t) {
                        -1 < window.navigator.userAgent.indexOf("Safari") && -1 === navigator.userAgent.indexOf("Chrome") ? t.getTracks().forEach(function (e) {
                            return o.peerConnection.addTrack(e, t)
                        }) : o.peerConnection.addStream(t), o.markActionNeeded()
                    }, o.removeStream = function () {
                        o.markActionNeeded()
                    }, o.close = function () {
                        o.state = "closed", o.peerConnection.close()
                    }, o.markActionNeeded = function () {
                        o.actionNeeded = !0, o.doLater(function () {
                            o.onstablestate()
                        })
                    }, o.doLater = function (e) {
                        window.setTimeout(e, 1)
                    }, o.onstablestate = function () {
                        var e;
                        if (o.actionNeeded) {
                            if ("new" === o.state || "established" === o.state) r.isSubscriber && (o.peerConnection.addTransceiver("audio", {direction: "recvonly"}), o.peerConnection.addTransceiver("video", {direction: "recvonly"})), o.peerConnection.createOffer(o.mediaConstraints).then(function (e) {
                                if (e.sdp = a(e.sdp), r.isSubscriber || (e.sdp = e.sdp.replace(/a=extmap:4 urn:3gpp:video-orientation\r\n/g, "")), e.sdp !== o.prevOffer) return o.peerConnection.setLocalDescription(e), o.state = "preparing-offer", void o.markActionNeeded();
                                I.default.debug("[" + o.clientId + "]Not sending a new offer")
                            }).catch(function (e) {
                                I.default.debug("[" + o.clientId + "]peer connection create offer failed ", e)
                            }); else if ("preparing-offer" === o.state) {
                                if (o.moreIceComing) return;
                                o.prevOffer = o.peerConnection.localDescription.sdp, o.offerCandidates = o.prevOffer.match(/a=candidate.+\r\n/g) || [], o.offerCandidates.length || (I.default.warning("[".concat(o.clientId, "]No Ice Candidate generated")), Object(_.getParameter)("SHIM_CANDIDATE") ? (I.default.debug("Shimming fake candidate"), o.prevOffer += "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n") : I.default.error("[".concat(o.clientId, "]None Ice Candidate not allowed"))), o.prevOffer = o.prevOffer.replace(/a=candidate:.+typ\shost.+\r\n/g, "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n"), o.sendMessage("OFFER", o.prevOffer), o.state = "offer-sent"
                            } else if ("offer-received" === o.state) o.peerConnection.createAnswer(function (e) {
                                if (o.peerConnection.setLocalDescription(e), o.state = "offer-received-preparing-answer", o.iceStarted) o.markActionNeeded(); else {
                                    var t = new Date;
                                    I.default.debug("[" + o.clientId + "]" + t.getTime() + ": Starting ICE in responder"), o.iceStarted = !0
                                }
                            }, function (e) {
                                I.default.debug("[" + o.clientId + "]peer connection create answer failed ", e)
                            }, o.mediaConstraints); else if ("offer-received-preparing-answer" === o.state) {
                                if (o.moreIceComing) return;
                                e = o.peerConnection.localDescription.sdp, o.sendMessage("ANSWER", e), o.state = "established"
                            } else o.error("Dazed and confused in state " + o.state + ", stopping here");
                            o.actionNeeded = !1
                        }
                    }, o.sendOK = function () {
                        o.sendMessage("OK")
                    }, o.sendMessage = function (e, t) {
                        var n = {};
                        n.messageType = e, n.sdp = t, "OFFER" === e ? (n.offererSessionId = o.sessionId, n.answererSessionId = o.otherSessionId, n.seq = o.sequenceNumber += 1, n.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (n.offererSessionId = o.incomingMessage.offererSessionId, n.answererSessionId = o.sessionId, n.seq = o.incomingMessage.seq), o.onsignalingmessage(JSON.stringify(n))
                    }, o._getSender = function (t) {
                        if (o.peerConnection && o.peerConnection.getSenders) {
                            var e = o.peerConnection.getSenders().find(function (e) {
                                return e.track.kind == t
                            });
                            if (e) return e
                        }
                        return null
                    }, o.hasSender = function (e) {
                        return !!o._getSender(e)
                    }, o.replaceTrack = function (e, t, n) {
                        var r = o._getSender(e.kind);
                        if (!r) return n("NO_SENDER_FOUND");
                        try {
                            r.replaceTrack(e)
                        } catch (e) {
                            return n && n(e)
                        }
                        setTimeout(function () {
                            return t && t()
                        }, 50)
                    }, o.error = function (e) {
                        throw"Error in RoapOnJsep: " + e
                    }, o.sessionId = o.roapSessionId += 1, o.sequenceNumber = 0, o.actionNeeded = !1, o.iceStarted = !1, o.moreIceComing = !0, o.iceCandidateCount = 0, o.onsignalingmessage = r.callback, o.peerConnection.ontrack = function (e) {
                        o.onaddstream && o.onaddstream(e, "ontrack")
                    }, o.peerConnection.onremovestream = function (e) {
                        o.onremovestream && o.onremovestream(e)
                    }, o.peerConnection.oniceconnectionstatechange = function (e) {
                        "connected" === e.currentTarget.iceConnectionState && (o.connectedTime = new Date), o.oniceconnectionstatechange && o.oniceconnectionstatechange(e.currentTarget.iceConnectionState)
                    }, o.renegotiate = function () {
                        void 0 !== o.prevOffer && o.peerConnection.createOffer().then(function (e) {
                            return e.sdp = e.sdp.replace(/a=recvonly\r\n/g, "a=inactive\r\n"), e.sdp = i(e.sdp), e.sdp = a(e.sdp), o.peerConnection.setLocalDescription(e)
                        }).then(function () {
                            o.onnegotiationneeded && o.onnegotiationneeded(o.peerConnection.localDescription.sdp)
                        }).catch(function (e) {
                            console.log("createOffer error: ", e)
                        })
                    }, o.peerConnection.onnegotiationneeded = o.renegotiate, o.onaddstream = null, o.onremovestream = null, o.state = "new", o.markActionNeeded(), o
                }(e)).browser = "safari") : ~window.navigator.userAgent.indexOf("Edge") ? t = new te.a(e) : (t = function (o) {
                    var a = {}, e = h.RTCPeerConnection;
                    a.uid = o.uid, a.isVideoMute = o.isVideoMute, a.isAudioMute = o.isAudioMute, a.isSubscriber = o.isSubscriber, a.clientId = o.clientId, a.filterStatsCache = [], a.originStatsCache = [], a.lastTimeGetStats = null, a.pc_config = {iceServers: [{url: "stun:webcs.agora.io:3478"}]}, a.con = {optional: [{DtlsSrtpKeyAgreement: !0}]}, o.iceServers instanceof Array ? a.pc_config.iceServers = o.iceServers : (o.stunServerUrl && (o.stunServerUrl instanceof Array ? o.stunServerUrl.map(function (e) {
                        "string" == typeof e && "" !== e && a.pc_config.iceServers.push({url: e})
                    }) : "string" == typeof o.stunServerUrl && "" !== o.stunServerUrl && a.pc_config.iceServers.push({url: o.stunServerUrl})), o.turnServer && (o.turnServer instanceof Array ? o.turnServer.map(function (e) {
                        "string" == typeof e.url && "" !== e.url && a.pc_config.iceServers.push({
                            username: e.username,
                            credential: e.credential,
                            url: e.url
                        })
                    }) : "string" == typeof o.turnServer.url && "" !== o.turnServer.url && (a.pc_config.iceServers.push({
                        username: o.turnServer.username,
                        credential: o.turnServer.credential,
                        credentialType: "password",
                        urls: "turn:" + o.turnServer.url + ":" + o.turnServer.udpport + "?transport=udp"
                    }), "string" == typeof o.turnServer.tcpport && "" !== o.turnServer.tcpport && a.pc_config.iceServers.push({
                        username: o.turnServer.username,
                        credential: o.turnServer.credential,
                        credentialType: "password",
                        urls: "turn:" + o.turnServer.url + ":" + o.turnServer.tcpport + "?transport=tcp"
                    }), !0 === o.turnServer.forceturn && (a.pc_config.iceTransportPolicy = "relay")))), void 0 === o.audio && (o.audio = !0), void 0 === o.video && (o.video = !0), a.mediaConstraints = {
                        mandatory: {
                            OfferToReceiveVideo: o.video,
                            OfferToReceiveAudio: o.audio
                        }
                    }, a.roapSessionId = 103;
                    try {
                        a.pc_config.sdpSemantics = "plan-b", a.peerConnection = new e(a.pc_config, a.con)
                    } catch (o) {
                        delete a.pc_config.sdpSemantics, a.peerConnection = new e(a.pc_config, a.con)
                    }
                    a.iceCandidateTimer = setTimeout(function () {
                        a.iceCandidateTimer = null, I.default.debug("[".concat(a.clientId, "]Candidates collected: ").concat(a.iceCandidateCount)), a.moreIceComing && (a.moreIceComing = !1, a.markActionNeeded())
                    }, Object(_.getParameter)("CANDIDATE_TIMEOUT")), a.peerConnection.onicecandidate = function (e) {
                        var t, n, r, i;
                        n = (t = a.peerConnection.localDescription.sdp).match(/a=candidate:.+typ\ssrflx.+\r\n/), r = t.match(/a=candidate:.+typ\shost.+\r\n/), i = t.match(/a=candidate:.+typ\srelay.+\r\n/), null === n && null === r && null === i || void 0 !== a.ice || !a.iceCandidateTimer || (I.default.debug("[" + a.clientId + "]srflx candidate : " + n + " relay candidate: " + i + " host candidate : " + r), clearTimeout(a.iceCandidateTimer), a.iceCandidateTimer = null, a.ice = 0, a.moreIceComing = !1, a.markActionNeeded()), a.iceCandidateCount = a.iceCandidateCount + 1
                    }, I.default.debug("[" + a.clientId + ']Created webkitRTCPeerConnnection with config "' + JSON.stringify(a.pc_config) + '".');
                    var r = function (e) {
                        return o.screen && (e = e.replace("a=x-google-flag:conference\r\n", "")), e
                    }, i = function (e) {
                        var t, n;
                        if ((t = e.match(/m=video.*\r\n/)) && o.minVideoBW && o.maxVideoBW) {
                            n = t[0] + "b=AS:" + o.maxVideoBW + "\r\n";
                            var r = 0, i = 0;
                            "h264" === o.codec ? (r = e.search(/a=rtpmap:(\d+) H264\/90000\r\n/), i = e.search(/H264\/90000\r\n/)) : "vp8" === o.codec && (r = e.search(/a=rtpmap:(\d+) VP8\/90000\r\n/), i = e.search(/VP8\/90000\r\n/)), -1 !== r && -1 !== i && 10 < i - r && (n = n + "a=fmtp:" + e.slice(r + 9, i - 1) + " x-google-min-bitrate=" + o.minVideoBW + "\r\n"), e = e.replace(t[0], n), I.default.debug("[" + a.clientId + "]Set Video Bitrate - min:" + o.minVideoBW + " max:" + o.maxVideoBW)
                        }
                        return (t = e.match(/m=audio.*\r\n/)) && o.maxAudioBW && (n = t[0] + "b=AS:" + o.maxAudioBW + "\r\n", e = e.replace(t[0], n)), e
                    };
                    return a.processSignalingMessage = function (e) {
                        var t, n = JSON.parse(e);
                        a.incomingMessage = n, "new" === a.state ? "OFFER" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "offer"
                        }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(t)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + n.messageType + " in state " + a.state) : "offer-sent" === a.state ? "ANSWER" === n.messageType ? ((t = {
                            sdp: n.sdp,
                            type: "answer"
                        }).sdp = r(t.sdp), t.sdp = i(t.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(t)), a.sendOK(), a.state = "established") : "pr-answer" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "pr-answer"
                        }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(t))) : "offer" === n.messageType ? a.error("Not written yet") : a.error("Illegal message for this state: " + n.messageType + " in state " + a.state) : "established" === a.state && ("OFFER" === n.messageType ? (t = {
                            sdp: n.sdp,
                            type: "offer"
                        }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(t)), a.state = "offer-received", a.markActionNeeded()) : "ANSWER" === n.messageType ? ((t = {
                            sdp: n.sdp,
                            type: "answer"
                        }).sdp = r(t.sdp), t.sdp = i(t.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(t))) : a.error("Illegal message for this state: " + n.messageType + " in state " + a.state))
                    }, a.getVideoRelatedStats = function (r) {
                        a.peerConnection.getStats(function (n) {
                            Object.keys(n).forEach(function (e) {
                                var t = n[e];
                                a.isSubscriber ? "video" === t.mediaType && t.id && ~t.id.indexOf("recv") && r && r({
                                    mediaType: "video",
                                    peerId: a.uid,
                                    isVideoMute: a.isVideoMute,
                                    frameRateReceived: t.googFrameRateReceived,
                                    frameRateDecoded: t.googFrameRateDecoded,
                                    bytesReceived: t.bytesReceived,
                                    packetsReceived: t.packetsReceived,
                                    packetsLost: t.packetsLost
                                }) : "video" === t.mediaType && t.id && ~t.id.indexOf("send") && r && r({
                                    mediaType: "video",
                                    isVideoMute: a.isVideoMute,
                                    frameRateInput: t.googFrameRateInput,
                                    frameRateSent: t.googFrameRateSent,
                                    googRtt: t.googRtt
                                })
                            })
                        })
                    }, a.getAudioRelatedStats = function (r) {
                        a.peerConnection.getStats(function (n) {
                            Object.keys(n).forEach(function (e) {
                                var t = n[e];
                                a.isSubscriber && "audio" === t.mediaType && t.id && ~t.id.indexOf("recv") && r && r({
                                    mediaType: "audio",
                                    peerId: a.uid,
                                    isAudioMute: a.isAudioMute,
                                    frameDropped: parseInt(t.googDecodingPLC) + parseInt(t.googDecodingPLCCNG) + "",
                                    frameReceived: t.googDecodingCTN,
                                    googJitterReceived: t.googJitterReceived,
                                    bytesReceived: t.bytesReceived,
                                    packetsReceived: t.packetsReceived,
                                    packetsLost: t.packetsLost
                                })
                            })
                        })
                    }, a.getStatsRate = function (t) {
                        a.getStats(function (e) {
                            t(e)
                        })
                    }, a.getStats = function (n, e) {
                        e = 500 < (e = e || 500) ? 500 : e, a.lastTimeGetStats && Date.now() - a.lastTimeGetStats < e ? n && n(a.filterStatsCache, a.originStatsCache) : this._getStats(function (e, t) {
                            a.filterStatsCache = e, a.originStatsCache = t, a.lastTimeGetStats = Date.now(), n && n(e, t)
                        })
                    }, a._getStats = function (e) {
                        a.peerConnection.getStats(function (n) {
                            var r = [], i = [], o = null;
                            Object.keys(n).forEach(function (e) {
                                var t = n[e];
                                i.push(t), "ssrc" !== t.type && "VideoBwe" !== t.type || (o = t.timestamp, r.push(t))
                            }), r.push({id: "time", startTime: a.connectedTime, timestamp: o || new Date}), e(r, i)
                        })
                    }, a.addTrack = function (e, t) {
                        a.peerConnection.addTrack(e, t)
                    }, a.removeTrack = function (t, e) {
                        a.peerConnection.removeTrack(a.peerConnection.getSenders().find(function (e) {
                            return e.track == t
                        }))
                    }, a.addStream = function (e) {
                        a.peerConnection.addStream(e), a.markActionNeeded()
                    }, a.removeStream = function () {
                        a.markActionNeeded()
                    }, a.close = function () {
                        a.state = "closed", a.peerConnection.close()
                    }, a.markActionNeeded = function () {
                        a.actionNeeded = !0, a.doLater(function () {
                            a.onstablestate()
                        })
                    }, a.doLater = function (e) {
                        window.setTimeout(e, 1)
                    }, a.onstablestate = function () {
                        var e;
                        if (a.actionNeeded) {
                            if ("new" === a.state || "established" === a.state) a.peerConnection.createOffer(function (e) {
                                if (e.sdp !== a.prevOffer) return a.peerConnection.setLocalDescription(e), a.state = "preparing-offer", void a.markActionNeeded();
                                I.default.debug("[" + a.clientId + "]Not sending a new offer")
                            }, function (e) {
                                I.default.debug("[" + a.clientId + "]peer connection create offer failed ", e)
                            }, a.mediaConstraints); else if ("preparing-offer" === a.state) {
                                if (a.moreIceComing) return;
                                a.prevOffer = a.peerConnection.localDescription.sdp, a.offerCandidates = a.prevOffer.match(/a=candidate.+\r\n/g) || [], a.offerCandidates.length || (I.default.warning("[".concat(a.clientId, "]No Ice Candidate generated")), Object(_.getParameter)("SHIM_CANDIDATE") ? (I.default.debug("Shimming fake candidate"), a.prevOffer += "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n") : I.default.error("[".concat(a.clientId, "]None Ice Candidate not allowed"))), a.prevOffer = a.prevOffer.replace(/a=candidate:.+typ\shost.+\r\n/g, "a=candidate:2243255435 1 udp 2122194687 192.168.0.1 30000 typ host generation 0 network-id 1\r\n"), a.sendMessage("OFFER", a.prevOffer), a.state = "offer-sent"
                            } else if ("offer-received" === a.state) a.peerConnection.createAnswer(function (e) {
                                if (a.peerConnection.setLocalDescription(e), a.state = "offer-received-preparing-answer", a.iceStarted) a.markActionNeeded(); else {
                                    var t = new Date;
                                    I.default.debug("[" + a.clientId + "]" + t.getTime() + ": Starting ICE in responder"), a.iceStarted = !0
                                }
                            }, function (e) {
                                I.default.debug("[" + a.clientId + "]peer connection create answer failed ", e)
                            }, a.mediaConstraints); else if ("offer-received-preparing-answer" === a.state) {
                                if (a.moreIceComing) return;
                                e = a.peerConnection.localDescription.sdp, a.sendMessage("ANSWER", e), a.state = "established"
                            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
                            a.actionNeeded = !1
                        }
                    }, a.sendOK = function () {
                        a.sendMessage("OK")
                    }, a.sendMessage = function (e, t) {
                        var n = {};
                        n.messageType = e, n.sdp = t, "OFFER" === e ? (n.offererSessionId = a.sessionId, n.answererSessionId = a.otherSessionId, n.seq = a.sequenceNumber += 1, n.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (n.offererSessionId = a.incomingMessage.offererSessionId, n.answererSessionId = a.sessionId, n.seq = a.incomingMessage.seq), a.onsignalingmessage(JSON.stringify(n))
                    }, a._getSender = function (t) {
                        if (a.peerConnection && a.peerConnection.getSenders) {
                            var e = a.peerConnection.getSenders().find(function (e) {
                                return e.track.kind == t
                            });
                            if (e) return e
                        }
                        return null
                    }, a.hasSender = function (e) {
                        return !!a._getSender(e)
                    }, a.replaceTrack = function (e, t, n) {
                        var r = a._getSender(e.kind);
                        if (!r) return n("NO_SENDER_FOUND");
                        try {
                            r.replaceTrack(e)
                        } catch (e) {
                            return n && n(e)
                        }
                        setTimeout(function () {
                            return t && t()
                        }, 50)
                    }, a.error = function (e) {
                        throw"Error in RoapOnJsep: " + e
                    }, a.sessionId = a.roapSessionId += 1, a.sequenceNumber = 0, a.actionNeeded = !1, a.iceStarted = !1, a.moreIceComing = !0, a.iceCandidateCount = 0, a.onsignalingmessage = o.callback, a.peerConnection.ontrack = function (e) {
                        a.onaddstream && (a.onaddstream(e, "ontrack"), a.peerConnection.onaddstream = null)
                    }, a.peerConnection.onaddstream = function (e) {
                        a.onaddstream && (a.onaddstream(e, "onaddstream"), a.peerConnection.ontrack = null)
                    }, a.peerConnection.onremovestream = function (e) {
                        a.onremovestream && a.onremovestream(e)
                    }, a.peerConnection.oniceconnectionstatechange = function (e) {
                        "connected" === e.currentTarget.iceConnectionState && (a.connectedTime = new Date), a.oniceconnectionstatechange && a.oniceconnectionstatechange(e.currentTarget.iceConnectionState)
                    }, a.renegotiate = function () {
                        void 0 !== a.prevOffer && a.peerConnection.createOffer().then(function (e) {
                            return e.sdp = e.sdp.replace(/a=recvonly\r\n/g, "a=inactive\r\n"), e.sdp = r(e.sdp), e.sdp = i(e.sdp), a.peerConnection.setLocalDescription(e)
                        }).then(function () {
                            a.onnegotiationneeded && a.onnegotiationneeded(a.peerConnection.localDescription.sdp)
                        }).catch(function (e) {
                            console.log("createOffer error: ", e)
                        })
                    }, a.peerConnection.onnegotiationneeded = a.renegotiate, a.onaddstream = null, a.onremovestream = null, a.onnegotiationneeded = null, a.state = "new", a.markActionNeeded(), a
                }(e)).browser = "chrome-stable", t
            }, ue = function (n, o, r) {
                var i = {};
                i.config = n, i.streamId = n.streamId, delete n.streamId, navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                var a = 0, s = 1, c = !1, d = null, u = function (e) {
                    if (a++, d) if (d === e) I.default.debug("Using Video Source/ Audio Source"); else {
                        var t = d.getVideoTracks()[0], n = d.getAudioTracks()[0], r = e.getVideoTracks()[0], i = e.getAudioTracks()[0];
                        r && (t && d.removeTrack(t), d.addTrack(r)), i && (n && d.removeTrack(n), d.addTrack(i))
                    } else d = e;
                    a !== s || c || (c = !0, setTimeout(function () {
                        o(d)
                    }, 0))
                }, l = function (e) {
                    I.default.error("Failed to GetUserMedia", e.name, e.code, e.message, e), a++, c || (c = !0, setTimeout(function () {
                        r && r(e)
                    }, 0))
                }, t = function () {
                    var e = {video: n.video, audio: n.audio};
                    if (I.default.debug("GetUserMedia", JSON.stringify(e)), navigator.mediaDevices && navigator.mediaDevices.getUserMedia) navigator.mediaDevices.getUserMedia(e).then(u).catch(l); else if ("undefined" != typeof navigator && navigator.getMedia) navigator.getMedia(n, u, l); else {
                        var t = {name: "MEDIA_NOT_SUPPORT", message: "Video/audio streams not supported yet"};
                        I.default.error("[" + i.streamId + "]" + t.message), r && r(t)
                    }
                };
                if ((n.videoSource || n.audioSource) && (d = new MediaStream, n.videoSource && d.addTrack(n.videoSource), n.audioSource && d.addTrack(n.audioSource)), n.video || n.audio || n.screen) if (n.screen) {
                    if (re()) return n.screen.sourceId ? se(n.screen.sourceId, n.screen, function (e, t) {
                        e ? l(e) : u(t)
                    }) : function (n, r) {
                        ie(function (e, t) {
                            if (e) return r && r(e);
                            !function (e, n) {
                                var t = document.createElement("div");
                                t.innerText = "share screen", t.setAttribute("style", "text-align: center; height: 25px; line-height: 25px; border-radius: 4px 4px 0 0; background: #D4D2D4; border-bottom:  solid 1px #B9B8B9;");
                                var r = document.createElement("div");
                                r.setAttribute("style", "width: 100%; height: 500px; padding: 15px 25px ; box-sizing: border-box;");
                                var i = document.createElement("div");
                                i.innerText = "Agora Web Screensharing wants to share the contents of your screen with webdemo.agorabeckon.com. Choose what you'd like to share.", i.setAttribute("style", "height: 12%;");
                                var o = document.createElement("div");
                                o.setAttribute("style", "width: 100%; height: 80%; background: #FFF; border:  solid 1px #CBCBCB; display: flex; flex-wrap: wrap; justify-content: space-around; overflow-y: scroll; padding: 0 15px; box-sizing: border-box;");
                                var a = document.createElement("div");
                                a.setAttribute("style", "text-align: right; padding: 16px 0;");
                                var s = document.createElement("button");
                                s.innerHTML = "cancel", s.setAttribute("style", "width: 85px;"), s.onclick = function () {
                                    document.body.removeChild(c), n("NotAllowedError")
                                }, a.appendChild(s), r.appendChild(i), r.appendChild(o), r.appendChild(a);
                                var c = document.createElement("div");
                                c.setAttribute("style", "position: absolute; z-index: 99999999; top: 50%; left: 50%; width: 620px; height: 525px; background: #ECECEC; border-radius: 4px; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);"), c.appendChild(t), c.appendChild(r), document.body.appendChild(c), e.map(function (e) {
                                    if (e.id) {
                                        var t = document.createElement("div");
                                        t.setAttribute("style", "width: 30%; height: 160px; padding: 20px 0; text-align: center;box-sizing: content-box;"), t.innerHTML = '<div style="height: 120px; display: table-cell; vertical-align: middle;"><img style="width: 100%; background: #333333; box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);" src=' + e.thumbnail.toDataURL() + ' /></div><span style="\theight: 40px; line-height: 40px; display: inline-block; width: 70%; word-break: keep-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + e.name + "</span>", t.onclick = function () {
                                            document.body.removeChild(c), n(null, e.id)
                                        }, o.appendChild(t)
                                    }
                                })
                            }(t, function (e, t) {
                                if (e) return r && r(e);
                                oe(t, n, r)
                            })
                        })
                    }(n.screen, function (e, t) {
                        e ? l(e) : u(t)
                    });
                    if (R.isFireFox()) {
                        if (I.default.debug("[" + i.streamId + "]Screen access requested"), !~["screen", "window", "application"].indexOf(n.screen.mediaSource)) return r && r("Invalid mediaSource, mediaSource should be one of [screen, window, application]");
                        navigator.getMedia({video: n.screen}, function (e) {
                            n.audio && (s++, t()), u(e)
                        }, l)
                    } else if (R.isChrome() && n.screen.extensionId) {
                        if (window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] < 34) return void r({code: "This browser does not support screen sharing"});
                        I.default.debug("[" + i.streamId + "]Screen access on chrome stable, looking for extension");
                        try {
                            chrome.runtime.sendMessage(n.screen.extensionId, {getStream: !0}, function (e) {
                                void 0 === e ? (I.default.error("[" + i.streamId + "]No response from Chrome Plugin. Plugin not installed properly"), l({
                                    name: "PluginNotInstalledProperly",
                                    message: "No response from Chrome Plugin. Plugin not installed properly."
                                })) : (n.screen.mandatory.chromeMediaSourceId = e.streamId, navigator.getMedia({video: n.screen}, function (e) {
                                    n.audio && (s++, t()), u(e)
                                }, l))
                            })
                        } catch (n) {
                            return I.default.debug("[" + i.streamId + "]AgoraRTC screensharing plugin is not accessible"), void r({code: "no_plugin_present"})
                        }
                    } else {
                        if (window.navigator.mediaDevices.getDisplayMedia) {
                            var e = {};
                            return "number" == typeof n.screen.width && "number" == typeof n.screen.height ? e.video = {
                                width: {ideal: n.screen.width},
                                height: {ideal: n.screen.height}
                            } : e.video = {
                                width: n.screen.width,
                                height: n.screen.height
                            }, n.screen.frameRate && n.screen.frameRate.min ? e.video.frameRate = {
                                ideal: n.screen.frameRate.max,
                                max: n.screen.frameRate.max
                            } : e.video.frameRate = n.screen.frameRate, I.default.debug("use getDisplayMedia, constraints:", e), window.navigator.mediaDevices.getDisplayMedia(e).then(function (e) {
                                n.audio && (s++, t()), u(e)
                            }).catch(l)
                        }
                        I.default.error("[" + i.streamId + "]This browser does not support screenSharing")
                    }
                } else t(); else u(d)
            }, le = n(7), pe = function (e, t, n) {
                if (-1 < ["End2EndDelay", "TransportDelay", "PacketLossRate", "RecvLevel", "RecvBitrate", "CodecType", "MuteState", "TotalFreezeTime", "TotalPlayDuration", "RecordingLevel", "SendLevel", "SamplingRate", "SendBitrate", "CodecType", "MuteState", "End2EndDelay", "TransportDelay", "PacketLossRate", "RecvBitrate", "RecvResolutionWidth", "RecvResolutionHeight", "RenderResolutionHeight", "RenderResolutionWidth", "RenderFrameRate", "TotalFreezeTime", "TotalPlayDuration", "TargetSendBitrate", "SendFrameRate", "SendFrameRate", "SendBitrate", "SendResolutionWidth", "SendResolutionHeight", "CaptureResolutionHeight", "CaptureResolutionWidth", "EncodeDelay", "MuteState", "TotalFreezeTime", "TotalDuration", "CaptureFrameRate", "RTT", "OutgoingAvailableBandwidth", "Duration", "UserCount", "SendBytes", "RecvBytes", "SendBitrate", "RecvBitrate", "accessDelay", "audioSendBytes", "audioSendPackets", "videoSendBytes", "videoSendPackets", "videoSendPacketsLost", "videoSendFrameRate", "audioSendPacketsLost", "videoSendResolutionWidth", "videoSendResolutionHeight", "accessDelay", "audioReceiveBytes", "audioReceivePackets", "audioReceivePacketsLost", "videoReceiveBytes", "videoReceivePackets", "videoReceivePacketsLost", "videoReceiveFrameRate", "videoReceiveDecodeFrameRate", "videoReceiveResolutionWidth", "videoReceiveResolutionHeight", "endToEndDelay", "videoReceiveDelay", "audioReceiveDelay", "FirstFrameTime", "VideoFreezeRate", "AudioFreezeRate", "RenderResolutionWidth", "RenderResolutionHeight"].indexOf(t) && ("string" == typeof n || isFinite(n))) return e[t] = "" + n
            }, fe = new function () {
                var a = T();
                return a.devicesHistory = {}, a.states = {
                    UNINIT: "UNINIT",
                    INITING: "INITING",
                    INITED: "INITED"
                }, a.state = a.states.UNINIT, a.deviceStates = {
                    ACTIVE: "ACTIVE",
                    INACTIVE: "INACTIVE"
                }, a.deviceReloadTimer = null, a._init = function (e, t) {
                    a.state = a.states.INITING, a.devicesHistory = {}, a._reloadDevicesInfo(function () {
                        a.state = a.states.INITED, a.dispatchEvent({type: "inited"}), e && e()
                    }, function (e) {
                        I.default.warning("Device Detection functionality cannot start properly."), a.state = a.states.UNINIT, t && t(e)
                    })
                }, a._enumerateDevices = function (t, n) {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return I.default.warning("enumerateDevices() not supported."), n && n("enumerateDevices() not supported");
                    navigator.mediaDevices.enumerateDevices().then(function (e) {
                        t && setTimeout(function () {
                            t(e)
                        }, 0)
                    }).catch(function (e) {
                        n && n(e)
                    })
                }, a._reloadDevicesInfo = function (i, e) {
                    var o = [];
                    a._enumerateDevices(function (e) {
                        var r = Date.now();
                        for (var t in e.forEach(function (e) {
                            var t = a.devicesHistory[e.deviceId];
                            if ((t ? t.state : a.deviceStates.INACTIVE) != a.deviceStates.ACTIVE) {
                                var n = t || {initAt: r};
                                n.device = e, n.state = a.deviceStates.ACTIVE, o.push(n), a.devicesHistory[e.deviceId] = n
                            }
                            a.devicesHistory[e.deviceId].lastReloadAt = r
                        }), a.devicesHistory) {
                            var n = a.devicesHistory[t];
                            n && n.state == a.deviceStates.ACTIVE && n.lastReloadAt !== r && (n.state = a.deviceStates.INACTIVE, o.push(n)), n.lastReloadAt = r
                        }
                        a.state == a.states.INITED && o.forEach(function (e) {
                            var t = A()({}, e);
                            switch (e.device.kind) {
                                case"audioinput":
                                    t.type = "recordingDeviceChanged";
                                    break;
                                case"audiooutput":
                                    t.type = "playoutDeviceChanged";
                                    break;
                                case"videoinput":
                                    t.type = "cameraChanged";
                                    break;
                                default:
                                    I.default.warning("Unknown device change", t), t.type = "unknownDeviceChanged"
                            }
                            a.dispatchEvent(t)
                        }), i && i()
                    }, e)
                }, a.getDeviceById = function (r, i, o) {
                    a.getDevices(function (e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t];
                            if (n && n.deviceId === r) return i && i(n)
                        }
                        return o && o()
                    })
                }, a.searchDeviceNameById = function (e) {
                    var t = a.devicesHistory[e];
                    return t ? t.device.label || t.device.deviceId : null
                }, a.getDevices = function (e, t) {
                    a._enumerateDevices(e, function (e) {
                        t && t(e.name + ": " + e.message)
                    })
                }, a.getVideoCameraIdByLabel = function (s, c, d) {
                    a.getCameras(function (e) {
                        var t = !0, n = !1, r = void 0;
                        try {
                            for (var i, o = e[Symbol.iterator](); !(t = (i = o.next()).done); t = !0) {
                                var a = i.value;
                                if (a.label === s) return c && c(a.deviceId)
                            }
                        } catch (e) {
                            n = !0, r = e
                        } finally {
                            try {
                                t || null == o.return || o.return()
                            } finally {
                                if (n) throw r
                            }
                        }
                        return d && d(f)
                    }, d)
                }, a.getRecordingDevices = function (n, t) {
                    return a._enumerateDevices(function (e) {
                        var t = e.filter(function (e) {
                            return "audioinput" == e.kind
                        });
                        n && n(t)
                    }, function (e) {
                        t && t(e)
                    })
                }, a.getPlayoutDevices = function (n, t) {
                    return a._enumerateDevices(function (e) {
                        var t = e.filter(function (e) {
                            return "audiooutput" == e.kind
                        });
                        n && n(t)
                    }, function (e) {
                        t && t(e)
                    })
                }, a.getCameras = function (n, t) {
                    return a._enumerateDevices(function (e) {
                        var t = e.filter(function (e) {
                            return "videoinput" == e.kind
                        });
                        n && n(t)
                    }, function (e) {
                        t && t(e)
                    })
                }, a._init(function () {
                    navigator.mediaDevices && navigator.mediaDevices.addEventListener && navigator.mediaDevices.addEventListener("devicechange", function () {
                        a._reloadDevicesInfo()
                    }), a.deviceReloadTimer = setInterval(a._reloadDevicesInfo, 5e3)
                }), a
            }, me = n(6), he = n.n(me), ve = function (e, t, n) {
                for (var r = 0; r < n.length; r++) if (e === n[r]) return !0;
                throw new Error("".concat(t, " can only be set as ").concat(JSON.stringify(n)))
            }, ge = function (e, t) {
                if (!e) throw new Error("Invalid param: ".concat(t || "param", " cannot be empty"));
                if ("object" !== he()(e)) throw new Error("".concat(t || "This paramter", " is of the object type"));
                return !0
            }, ye = function (e, t, n, r, i) {
                if (ke(n) && (n = 1), r = r || 255, ke(i) && (i = !0), ke(e)) throw new Error("".concat(t || "param", " cannot be empty"));
                if (!_e(e, n, r, i)) throw new Error("Invalid ".concat(t || "string param", ": Length of the string: [").concat(n, ",").concat(r, "].").concat(i ? " ASCII characters only." : ""))
            }, Se = function (e, t, n, r) {
                if (ke(n) && (n = 1), r = r || 1e4, ke(e)) throw new Error("".concat(t || "param", " cannot be empty"));
                if (!Ie(e, n, r)) throw new Error("Invalid ".concat(t || "number param", ": The value range is [").concat(n, ",").concat(r, "]. integer only"))
            }, be = function (e, t) {
                if (ke(e)) throw new Error("".concat(t || "param", " cannot be empty"));
                if (!we(e)) throw new Error("Invalid ".concat(t || "boolean param", ": The value is of the boolean type."))
            }, _e = function (e, t, n, r) {
                return t || (t = 0), n || (n = Number.MAX_SAFE_INTEGER), ke(r) && (r = !0), Oe(e) && (!r || Ce(e)) && e.length >= t && e.length <= n
            }, Ie = function (e, t, n) {
                return Ee(e) && t <= e && e <= n
            }, we = function (e) {
                return "boolean" == typeof e
            }, Te = function (e) {
                return _e(e, 1, 2047)
            }, Ce = function (e) {
                if ("string" == typeof e) {
                    for (var t = 0; t < e.length; t++) {
                        var n = e.charCodeAt(t);
                        if (n < 0 || 255 < n) return !1
                    }
                    return !0
                }
            }, Ee = function (e) {
                return "number" == typeof e && e % 1 == 0
            }, Oe = function (e) {
                return "string" == typeof e
            }, ke = function (e) {
                return null == e
            }, Re = n(11), Ae = function (e) {
                ye(e, "profileName"), -1 === (e = e.toLowerCase()).indexOf("_") && (e += "_1"), ve(e, "profileName", Object.keys(_.SUPPORT_RESOLUTION_LIST));
                var t = _.SUPPORT_RESOLUTION_LIST[e];
                t || (e = Object(_.getParameter)("DEFAULT_PROFILE"), t = _.SUPPORT_RESOLUTION_LIST[e]);
                var n = {
                    profileName: e,
                    video: {width: t[0], height: t[1]},
                    attributes: {
                        resolution: "".concat(t[0], "x").concat(t[1]),
                        minFrameRate: t[2],
                        maxFrameRate: t[3],
                        minVideoBW: t[4],
                        maxVideoBW: t[5]
                    }
                };
                return t[2] && t[3] && (n.video.frameRate = {ideal: t[2], max: t[3]}), t[6] && t[7] && (n.screen = {
                    width: t[0],
                    height: t[1],
                    frameRate: {min: t[6], max: t[7]}
                }), n
            }, Pe = function (a) {
                var s, c, u, d = T();
                if (d.params = A()({}, a), d.stream = a.stream, d.url = a.url, d.onClose = void 0, d.local = !1, d.videoSource = a.videoSource, d.audioSource = a.audioSource, a.video = !(!a.videoSource && !a.video), d.video = a.video, a.audio = !(!a.audioSource && !a.audio), d.audio = a.audio, d.screen = !!a.screen, d.screenAttributes = {
                    width: 1920,
                    height: 1080,
                    maxFr: 5,
                    minFr: 1
                }, d.videoSize = a.videoSize, d.player = void 0, d.audioLevelHelper = null, a.attributes = a.attributes || {}, d.attributes = a.attributes, d.microphoneId = a.microphoneId, d.cameraId = a.cameraId, d.inSwitchDevice = !1, d.userMuteVideo = !1, d.userMuteAudio = !1, d.peerMuteVideo = !1, d.peerMuteAudio = !1, d.lowStream = null, d.videoWidth = 0, d.videoHeight = 0, d.streamId = a.streamID, d.userId = null, d.mirror = !1 !== a.mirror, d.DTX = a.audioProcessing && a.audioProcessing.DTX, d.audioProcessing = a.audioProcessing, d.highQuality = !1, d.stereo = !1, d.speech = !1, d.screen || delete d.screen, !(void 0 === d.videoSize || d.videoSize instanceof Array && 4 === d.videoSize.length)) throw Error("Invalid Video Size");

                function l() {
                    var e = {};
                    d.getVideoTrack() === this ? (I.default.debug("Video Track Ended"), e.type = "videoTrackEnded", e.track = this) : d.getAudioTrack() === this ? (I.default.debug("Audio Track Ended"), e.type = "audioTrackEnded", e.track = this) : I.default.debug("Detached Track ended", this.kind, this.label, this), e.type && d.dispatchEvent(e)
                }

                return d.videoSize = [640, 480, 640, 480], void 0 !== a.local && !0 !== a.local || (d.local = !0), d.initialized = !d.local, (u = d).audioMixing = {
                    audioContextInited: !1,
                    defaultVolume: 100,
                    inEarMonitoring: "FILE",
                    sounds: {},
                    states: {IDLE: "IDLE", STARTING: "STARTING", BUSY: "BUSY", PAUSED: "PAUSED"},
                    inEarMonitoringModes: {NONE: "NONE", FILE: "FILE", MICROPHONE: "MOCROPHONE", ALL: "ALL"},
                    ctx: null,
                    mediaStreamSource: null,
                    mediaStreamDest: null,
                    buffer: {}
                }, u._initSoundIfNotExists = function (e, t) {
                    u.audioMixing.sounds[e] || (u.audioMixing.sounds[e] = {
                        soundId: e,
                        state: "IDLE",
                        muted: u.userMuteAudio,
                        filePath: t,
                        volume: u.audioMixing.defaultVolume,
                        startAt: null,
                        startOffset: null,
                        pauseAt: null,
                        pauseOffset: null,
                        resumeAt: null,
                        resumeOffset: null,
                        stopAt: null,
                        options: null,
                        source: null
                    })
                }, u._initSoundIfNotExists(-1), u.loadAudioBuffer = function (n, e, t) {
                    var r = w.b.reportApiInvoke(u.sid, {callback: t, name: "Stream.loadAudioBuffer", options: arguments, tag: "tracer"});
                    ye(e, "url", 1, 1024, !1), ye(n, "id", 1, 1024, !1);
                    var i = new XMLHttpRequest;
                    i.open("GET", e, !0), i.responseType = "arraybuffer", i.onload = function () {
                        if (400 < i.status) {
                            var e = i.statusText;
                            return I.default.error("[".concat(u.streamId, "] loadAudioBuffer Failed: ") + e), r(e)
                        }
                        var t = i.response;
                        u.audioMixing.audioContextInited || u._initAudioContext(), u.audioMixing.ctx.decodeAudioData(t, function (e) {
                            u.audioMixing.buffer[n] = e, r(null)
                        }, function (e) {
                            I.default.error("[".concat(u.streamId, "] decodeAudioData Failed: "), e), r(e)
                        })
                    }, i.send()
                }, u.createAudioBufferSource = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {name: "Stream.createAudioBufferSource", options: arguments, tag: "tracer"});
                    if (u.audioMixing.buffer[e.id]) {
                        var n = u.audioMixing.buffer[e.id], r = u.audioMixing.ctx.createBufferSource();
                        r.buffer = n;
                        var i = u.audioMixing.ctx.createGain();
                        if (r.connect(i), i.connect(u.audioMixing.mediaStreamDest), r.gainNode = i, e.loop) r.loop = !0, r.start(0, e.playTime / 1e3); else if (1 < e.cycle) if (Object(R.isChrome)()) {
                            r.loop = !0;
                            var o = e.cycle * n.duration * 1e3 - (e.playTime || 0);
                            r.start(0, e.playTime / 1e3, o / 1e3)
                        } else I.default.warning("[".concat(u.streamId, "] Cycle Param is ignored by current browser")), r.start(0, e.playTime / 1e3); else r.start(0, e.playTime / 1e3);
                        var a = u.audioMixing.sounds[e.soundId];
                        return a.source = r, u._flushAudioMixingMuteStatus(), r.addEventListener("ended", function () {
                            r === a.source && u.dispatchEvent({type: "audioSourceEnded", soundId: e.soundId, source: r, sound: a})
                        }), t(), r
                    }
                    return I.default.error("[".concat(u.streamId, "] "), "AUDIOBUFFER_NOT_FOUND", e.id), t(!1), !1
                }, u.on("audioSourceEnded", function (e) {
                    e.source;
                    var t = e.sound;
                    t && t.state === u.audioMixing.states.BUSY && !t.pauseAt && (t.state = u.audioMixing.states.IDLE, t.startAt = null, t.startOffset = null, t.resumeAt = null, t.resumeOffset = null, u.audioMixing.mediaStreamSource.connect(u.audioMixing.mediaStreamDest))
                }), u.clearAudioBufferSource = function () {
                    u.audioBufferSource.forEach(function (e) {
                        e.stop()
                    })
                }, u._isSoundExists = function (e) {
                    return !!u.audioMixing.sounds[e.soundId] || (I.default.error("SoundId not exists. #".concat(e.soundId)), !1)
                }, u._initAudioContext = function () {
                    if (u.audioMixing.audioContextInited) throw new Error("Failed to init audio context. Already inited");
                    if (!u.stream) throw new Error("Failed to init audio context. Local Stream not initialized");
                    u.audioMixing.ctx = Object(Re.a)(), u.audioMixing.mediaStreamSource = u.audioMixing.ctx.createMediaStreamSource(u.stream), u.audioMixing.mediaStreamDest = u.audioMixing.ctx.createMediaStreamDestination(), u.audioMixing.mediaStreamSource.connect(u.audioMixing.mediaStreamDest);
                    var e = u.stream.getVideoTracks()[0];
                    if (e && u.audioMixing.mediaStreamDest.stream.addTrack(e), u._isAudioMuted() ? (u._unmuteAudio(), u.stream = u.audioMixing.mediaStreamDest.stream, u._muteAudio()) : u.stream = u.audioMixing.mediaStreamDest.stream, u.audioLevelHelper = null, u.pc && u.pc.peerConnection && u.pc.peerConnection) {
                        var t = (u.pc.peerConnection && u.pc.peerConnection.getSenders()).find(function (e) {
                            return e && e.track && "audio" == e.track.kind
                        }), n = u.audioMixing.mediaStreamDest.stream.getAudioTracks()[0];
                        t && t.replaceTrack && n && t.replaceTrack(n)
                    }
                    u.audioMixing.audioContextInited = !0
                }, u._cleanupAudioMixing = function () {
                    if (u.audioMixing.audioContextInited) {
                        for (var e in u.audioMixing.sounds) {
                            var t = u.audioMixing.sounds[e];
                            t.state !== u.audioMixing.states.BUSY && t.state !== u.audioMixing.states.PAUSED || u._stopOneEffect({soundId: e})
                        }
                        u.audioLevelHelper = null, u.audioMixing.audioContextInited = !1
                    }
                }, u._reloadInEarMonitoringMode = function (e) {
                    if (e) {
                        if (!u.audioMixing.inEarMonitoringModes[e]) return I.default.error("[".concat(u.streamId, "] Invalid InEarMonitoringMode ").concat(e));
                        u.audioMixing.inEarMonitoring = e
                    }
                    switch (u.audioMixing.audioContextInited || u._initAudioContext(), u.audioMixing.inEarMonitoring) {
                        case u.audioMixing.inEarMonitoringModes.FILE:
                            u.audioMixing.mediaStreamSource.connectedToDestination && (u.audioMixing.mediaStreamSource.disconnect(u.audioMixing.ctx.destination), u.audioMixing.mediaStreamSource.connectedToDestination = !1);
                        case u.audioMixing.inEarMonitoringModes.ALL:
                            for (var t in u.audioMixing.sounds) {
                                var n = u.audioMixing.sounds[t];
                                n && n.source && !n.source.connectedToDestination && (n.source.gainNode.connect(u.audioMixing.ctx.destination), n.source.connectedToDestination = !0)
                            }
                    }
                    switch (u.audioMixing.inEarMonitoring) {
                        case u.audioMixing.inEarMonitoringModes.MICROPHONE:
                            u.audioMixing.source.forEach(function (e) {
                                e.connectedToDestination && (e.gainNode.disconnect(u.audioMixing.ctx.destination), e.connectedToDestination = !1)
                            });
                        case u.audioMixing.inEarMonitoringModes.ALL:
                            u.audioMixing.mediaStreamSource.connectedToDestination || (u.audioMixing.mediaStreamSource.connect(u.audioMixing.ctx.destination), u.audioMixing.mediaStreamSource.connectedToDestination = !0)
                    }
                }, u._startAudioMixingBufferSource = function (e) {
                    u.audioMixing.audioContextInited || u._initAudioContext();
                    var t = {soundId: e.soundId, id: e.filePath, loop: e.loop, cycle: e.cycle, playTime: e.playTime || 0}, n = e.replace,
                        r = u.createAudioBufferSource(t);
                    return r.sound = u.audioMixing.sounds[e.soundId], r ? (r.addEventListener("ended", u._audioMixingFinishedListener, {once: !0}), u._reloadInEarMonitoringMode(), n && u.audioMixing.mediaStreamSource.disconnect(u.audioMixing.mediaStreamDest), r) : null
                }, u._stopAudioMixingBufferSource = function (e) {
                    var t = u.audioMixing.sounds[e.soundId].source;
                    return t ? (t.removeEventListener("ended", u._audioMixingFinishedListener), u.audioMixing.mediaStreamSource.connect(u.audioMixing.mediaStreamDest), t.stop(), t) : null
                }, u._flushAudioMixingMuteStatus = function (e) {
                    for (var t in u.audioMixing.sounds) {
                        var n = u.audioMixing.sounds[t];
                        n && (void 0 !== e && (n.muted = !!e), n.source && (n.muted ? n.source.gainNode.gain.value = 0 : n.source.gainNode.gain.value = n.volume / 100))
                    }
                }, u._handleAudioMixingInvalidStateError = function (e, t, n) {
                    var r = u.audioMixing.sounds[t.soundId], i = -1 === t.soundId ? "INVALID_AUDIO_MIXING_STATE" : "INVALID_PLAY_EFFECT_STATE";
                    I.default.error("[".concat(u.streamId, "] Cannot ").concat(e, ": ").concat(i, ", state is ").concat(r.state)), n && n(i)
                }, u._handleAudioMixingNoSourceError = function (e, t, n) {
                    u.audioMixing.sounds[t.soundId].state = u.audioMixing.states.IDLE;
                    var r = -1 === t.soundId ? "NO_AUDIO_MIXING_SOURCE" : "NO_EFFECT_SOURCE";
                    I.default.error("[".concat(u.streamId, "] Cannot ").concat(e, ": ").concat(r)), n && n(r)
                }, u._getOneEffectStates = function (e) {
                    var t = u.audioMixing.sounds[e.soundId];
                    return function () {
                        return t ? {
                            state: t.state,
                            startAt: t.startAt,
                            resumeAt: t.resumeAt,
                            pauseOffset: t.pauseOffset,
                            pauseAt: t.pauseAt,
                            resumeOffset: t.resumeOffset,
                            stopAt: t.stopAt,
                            duration: u._getOneEffectDuration(e),
                            position: u._getOneEffectCurrentPosition(e)
                        } : {}
                    }
                }, u._audioMixingFinishedListener = function () {
                    var e = this.sound;
                    e.state === u.audioMixing.states.IDLE && u.audioMixing.buffer[e.options.filePath] && !e.options.cacheResource && (I.default.debug("Recycled buffer ".concat(e.options.filePath)), delete u.audioMixing.buffer[e.options.filePath]), -1 === e.soundId && u.dispatchEvent({type: "audioMixingFinished"})
                }, u._playOneEffect = function (n, r) {
                    ge(n, "options");
                    var e = n.soundId, t = (n.filePath, n.cacheResource);
                    if (n.cycle, n.loop, n.playTime, n.replace, Object(R.isSafari)() && Object(R.getBrowserVersion)() < 12) {
                        var i = "BROWSER_NOT_SUPPORT";
                        return I.default.error("[".concat(u.streamId, "] Cannot _playOneEffect: "), i), r(i)
                    }
                    u.audioMixing.audioContextInited || u._initAudioContext(), u._initSoundIfNotExists(e);
                    var o = u.audioMixing.sounds[e];
                    if (o.state === u.audioMixing.states.IDLE) {
                        if (void 0 !== n.cycle && 0 < !n.cycle) return i = "Invalid Parmeter cycle: " + n.cycle, I.default.error("[".concat(u.streamId, "] ").concat(e), i), r(i);
                        if (ke(t) && (n.cacheResource = !0), o.state = u.audioMixing.states.STARTING, o.options = n, u.audioMixing.buffer[n.filePath]) {
                            var a = u._startAudioMixingBufferSource(n);
                            if (a) return o.source = a, o.startAt = Date.now(), o.resumeAt = null, o.pauseOffset = null, o.pauseAt = null, o.resumeOffset = null, o.stopAt = null, o.startOffset = n.playTime || 0, o.state = u.audioMixing.states.BUSY, u._flushAudioMixingMuteStatus(), r(null);
                            o.state = u.audioMixing.states.IDLE;
                            var s = "CREATE_BUFFERSOURCE_FAILED";
                            if (r) return r(s);
                            I.default.error("[".concat(u.streamId, "] "), s)
                        } else u.loadAudioBuffer(n.filePath, n.filePath, function (e) {
                            if (e) o.state = u.audioMixing.states.IDLE, r ? r(e) : I.default.error("[".concat(u.streamId, "] "), e); else {
                                var t = u._startAudioMixingBufferSource(n);
                                if (t) return o.source = t, o.startAt = Date.now(), o.resumeAt = null, o.pauseOffset = null, o.pauseAt = null, o.resumeOffset = null, o.stopAt = null, o.startOffset = n.playTime || 0, o.state = u.audioMixing.states.BUSY, u._flushAudioMixingMuteStatus(), r(null);
                                if (o.state = u.audioMixing.states.IDLE, e = "CREATE_BUFFERSOURCE_FAILED", r) return r(e);
                                I.default.error("[".concat(u.streamId, "] "), e)
                            }
                        })
                    } else u._handleAudioMixingInvalidStateError("_playEffect", n, r)
                }, u._stopOneEffect = function (e, t) {
                    var n = u.audioMixing.sounds[e.soundId];
                    return u._isSoundExists(e) ? n.state === u.audioMixing.states.BUSY || n.state === u.audioMixing.states.PAUSED ? (u._stopAudioMixingBufferSource(e), n.stopAt = Date.now(), n.state = u.audioMixing.states.IDLE, u.audioMixing.buffer[n.options.filePath] && !n.options.cacheResource && (I.default.debug("Recycled buffer ".concat(n.options.filePath)), delete u.audioMixing.buffer[n.options.filePath]), void (t && t(null))) : void u._handleAudioMixingInvalidStateError("_stopOneEffect", e, t) : t("SOUND_NOT_EXISTS")
                }, u._pauseOneEffect = function (e, t) {
                    var n = u.audioMixing.sounds[e.soundId];
                    if (n.state === u.audioMixing.states.BUSY) return u._stopAudioMixingBufferSource(e) ? (n.pauseAt = Date.now(), n.state = u.audioMixing.states.PAUSED, n.resumeAt ? n.pauseOffset = n.pauseAt - n.resumeAt + n.resumeOffset : n.pauseOffset = n.pauseAt - n.startAt + n.startOffset, t && t(null)) : void u._handleAudioMixingNoSourceError("_pauseOneEffect", e, t);
                    u._handleAudioMixingInvalidStateError("_pauseOneEffect", e, t)
                }, u._resumeOneEffect = function (e, t) {
                    var n = u.audioMixing.sounds[e.soundId];
                    if (n.state === u.audioMixing.states.PAUSED) {
                        var r = {
                            soundId: e.soundId,
                            filePath: n.options.filePath,
                            cycle: n.options.cycle,
                            loop: n.options.loop,
                            playTime: n.pauseOffset,
                            replace: n.options.replace
                        }, i = u._startAudioMixingBufferSource(r);
                        if (!i) {
                            var o = "CREATE_BUFFERSOURCE_FAILED";
                            return t(o), void I.default.error("[".concat(u.streamId, "] "), o)
                        }
                        n.source = i, n.resumeAt = Date.now(), n.resumeOffset = n.pauseOffset, n.state = u.audioMixing.states.BUSY, n.pauseAt = null, t(n.pauseOffset = null)
                    } else u._handleAudioMixingInvalidStateError("_resumeOneEffect", e, t)
                }, u._getOneEffectDuration = function (e) {
                    var t = u.audioMixing.sounds[e.soundId];
                    return t.options && t.options.filePath && u.audioMixing.buffer[t.options.filePath] ? 1e3 * u.audioMixing.buffer[t.options.filePath].duration : null
                }, u._getOneEffectCurrentPosition = function (e, t) {
                    var n = u.audioMixing.sounds[e.soundId];
                    return n.state === u.audioMixing.states.PAUSED ? n.pauseOffset % u._getOneEffectDuration(e) : n.state === u.audioMixing.states.BUSY ? n.resumeAt ? (Date.now() - n.resumeAt + n.resumeOffset + n.startOffset) % u._getOneEffectDuration(e) : (Date.now() - n.startAt + n.startOffset) % u._getOneEffectDuration(e) : void (t && u._handleAudioMixingInvalidStateError("_getOneEffectCurrentPosition", e))
                }, u._setOneEffectPosition = function (e, t, n) {
                    var r = u.audioMixing.sounds[e.soundId];
                    if (r.state === u.audioMixing.states.BUSY) {
                        if (!u._stopAudioMixingBufferSource(e)) return void u._handleAudioMixingNoSourceError("_setOneEffectPosition", e, n);
                        var i = {soundId: e.soundId, filePath: r.options.filePath, loop: r.options.loop, cycle: r.options.cycle, playTime: t},
                            o = u._startAudioMixingBufferSource(i);
                        if (!o) {
                            var a = "CREATE_BUFFERSOURCE_FAILED";
                            return n && n(a), void I.default.error("[".concat(u.streamId, "] "), a)
                        }
                        r.source = o, r.startAt = Date.now(), r.startOffset = t, r.resumeAt = null, r.resumeOffset = null, r.pauseOffset = null, r.pauseAt = null
                    } else {
                        if (r.state !== u.audioMixing.states.PAUSED) return void u._handleAudioMixingInvalidStateError("_setOneEffectPosition", e, n);
                        r.pauseOffset = t
                    }
                    n && n(null)
                }, u.startAudioMixing = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {
                        callback: function (e) {
                            if (e) return t && t(e);
                            u.dispatchEvent({type: "audioMixingPlayed"}), t && t(null)
                        }, getStates: u._getOneEffectStates({soundId: -1}), name: "Stream.startAudioMixing", options: e
                    });
                    ge(e, "options");
                    var r = e.filePath, i = e.cacheResource, o = e.cycle, a = e.loop, s = e.playTime, c = e.replace;
                    ye(r, "filePath", 1, Object(_.getParameter)("FILEPATH_LENMAX"), !1), Se(s, "playTime", 0, 1e8), !ke(o) && Se(o, "cycle"), !ke(a) && be(a, "loop"), !ke(c) && be(c, "replace"), !ke(i) && be(i, "cacheResource");
                    var d = A()({soundId: -1}, e);
                    u._playOneEffect(d, n)
                }, u.stopAudioMixing = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {callback: e, getStates: u._getOneEffectStates({soundId: -1}), name: "Stream.stopAudioMixing"});
                    u._stopOneEffect({soundId: -1}, t)
                }, u.pauseAudioMixing = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {callback: e, getStates: u._getOneEffectStates({soundId: -1}), name: "Stream.pauseAudioMixing"});
                    return u._pauseOneEffect({soundId: -1}, t)
                }, u.resumeAudioMixing = function (n) {
                    var e = w.b.reportApiInvoke(u.sid, {
                        callback: function (e, t) {
                            if (e) return n && n(e);
                            u.dispatchEvent({type: "audioMixingPlayed"}), n && n(null)
                        }, getStates: u._getOneEffectStates({soundId: -1}), name: "Stream.resumeAudioMixing"
                    });
                    u._resumeOneEffect({soundId: -1}, e)
                }, u.adjustAudioMixingVolume = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {
                        getStates: u._getOneEffectStates({soundId: -1}),
                        name: "Stream.adjustAudioMixingVolume",
                        options: arguments,
                        tag: "tracer"
                    });
                    Se(e, "volume", 0, 100), u.audioMixing.sounds[-1].volume = e, u._flushAudioMixingMuteStatus(), t()
                }, u.getAudioMixingDuration = function () {
                    var e = w.b.reportApiInvoke(u.sid, {getStates: u._getOneEffectStates({soundId: -1}), name: "Stream.getAudioMixingDuration"}),
                        t = u._getOneEffectDuration({soundId: -1});
                    return e(null, t), t
                }, u.getAudioMixingCurrentPosition = function () {
                    var e = w.b.reportApiInvoke(u.sid, {getStates: u._getOneEffectStates({soundId: -1}), name: "Stream.getAudioMixingCurrentPosition"}),
                        t = u._getOneEffectCurrentPosition({soundId: -1}, !0);
                    return e(null, t), t
                }, u.setAudioMixingPosition = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {
                        callback: t,
                        options: arguments,
                        tag: "tracer",
                        getStates: u._getOneEffectStates({soundId: -1}),
                        name: "Stream.setAudioMixingPosition"
                    });
                    Se(e, "position", 0, 1e8), u._setOneEffectPosition({soundId: -1}, e, n)
                }, u.playEffect = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {
                        callback: function (e) {
                            if (e) return t && t(e);
                            u.dispatchEvent({type: "effectPlayed"}), t && t(null)
                        }, name: "Stream.playEffect", options: e
                    });
                    ge(e, "options");
                    var r = e.soundId, i = e.filePath, o = e.cycle;
                    Se(r, "soundId", 1, 1e4), ye(i, "filePath", 0, Object(_.getParameter)("FILEPATH_LENMAX"), !1), !ke(o) && Se(o, "cycle"), u._playOneEffect(e, n)
                }, u.stopEffect = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {callback: t, getStates: u._getOneEffectStates({soundId: e}), name: "Stream.stopEffect"});
                    Se(e, "soundId", 1, 1e4), u._stopOneEffect({soundId: e}, n)
                }, u.stopAllEffects = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {callback: e, name: "Stream.stopAllEffect"}), n = !1, r = 0, i = 0, o = function (e) {
                        n || (e ? (t(e), n = !0) : r += 1, r === i && (t(null), n = !0))
                    };
                    for (var a in u.audioMixing.sounds) {
                        var s = u.audioMixing.sounds[a];
                        -1 !== s.soundId && (s.state !== u.audioMixing.states.BUSY && s.state !== u.audioMixing.states.PAUSED || (i++, u._stopOneEffect({soundId: a}, o)))
                    }
                    i || t(null)
                }, u.preloadEffect = function (e, t, n) {
                    var r = w.b.reportApiInvoke(u.sid, {callback: n, options: arguments, tag: "tracer", name: "Stream.preloadEffect"});
                    Se(e, "soundId", 1, 1e4), ye(t, "filePath", 1, Object(_.getParameter)("FILEPATH_LENMAX"), !1), u._initSoundIfNotExists(e, t), u.audioMixing.buffer[t] ? r(null) : u.loadAudioBuffer(t, t, r)
                }, u.unloadEffect = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {callback: t, options: arguments, tag: "tracer", name: "Stream.unloadEffect"});
                    Se(e, "soundId", 1, 1e4);
                    var r = u.audioMixing.sounds[e];
                    if (!r) {
                        var i = "SOUND_NOT_EXISTS";
                        return I.default.error(i, e), void n(i)
                    }
                    var o = r.options ? r.options.filePath : r.filePath;
                    if (o) delete u.audioMixing.buffer[o], delete u.audioMixing.sounds[e], n(null); else {
                        var a = "SOUND_BUFFER_NOT_FOUND";
                        I.default.error(a, e), n(a)
                    }
                }, u.pauseEffect = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {callback: t, options: arguments, tag: "tracer", name: "Stream.pauseEffect"});
                    return u._pauseOneEffect({soundId: e}, n)
                }, u.pauseAllEffects = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {callback: e, name: "Stream.pauseAllEffects"}), n = !1, r = 0, i = 0, o = function (e) {
                        n || (e ? (t(e), n = !0) : r += 1, r === i && (t(null), n = !0))
                    };
                    for (var a in u.audioMixing.sounds) "-1" !== a && u.audioMixing.sounds[a].state === u.audioMixing.states.BUSY && (i++, u._pauseOneEffect({soundId: a}, o));
                    i || t(null)
                }, u.resumeEffect = function (e, t) {
                    Se(e, "soundId", 1, 1e4);
                    var n = w.b.reportApiInvoke(u.sid, {callback: t, options: arguments, tag: "tracer", name: "Stream.resumeEffect"});
                    return u._resumeOneEffect({soundId: e}, n)
                }, u.resumeAllEffects = function (e) {
                    var t = w.b.reportApiInvoke(u.sid, {callback: e, name: "Stream.resumeAllEffects"}), n = !1, r = 0, i = 0, o = function (e) {
                        n || (e ? (t(e), n = !0) : r += 1, r === i && (t(null), n = !0))
                    };
                    for (var a in u.audioMixing.sounds) "-1" !== a && u.audioMixing.sounds[a].state === u.audioMixing.states.PAUSED && (i++, u._resumeOneEffect({soundId: a}, o));
                    i || t(null)
                }, u.getEffectsVolume = function () {
                    var e = [];
                    for (var t in u.audioMixing.sounds) {
                        var n = u.audioMixing.sounds[t];
                        n && "-1" !== t && e.push({soundId: parseInt(t), volume: n.volume})
                    }
                    return e
                }, u.setEffectsVolume = function (e, t) {
                    var n = w.b.reportApiInvoke(u.sid, {name: "Stream.setEffectsVolume", options: arguments, tag: "tracer", callback: t});
                    for (var r in Se(e, "volume", 0, 100), u.audioMixing.defaultVolume = e, u.audioMixing.sounds) {
                        var i = u.audioMixing.sounds[r];
                        "-1" !== r && (i.volume = e)
                    }
                    u._flushAudioMixingMuteStatus(), n(null)
                }, u.setVolumeOfEffect = function (e, t, n) {
                    var r = w.b.reportApiInvoke(u.sid, {name: "Stream.setVolumeOfEffect", options: arguments, tag: "tracer", callback: n});
                    Se(e, "soundId", 0, 1e4), Se(t, "volume", 0, 100), u._initSoundIfNotExists(e), u.audioMixing.sounds[e].volume = t, u._flushAudioMixingMuteStatus(), r(null)
                }, c = a, (s = d).videoConstraint = {}, c.cameraId && (s.videoConstraint.deviceId = {exact: c.cameraId}), s.videoSize && (s.videoConstraint.width = s.videoSize[0], s.videoConstraint.height = s.videoSize[1]), Object(R.isLegacyChrome)() || (s.videoConstraint.frameRate = {
                    ideal: 30,
                    max: 30
                }), s.audioConstraint = {}, c.microphoneId && (s.audioConstraint.deviceId = {exact: c.microphoneId}), Object(R.isLegacyChrome)() || s.audioProcessing && (void 0 !== s.audioProcessing.AGC && (Object(R.isFireFox)() ? s.audioConstraint.autoGainControl = s.audioProcessing.AGC : Object(R.isChrome)() && (s.audioConstraint.googAutoGainControl = s.audioProcessing.AGC, s.audioConstraint.googAutoGainControl2 = s.audioProcessing.AGC)), void 0 !== s.audioProcessing.AEC && (s.audioConstraint.echoCancellation = s.audioProcessing.AEC), void 0 !== s.audioProcessing.ANS && (Object(R.isFireFox)() ? s.audioConstraint.noiseSuppression = s.audioProcessing.ANS : Object(R.isChrome)() && (s.audioConstraint.googNoiseSuppression = s.audioProcessing.ANS))), s.screenConstraint = {}, c.sourceId && (s.screenConstraint.sourceId = c.sourceId), c.extensionId && Object(R.isChrome)() ? (s.screenConstraint.extensionId = c.extensionId, s.screenConstraint.mandatory = {
                    chromeMediaSource: "desktop",
                    maxWidth: s.screenAttributes.width,
                    maxHeight: s.screenAttributes.height,
                    maxFrameRate: s.screenAttributes.maxFr,
                    minFrameRate: s.screenAttributes.minFr
                }) : (s.screenConstraint.mediaSource = "screen", s.screenConstraint.width = s.screenAttributes.width, s.screenConstraint.height = s.screenAttributes.height, s.screenConstraint.frameRate = {
                    ideal: s.screenAttributes.maxFr,
                    max: s.screenAttributes.maxFr
                }), c.mediaSource && (s.screenConstraint.mediaSource = c.mediaSource), s.setVideoResolution = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoResolution", options: arguments, tag: "tracer"});
                    if (!(e instanceof Array)) {
                        var n = Ae(e += "");
                        return n && n.video ? (s.videoConstraint = A()(s.videoConstraint, {
                            width: {ideal: n.video.width},
                            height: {ideal: n.video.height}
                        }), c.attributes.resolution = n.attributes.resolution, (r = s.stream && s.stream.getVideoTracks && s.stream.getVideoTracks()[0]) && r.applyConstraints ? (I.default.debug("setVideoResolution applyConstraints", s.videoConstraint), r.applyConstraints(s.videoConstraint).then(t).catch(t)) : t(), !0) : (t("NO_PROFILE_".concat(e)), !1)
                    }
                    var r, i = e[0], o = e[1];
                    s.videoConstraint = A()(s.videoConstraint, {
                        width: {ideal: i},
                        height: {ideal: o}
                    }), c.attributes.resolution = "".concat(i, "x").concat(o), (r = s.stream && s.stream.getVideoTracks && s.stream.getVideoTracks()[0]) && r.applyConstraints ? (I.default.debug("setVideoResolution applyConstraints", s.videoConstraint), r.applyConstraints(s.videoConstraint).then(t).catch(t)) : t()
                }, s.setVideoFrameRate = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoFrameRate", options: arguments, tag: "tracer"});
                    if (Object(R.isFireFox)()) return t("FIREFOX_NOT_SUPPORTED"), !1;
                    if ("object" === he()(e) && e instanceof Array && 1 < e.length) {
                        s.videoConstraint = A()(s.videoConstraint, {
                            frameRate: {
                                ideal: e[0],
                                max: e[1]
                            }
                        }), c.attributes.minFrameRate = e[0], c.attributes.maxFrameRate = e[1];
                        var n = s.stream && s.stream.getVideoTracks && s.stream.getVideoTracks()[0];
                        return n && n.applyConstraints ? (I.default.debug("setVideoFrameRate applyConstraints", s.videoConstraint), n.applyConstraints(s.videoConstraint).then(t).catch(t)) : t(), !0
                    }
                    return t("INVALID_PARAM_".concat(JSON.stringify(e))), !1
                }, s.setVideoBitRate = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoBitRate", options: arguments, tag: "tracer"});
                    return "object" === he()(e) && e instanceof Array && 1 < e.length ? (c.attributes.minVideoBW = e[0], c.attributes.maxVideoBW = e[1], s.connectionSpec && (s.connectionSpec.minVideoBW = e[0], s.connectionSpec.maxVideoBW = e[1]), s.pc && s.pc.renegotiate && s.pc.renegotiate(), t(), !0) : (t("INVALID_PARAM_".concat(JSON.stringify(e))), !1)
                }, s.setScreenBitRate = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setScreenBitRate", options: arguments, tag: "tracer"});
                    return "object" === he()(e) && e instanceof Array && 1 < e.length ? (c.screenAttributes.minVideoBW = e[0], c.screenAttributes.maxVideoBW = e[1], t(), !0) : (t("INVALID_PARAM_".concat(JSON.stringify(e))), !1)
                }, s.setScreenProfile = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setScreenProfile", options: arguments, tag: "tracer"});
                    ve(e, "profile", ["480p_1", "480p_2", "720p_1", "720p_2", "1080p_1", "1080p_2"]);
                    var n = Ae(e);
                    return n && n.screen ? (s.screenConstraint.mandatory ? (s.screenConstraint.mandatory.maxWidth = n.screen.width, s.screenConstraint.mandatory.maxHeight = n.screen.height, n.screen.frameRate && n.screen.frameRate.min && n.screen.frameRate.max && (s.screenConstraint.mandatory.minFrameRate = n.screen.frameRate.min, s.screenConstraint.mandatory.maxFrameRate = n.screen.frameRate.max)) : s.screenConstraint = A()(s.screenConstraint, n.screen), s.screenAttributes.width = n.screen.width, s.screenAttributes.height = n.screen.height, s.screenAttributes.minFr = n.screen.frameRate.min, s.screenAttributes.maxFr = n.screen.frameRate.max, t(), !0) : (t("NO_SCREEN_PROFILE_".concat(JSON.stringify(e))), !1)
                }, s.setVideoProfileCustom = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoProfileCustom", options: arguments, tag: "tracer"});
                    s.setVideoResolution(e[0]), s.setVideoFrameRate([e[1], e[1]]), s.setVideoBitRate([e[2], e[2]]), t()
                }, s.setVideoProfileCustomPlus = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoProfileCustom", options: arguments, tag: "tracer"});
                    s.videoConstraint.width = e.width, s.videoConstraint.height = e.height, c.attributes.resolution = "".concat(e.width, "x").concat(e.height), s.setVideoFrameRate([e.framerate, e.framerate]), s.setVideoBitRate([e.bitrate, e.bitrate]), t()
                }, s.setVideoProfile = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoProfile", options: arguments, tag: "tracer"}), n = Ae(e);
                    if (!n) {
                        var r = "Invalid Profile ".concat(e);
                        throw new Error(r)
                    }
                    if (s.profile = e, n && n.video) {
                        s.profile = n.profileName, s.videoConstraint = A()(s.videoConstraint, n.video), s.connectionSpec && n.attributes.maxVideoBW && (s.connectionSpec.minVideoBW = n.attributes.minVideoBW, s.connectionSpec.maxVideoBW = n.attributes.maxVideoBW), Object(R.isEdge)() && (s.videoConstraint.frameRate.max = 60), Object(R.isFireFox)() && (s.videoConstraint.frameRate = {
                            ideal: 30,
                            max: 30
                        }), c.attributes = A()(c.attributes, n.attributes), s.pc && s.pc.renegotiate && s.pc.renegotiate();
                        var i = s.stream && s.stream.getVideoTracks && s.stream.getVideoTracks()[0];
                        return i && i.applyConstraints ? (I.default.debug("setVideoProfile applyConstraints", s.videoConstraint), i.applyConstraints(s.videoConstraint).then(function (e) {
                            t(e), Object(le.h)(s.stream, function (e, t) {
                                s.videoWidth = e, s.videoHeight = t
                            }, function (e) {
                                I.default.warning("[".concat(s.streamId, "] vsResHack failed: "), e)
                            })
                        }).catch(t)) : t(), !0
                    }
                    return t("INVALID_VIDEO_PROFILE_".concat(e)), !1
                }, s.setAudioProfile = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setAudioProfile", options: arguments, tag: "tracer"});
                    ve(e, "profile", ["speech_low_quality", "speech_standard", "music_standard", "standard_stereo", "high_quality", "high_quality_stereo"]);
                    var n = function (e) {
                        var t = _.AUDIO_PROFILE_SETTINGS[e] || _.AUDIO_PROFILE_SETTINGS.default;
                        return {highQuality: t[0], stereo: t[1], speech: t[2], lowQuality: t[3]}
                    }(s.audioProfile = e);
                    return s.highQuality = n.highQuality, s.stereo = n.stereo, s.speech = n.speech, s.lowQuality = n.lowQuality, s.stereo && Object(R.isChrome)() && (s.audioConstraint.googAutoGainControl = !1, s.audioConstraint.googAutoGainControl2 = !1, s.audioConstraint.echoCancellation = !1, s.audioConstraint.googNoiseSuppression = !1), t(), !0
                }, s.setVideoEncoderConfiguration = function (e) {
                    ge(e, "config");
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.setVideoEncoderConfiguration", options: e, tag: "tracer"});
                    e.resolution && (Se(e.resolution.width, "config.resolution.width"), Se(e.resolution.height, "config.resolution.height"), s.setVideoResolution([e.resolution.width, e.resolution.height])), e.frameRate && (Se(e.frameRate.min, "config.frameRate.min"), Se(e.frameRate.max, "config.frameRate.max"), s.setVideoFrameRate([e.frameRate.min, e.frameRate.max])), e.bitrate && (Se(e.bitrate.min, "config.bitrate.min", 1, 1e7), Se(e.bitrate.max, "config.bitrate.max", 1, 1e7), s.setVideoBitRate([e.bitrate.min, e.bitrate.max])), t()
                }, s.getSupportedProfile = function (e) {
                    var t = w.b.reportApiInvoke(s.sid, {name: "Stream.getSupportedProfile", options: arguments, tag: "tracer", callback: e});
                    if (!s.local) {
                        var n = "ONLY_LOCAL_STREAM_SUPPORTED";
                        return I.default.error(n), t(n)
                    }
                    if (!s.stream) return n = "STREAM_NOT_INIT", I.default.error(n), t(n);
                    if (!s.stream.getVideoTracks) return n = "TRACK_NOT_SUPPORT", I.default.error(n), t(n);
                    var r = s.stream.getVideoTracks()[0];
                    return r ? r.getCapabilities ? t(null, function (o) {
                        return Object.keys(_.SUPPORT_RESOLUTION_LIST).filter(function (e) {
                            var t = _.SUPPORT_RESOLUTION_LIST[e], n = ["width", "height", "frameRate"];
                            for (var r in n) {
                                var i = n[r];
                                if (o[i] && t[r]) {
                                    if ("number" == typeof o[i].max && o[i].max < t[r]) return !1;
                                    if ("number" == typeof o[i].min && o[i].min > t[r]) return !1
                                }
                            }
                            return !0
                        }).reverse()
                    }(r.getCapabilities())) : (n = "GETCAPABILITY_NOT_SUPPORT", I.default.error(n), t(n)) : (n = "NO_VIDEO_TRACK_FOUND", I.default.error(n), t(n))
                }, d.on("collectStats", function (e) {
                    e.promises.push(d._getPCStats(e.interval)), e.promises.push(new Promise(function (e) {
                        var t = {};
                        d.pc && d.pc.isSubscriber ? null !== window.navigator.userAgent.match("Firefox") && (pe(t, "videoReceiveResolutionHeight", d.videoHeight), pe(t, "videoReceiveResolutionWidth", d.videoWidth)) : d.pc && !d.pc.isSubscriber && ((Object(R.isSafari)() || Object(R.isFireFox)()) && (pe(t, "videoSendResolutionHeight", d.videoHeight), pe(t, "videoSendResolutionWidth", d.videoWidth)), (Object(R.isSafari)() || Object(R.isFireFox)()) && d.uplinkStats && pe(t, "videoSendPacketsLost", d.uplinkStats.uplink_cumulative_lost)), e(t)
                    })), e.promises.push(new Promise(function (e) {
                        var t = {};
                        return d.traffic_stats && d.pc && d.pc.isSubscriber ? (pe(t, "accessDelay", d.traffic_stats.access_delay), pe(t, "endToEndDelay", d.traffic_stats.e2e_delay), pe(t, "videoReceiveDelay", d.traffic_stats.video_delay), pe(t, "audioReceiveDelay", d.traffic_stats.audio_delay)) : d.traffic_stats && d.pc && !d.pc.isSubscriber && pe(t, "accessDelay", d.traffic_stats.access_delay), e(t)
                    }))
                }), d.getId = function () {
                    return d.streamId
                }, d.getUserId = function () {
                    return d.userId
                }, d.setUserId = function (e) {
                    var t = w.b.reportApiInvoke(d.sid, {name: "Stream.setUserId", options: arguments, tag: "tracer"});
                    d.userId && I.default.warning("[".concat(d.streamId, "] Stream.userId ").concat(d.userId, " => ").concat(e)), d.userId = e, t()
                }, d.getAttributes = function () {
                    return a.screen ? d.screenAttributes : a.attributes
                }, d.hasAudio = function () {
                    return d.audio
                }, d.hasVideo = function () {
                    return d.video
                }, d.hasScreen = function () {
                    return d.screen
                }, d.isVideoOn = function () {
                    return (d.hasVideo() || d.hasScreen()) && !d.userMuteVideo
                }, d.isAudioOn = function () {
                    return d.hasAudio() && !d.userMuteAudio
                }, d.init = function (n, r) {
                    var i = w.b.reportApiInvoke(d.sid, {
                        callback: function (e, t) {
                            if (e) return r && r(e);
                            n && n(t)
                        }, name: "Stream.init", options: arguments, tag: "tracer"
                    }), o = ((new Date).getTime(), arguments[2]);
                    if (void 0 === o && (o = 2), !0 === d.initialized) return i({type: "warning", msg: "STREAM_ALREADY_INITIALIZED"});
                    if (!0 !== d.local) return i({type: "warning", msg: "STREAM_NOT_LOCAL"});
                    d.videoSource ? d.videoName = "videoSource" : d.video && (d.videoName = fe.searchDeviceNameById(a.cameraId) || "default"), d.audioSource ? d.audioName = "audioSource" : d.audio && (d.audioName = fe.searchDeviceNameById(a.microphoneId) || "default"), d.screen && (d.screenName = a.extensionId || "default");
                    try {
                        if (a.audio || a.video || a.screen || a.videoSource || a.audioSource) {
                            I.default.debug("[".concat(d.streamId, "] Requested access to local media"));
                            var t = {streamId: d.streamId};
                            a.videoSource ? t.videoSource = a.videoSource : a.screen ? t.screen = d.screenConstraint : a.video && (t.video = d.videoConstraint), a.audioSource ? t.audioSource = a.audioSource : a.audio && (t.audio = d.audioConstraint), ue(t, function (e) {
                                t.screen && I.default.debug("[".concat(d.streamId, "] User has granted access to screen sharing")), (t.video || t.audio) && I.default.debug("[".concat(d.streamId, "] User has granted access to local media")), d.dispatchEvent({type: "accessAllowed"}), d.stream = e, d.initialized = !0, d.reloadDeviceName(), d.hasVideo() && Object(le.h)(e, function (e, t) {
                                    d.videoWidth = e, d.videoHeight = t
                                }, function (e) {
                                    I.default.warning("[".concat(d.streamId, "] vsResHack failed: "), e)
                                }), a.screen && d.stream && d.stream.getVideoTracks()[0] && (d.stream.getVideoTracks()[0].onended = function () {
                                    d.dispatchEvent({type: "stopScreenSharing"})
                                }), d.stream && d.stream.getTracks && d.stream.getTracks().forEach(function (e) {
                                    e && !e.onended && (e.onended = l)
                                }), i()
                            }, function (e) {
                                var t = {type: "error", info: null};
                                switch (e && (t.msg = e.name || e.code || e, e.message && (t.info = e.message), e.code && (t.info ? t.info += ". " + e.code : t.info = " " + e.code), e.constraint && (t.info ? t.info += ". Constraint: " + e.constraint : t.info = "constraint: " + e.constraint)), t.msg) {
                                    case"Starting video failed":
                                    case"TrackStartError":
                                        if (d.videoConstraint && (delete d.videoConstraint.width, delete d.videoConstraint.height), 0 < o) return void setTimeout(function () {
                                            d.init(function (e) {
                                                return i(e)
                                            }, i, o - 1)
                                        }, 1);
                                        t.msg = "MEDIA_OPTION_INVALID";
                                        break;
                                    case"DevicesNotFoundError":
                                        t.msg = "DEVICES_NOT_FOUND";
                                        break;
                                    case"NotSupportedError":
                                        t.msg = "NOT_SUPPORTED";
                                        break;
                                    case"PermissionDeniedError":
                                    case"InvalidStateError":
                                        t.msg = "PERMISSION_DENIED", d.dispatchEvent({type: "accessDenied"});
                                        break;
                                    case"PERMISSION_DENIED":
                                    case"NotAllowedError":
                                        d.dispatchEvent({type: "accessDenied"});
                                        break;
                                    case"ConstraintNotSatisfiedError":
                                        t.msg = "CONSTRAINT_NOT_SATISFIED";
                                        break;
                                    default:
                                        t.msg || (t.msg = "UNDEFINED")
                                }
                                var n = "Media access ".concat(t.msg).concat(t.info ? ": " + t.info : "");
                                I.default.error("[".concat(d.streamId, "] "), n), i(t)
                            })
                        } else i({type: "warning", msg: "STREAM_HAS_NO_MEDIA_ATTRIBUTES"})
                    } catch (e) {
                        I.default.error("[".concat(d.streamId, "] Stream init: "), e), i({type: "error", msg: e.message || e})
                    }
                }, d.reloadDeviceName = function () {
                    if (d.stream) {
                        if (d.stream.getVideoTracks) {
                            var e = d.stream.getVideoTracks()[0];
                            e && e.label && (d.videoName = e.label)
                        }
                        if (d.stream.getAudioTracks) {
                            var t = d.stream.getAudioTracks()[0];
                            t && t.label && (d.audioName = t.label)
                        }
                    }
                }, d.close = function () {
                    var e = w.b.reportApiInvoke(null, {name: "Stream.close", options: arguments, tag: "tracer"});
                    if (I.default.debug("[".concat(d.streamId, "] Close stream with id"), d.streamId), void 0 !== d.stream) {
                        var t = d.stream.getTracks();
                        for (var n in t) t.hasOwnProperty(n) && t[n].stop();
                        d.stream = void 0
                    }
                    Object(R.isSafari)() && d.pc && d.pc.peerConnection && d.pc.peerConnection.removeTrack && d.pc.peerConnection.getSenders && d.pc.peerConnection.getSenders().forEach(function (e) {
                        e && (I.default.debug("[".concat(d.streamId, "] Remove Track"), e), d.pc.peerConnection.removeTrack(e))
                    }), d.initialized = !1, d._onAudioMute = void 0, d._onAudioUnmute = void 0, d._onVideoMute = void 0, d._onVideoUnmute = void 0, d.lowStream && d.lowStream.close(), e()
                }, d.enableAudio = function () {
                    var e, t = w.b.reportApiInvoke(d.sid, {name: "Stream.enableAudio", options: arguments, tag: "tracer"});
                    return I.default.deprecate("[".concat(d.streamId, "] Stream.enableAudio is deprecated and will be removed in the future. Use Stream.unmuteAudio instead")), d.userMuteAudio || I.default.warning("[".concat(d.streamId, "] User already enableAudio")), d.userMuteAudio = !1, t(null, e = !d.peerMuteAudio && d._unmuteAudio()), e
                }, d.disableAudio = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.disableAudio", options: arguments, tag: "tracer"});
                    I.default.deprecate("[".concat(d.streamId, "] Stream.disableAudio is deprecated and will be removed in the future. Use Stream.muteAudio instead")), d.userMuteAudio && I.default.warning("[".concat(d.streamId, "] User already disableAudio")), d.userMuteAudio = !0;
                    var t = d._muteAudio();
                    return e(null, t), t
                }, d.enableVideo = function () {
                    var e, t = w.b.reportApiInvoke(d.sid, {name: "Stream.enableVideo", options: arguments, tag: "tracer"});
                    return I.default.deprecate("[".concat(d.streamId, "] Stream.enableVideo is deprecated and will be removed in the future. Use Stream.unmuteVideo instead")), d.userMuteVideo || I.default.warning("[".concat(d.streamId, "] User already enableVideo")), d.userMuteVideo = !1, d.lowStream && (d.lowStream.userMuteVideo = !1), t(null, e = !d.peerMuteVideo && d._unmuteVideo()), e
                }, d.disableVideo = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.disableVideo", options: arguments, tag: "tracer"});
                    I.default.deprecate("[".concat(d.streamId, "] Stream.disableVideo is deprecated and will be removed in the future. Use Stream.muteVideo instead")), d.userMuteVideo && I.default.warning("[".concat(d.streamId, "] User already disableVideo")), d.userMuteVideo = !0, d.lowStream && (d.lowStream.userMuteVideo = !0);
                    var t = d._muteVideo();
                    return e(null, t), t
                }, d.unmuteAudio = function () {
                    var e, t = w.b.reportApiInvoke(d.sid, {name: "Stream.unmuteAudio", options: arguments, tag: "tracer"});
                    return d.userMuteAudio || I.default.warning("[".concat(d.streamId, "] User already unmuteAudio")), d.userMuteAudio = !1, t(null, e = !d.peerMuteAudio && d._unmuteAudio()), e
                }, d.muteAudio = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.muteAudio", options: arguments, tag: "tracer"});
                    d.userMuteAudio && I.default.warning("[".concat(d.streamId, "] User already muteAudio")), d.userMuteAudio = !0;
                    var t = d._muteAudio();
                    return e(null, t), t
                }, d.unmuteVideo = function () {
                    var e, t = w.b.reportApiInvoke(d.sid, {name: "Stream.unmuteVideo", options: arguments, tag: "tracer"});
                    return d.userMuteVideo || I.default.warning("[".concat(d.streamId, "] User already unmuteVideo")), d.userMuteVideo = !1, d.lowStream && (d.lowStream.userMuteVideo = !1), t(null, e = !d.peerMuteVideo && d._unmuteVideo()), e
                }, d.muteVideo = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.muteVideo", options: arguments, tag: "tracer"});
                    d.userMuteVideo && I.default.warning("[".concat(d.streamId, "] User already muteVideo")), d.userMuteVideo = !0, d.lowStream && (d.lowStream.userMuteVideo = !0);
                    var t = d._muteVideo();
                    return e(null, t), t
                }, d._unmuteAudio = function () {
                    return I.default.debug("[".concat(d.streamId, "] Unmuted audio stream with id "), d.streamId), d._flushAudioMixingMuteStatus(!1), !(!d.hasAudio() || !d.initialized || void 0 === d.stream || !0 === d.stream.getAudioTracks()[0].enabled || (d._onAudioUnmute && d._onAudioUnmute(), d.pc && (d.pc.isAudioMute = !1), d.stream.getAudioTracks()[0].enabled = !0, 0))
                }, d._isAudioMuted = function () {
                    if (d.stream && d.hasAudio()) {
                        var e = d.stream.getAudioTracks();
                        return 0 < e.length && !e[0].enabled
                    }
                    return !1
                }, d._muteAudio = function () {
                    return I.default.debug("[".concat(d.streamId, "] Muted audio stream with id "), d.streamId), d._flushAudioMixingMuteStatus(!0), !!(d.hasAudio() && d.initialized && void 0 !== d.stream && d.stream.getAudioTracks()[0].enabled) && (d._onAudioMute && d._onAudioMute(), d.pc && (d.pc.isAudioMute = !0), d.stream.getAudioTracks()[0].enabled = !1, d.sid && w.b.audioSendingStopped(d.sid, {
                        succ: !0,
                        reason: "muteAudio"
                    }), !0)
                }, d._unmuteVideo = function () {
                    return I.default.debug("[".concat(d.streamId, "] Unmuted video stream with id"), d.streamId), !(!d.initialized || void 0 === d.stream || !d.stream.getVideoTracks().length || !0 === d.stream.getVideoTracks()[0].enabled || (d._onVideoUnmute && d._onVideoUnmute(), d.pc && (d.pc.isVideoMute = !1), d.stream.getVideoTracks()[0].enabled = !0, d.lowStream && d.lowStream._unmuteVideo(), 0))
                }, d._muteVideo = function () {
                    return I.default.debug("[".concat(d.streamId, "] Muted video stream with id"), d.streamId), !!(d.initialized && void 0 !== d.stream && d.stream.getVideoTracks().length && d.stream.getVideoTracks()[0].enabled) && (d._onVideoMute && d._onVideoMute(), d.pc && (d.pc.isVideoMute = !0), d.stream.getVideoTracks()[0].enabled = !1, d.lowStream && d.lowStream._muteVideo(), d.sid && w.b.videoSendingStopped(d.sid, {
                        succ: !0,
                        reason: "muteVideo"
                    }), !0)
                }, d.addTrack = function (e) {
                    var t = w.b.reportApiInvoke(d.sid, {name: "Stream.addTrack", options: arguments, tag: "tracer"});
                    if (d.pc && d.pc.addTrack(e, d.stream), "audio" == e.kind) {
                        d._cleanupAudioMixing();
                        var n = new MediaStream;
                        d.userMuteAudio && (e.enabled = !1), n.addTrack(e);
                        var r = d.stream.getVideoTracks()[0];
                        r && (n.addTrack(r), d.audio = !0, a.audio = !0), d.stream = n, d.audioLevelHelper = null, d.player && d.player.video && (d.player.video.srcObject = d.stream)
                    } else d.userMuteVideo && (e.enabled = !1), d.stream.addTrack(e), d.video = !0, a.video = !0;
                    e.onended || (e.onended = l), t()
                }, d.removeTrack = function (e) {
                    var t = w.b.reportApiInvoke(d.sid, {name: "Stream.removeTrack", options: arguments, tag: "tracer"});
                    d.pc && d.pc.removeTrack(e, d.stream), d.stream.removeTrack(e), d._cleanupAudioMixing(), "audio" === e.kind ? (d.audio = !1, a.audio = !1) : (d.video = !1, a.video = !1), d.audioLevelHelper = null, "live" == e.readyState && (e.stop(), I.default.debug("[".concat(d.streamId, "] Track ").concat(e.kind, " Stopped"))), t()
                }, d.setAudioOutput = function (e, n, r) {
                    var t = w.b.reportApiInvoke(d.sid, {
                        callback: function (e, t) {
                            if (e) return r && r(e);
                            n && n(t)
                        }, name: "Stream.setAudioOutput", options: arguments, tag: "tracer"
                    });
                    return _e(e, 1, 255) ? (d.audioOutput = e, d.player ? void d.player.setAudioOutput(e, function () {
                        return t()
                    }, t) : t()) : (I.default.error("[".concat(d.streamId, "] setAudioOutput Invalid Parameter"), e), t(N))
                }, d.play = function (e, t, n) {
                    "function" == typeof t && (n = t, t = null), I.default.debug("[".concat(d.streamId, "] play()."), e, t);
                    var r = w.b.reportApiInvoke(d.sid, {name: "Stream.play", options: arguments, tag: "tracer", callback: n});
                    if (ye(e, "elementID"), ke(t) || (ke(t.fit) || ve(t.fit, "fit", ["cover", "contain"]), ke(t.muted) || be(t.muted, "muted")), d.player) I.default.warning("[".concat(d.streamId, "] Stream.play(): Stream is already playing. Fallback to resume stream")), d.resume().then(function () {
                        r(null)
                    }).catch(r); else {
                        d.elementID = e, d.playOptions = t, !d.local || d.video || d.screen ? d.player = new Z({
                            id: d.getId(),
                            stream: d,
                            elementID: e,
                            options: t
                        }) : d.hasAudio() && (d.player = new Z({id: d.getId(), stream: d, elementID: e, options: t}));
                        var i = {audio: null, video: null};
                        d.on("player-status-change", function e(t) {
                            if (i[t.mediaType] = t, i.audio && i.video) if (d.removeEventListener("player-status-change", e), i.video.isErrorState || i.audio.isErrorState) {
                                var n = i.video.isErrorState ? i.video : i.audio;
                                r({isErrorState: !0, status: n.status, reason: n.reason, video: i.video, audio: i.audio})
                            } else "aborted" === i.video.status && "aborted" === i.audio.status ? r({
                                status: "aborted",
                                reason: "stop",
                                video: i.video,
                                audio: i.audio
                            }) : r(null)
                        }), d.audioOutput && d.player.setAudioOutput(d.audioOutput), void 0 !== d.audioLevel && d.player.setAudioVolume(d.audioLevel), d._flushAudioMixingMuteStatus(!1)
                    }
                },d.stop = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.stop", options: arguments, tag: "tracer"});
                    I.default.debug("[".concat(d.streamId, "] Stop stream player with id "), d.streamId), d.player ? (d.player.destroy(), delete d.player) : I.default.error("[".concat(d.streamId, "] Stream.stop(): Stream is not playing")), d._flushAudioMixingMuteStatus(!0), e()
                },d.isPlaying = function () {
                    return !!d.player
                },d.isPaused = function () {
                    return !!(d.player && (d.player.video && d.player.video.paused && d.player.mediaElemExists(d.player.video) || d.player.audio && d.player.audio.paused && d.player.mediaElemExists(d.player.audio)))
                },d.resume = function () {
                    var e, t;
                    return d.player ? (d.player.video && d.player.video.play && (e = d.player.video.play()), e = e || Promise.resolve(), d.player.audio && d.player.audio.play && (t = d.player.audio.play()), t = t || Promise.resolve(), Promise.all([e, t])) : Promise.reject("NO_PLAYER_FOUND")
                },d.getVideoTrack = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.getVideoTrack", options: arguments, tag: "tracer"});
                    if (d.stream && d.stream.getVideoTracks) {
                        var t = d.stream.getVideoTracks()[0];
                        if (t) return I.default.info("[".concat(d.streamId, "] getVideoTrack"), t), e(), t
                    }
                    I.default.info("[".concat(d.streamId, "] getVideoTrack None")), e(null, "getVideoTrack None")
                },d.getAudioTrack = function () {
                    var e = w.b.reportApiInvoke(d.sid, {name: "Stream.getAudioTrack", options: arguments, tag: "tracer"});
                    if (d.stream && d.stream.getAudioTracks) {
                        var t = d.stream.getAudioTracks()[0];
                        if (t) return I.default.info("[".concat(d.streamId, "] getAudioTracks"), t), e(), t
                    }
                    I.default.info("[".concat(d.streamId, "] getAudioTracks None")), e(null, "getAudioTracks None")
                },d._replaceMediaStreamTrack = function (e, t, n) {
                    if (d.stream) {
                        if ("video" == e.kind) {
                            if (i = d.stream.getVideoTracks()[0]) return d.userMuteVideo && (e.enabled = !1), d.stream.removeTrack(i), d.stream.addTrack(e), I.default.debug("[".concat(d.streamId, "] _replaceMediaStreamTrack ").concat(e.kind, " SUCCESS")), "live" == i.readyState && (i.stop(), I.default.debug("[".concat(d.streamId, "] Track ").concat(i.kind, " Stopped"))), t && t();
                            var r = "MEDIASTREAM_TRACK_NOT_FOUND";
                            return I.default.error("[".concat(d.streamId, "] MEDIASTREAM_TRACK_NOT_FOUND ").concat(e.kind)), n(r)
                        }
                        if ("audio" != e.kind) return r = "INVALID_TRACK_TYPE", I.default.error("[".concat(d.streamId, "] _replaceMediaStreamTrack ").concat(r, " ").concat(e.kind)), n && n(r);
                        var i;
                        if (i = d.stream.getAudioTracks()[0]) {
                            d.userMuteAudio && (e.enabled = !1);
                            var o = new MediaStream;
                            o.addTrack(e);
                            var a = d.stream && d.stream.getVideoTracks()[0];
                            return a && o.addTrack(a), d.stream = o, d.audioLevelHelper = null, d.player && d.player.video && (d.player.video.srcObject = d.stream), I.default.debug("[".concat(d.streamId, "] _replaceMediaStreamTrack SUCCESS")), "live" == i.readyState && (i.stop(), I.default.debug("[".concat(d.streamId, "] Track ").concat(i.kind, " Stopped"))), t && t()
                        }
                        return r = "MEDIASTREAM_TRACK_NOT_FOUND", I.default.error("[".concat(d.streamId, "] MEDIASTREAM_TRACK_NOT_FOUND ").concat(e.kind)), n(r)
                    }
                    return r = "NO_STREAM_FOUND", I.default.error("[".concat(d.streamId, "] _replaceMediaStreamTrack ").concat(r)), n && n(r)
                },d.replaceTrack = function (t, n, r) {
                    var i = w.b.reportApiInvoke(d.sid, {
                        callback: function (e, t) {
                            if (e) return r && r(e);
                            n && n(t)
                        }, name: "Stream.replaceTrack", options: arguments, tag: "tracer"
                    });
                    return t && t.kind ? (d._cleanupAudioMixing(), t.onended || (t.onended = l), d.pc && d.pc.hasSender && d.pc.hasSender(t.kind) ? void d.pc.replaceTrack(t, function () {
                        return I.default.debug("[".concat(d.streamId, "] PeerConnection.replaceTrack ").concat(t.kind, " SUCCESS")), d._replaceMediaStreamTrack(t, function (e) {
                            return i(null, e)
                        }, i)
                    }, function (e) {
                        return I.default.error("[".concat(d.streamId, "] PeerConnection.replaceTrack ").concat(t.kind, " Failed ").concat(e)), i(e)
                    }) : d._replaceMediaStreamTrack(t, function (e) {
                        return i(null, e)
                    }, i)) : i("INVALID_TRACK")
                },d.setAudioVolume = function (e) {
                    var t = w.b.reportApiInvoke(d.sid, {name: "Stream.setAudioVolume", options: arguments, tag: "tracer"});
                    Se(e, "level", 0, 100), d.audioLevel = e, d.player && d.player.setAudioVolume(e), t()
                },d.getStats = function (i, t, e) {
                    var n = {type: "collectStats", promises: [], interval: e};
                    d.dispatchEvent(n), Promise.all(n.promises).then(function (e) {
                        for (var t = {}, n = e.length - 1; 0 <= n; n--) {
                            var r = e[n];
                            A()(t, r)
                        }
                        i && setTimeout(i.bind(d, t), 0)
                    }).catch(function (e) {
                        t && setTimeout(t.bind(d, e), 0)
                    })
                },d._getPCStats = function (e) {
                    return new Promise(function (i, o) {
                        if (!d.pc || "established" !== d.pc.state || !d.pc.getStats) return o("PEER_CONNECTION_NOT_ESTABLISHED");
                        d.pc.getStats(function (e) {
                            if (!d.pc || "established" !== d.pc.state || !d.pc.getStats) return o("PEER_CONNECTION_STATE_CHANGE");
                            var t, n, r = d.pc.isSubscriber ? (n = {}, e.forEach(function (e) {
                                e.id && (-1 === e.id.indexOf("recv") && -1 === e.id.indexOf("inbound_rtp") && -1 === e.id.indexOf("inbound-rtp") && -1 === e.id.indexOf("InboundRTP") || ("audio" === e.mediaType ? (pe(n, "audioReceiveBytes", e.bytesReceived), pe(n, "audioReceivePackets", e.packetsReceived), pe(n, "audioReceivePacketsLost", e.packetsLost)) : (pe(n, "videoReceiveBytes", e.bytesReceived), pe(n, "videoReceivePacketsLost", e.packetsLost), pe(n, "videoReceivePackets", e.packetsReceived), pe(n, "videoReceiveFrameRate", e.googFrameRateReceived), pe(n, "videoReceiveDecodeFrameRate", e.googFrameRateDecoded), pe(n, "videoReceiveResolutionWidth", e.googFrameWidthReceived), pe(n, "videoReceiveResolutionHeight", e.googFrameHeightReceived))))
                            }), n) : (t = {}, e.forEach(function (e) {
                                e.id && (-1 === e.id.indexOf("send") && -1 === e.id.indexOf("outbound_rtp") && -1 === e.id.indexOf("OutboundRTP") || ("audio" === e.mediaType ? (pe(t, "audioSendBytes", e.bytesSent), pe(t, "audioSendPackets", e.packetsSent), pe(t, "audioSendPacketsLost", e.packetsLost)) : (pe(t, "videoSendBytes", e.bytesSent), pe(t, "videoSendPackets", e.packetsSent), pe(t, "videoSendPacketsLost", e.packetsLost), pe(t, "videoSendFrameRate", e.googFrameRateSent), pe(t, "videoSendResolutionWidth", e.googFrameWidthSent), pe(t, "videoSendResolutionHeight", e.googFrameHeightSent))))
                            }), t);
                            return i(r)
                        }, e)
                    }).then(function (e) {
                        return d.pc.isSubscriber ? (Object(R.isFireFox)() || Object(R.isSafari)()) && (e.videoReceiveResolutionHeight && "0" !== e.videoReceiveResolutionHeight || e.videoReceiveResolutionWidth && "0" !== e.videoReceiveResolutionWidth || (pe(e, "videoReceiveResolutionHeight", d.videoHeight), pe(e, "videoReceiveResolutionWidth", d.videoWidth))) : ((Object(R.isSafari)() || Object(R.isFireFox)()) && (e.videoSendResolutionHeight && "0" !== e.videoSendResolutionHeight || e.videoSendResolutionWidth && "0" !== e.videoSendResolutionWidth || (pe(e, "videoSendResolutionHeight", d.videoHeight), pe(e, "videoSendResolutionWidth", d.videoWidth))), (Object(R.isSafari)() || Object(R.isFireFox)()) && d.uplinkStats && pe(e, "videoSendPacketsLost", d.uplinkStats.uplink_cumulative_lost)), Promise.resolve(e)
                    })
                },d.getAudioLevel = function () {
                    if (d.audioLevelHelper) return d.audioLevelHelper.getAudioLevel();
                    if (d.stream) {
                        if (0 !== d.stream.getAudioTracks().length) return d.audioLevelHelper = new le.a(d.stream), d.audioLevelHelper.getAudioLevel();
                        I.default.warning("[".concat(d.streamId, "] can't get audioLevel beacuse no audio trace in stream"))
                    } else I.default.warning("[".concat(d.streamId, "] can't get audioLevel beacuse no stream exist"))
                },d.setVideoProfile("480P"),d._switchVideoDevice = function (n, r, i) {
                    if (n === d.cameraId) return r && r();
                    var e = {video: A()({}, d.videoConstraint, {deviceId: {exact: n}}), audio: !1};
                    I.default.debug("[".concat(d.streamId, "] ").concat(e)), ue(e, function (e) {
                        try {
                            var t = function () {
                                d.isPlaying() && (d.stop(), d.elementID && d.play(d.elementID, d.playOptions)), d.cameraId = n, d.videoConstraint.deviceId = {exact: n}, d.userMuteVideo && (d.stream.getVideoTracks()[0].enabled = !1), r && r()
                            };
                            Object(R.isSafari)() ? d.replaceTrack(e.getVideoTracks()[0], t, i) : (d.removeTrack(d.stream.getVideoTracks()[0]), d.addTrack(e.getVideoTracks()[0]), t())
                        } catch (e) {
                            return i && i(e)
                        }
                    }, function (e) {
                        return i && i(e)
                    })
                },d._switchAudioDevice = function (n, r, i) {
                    if (n === d.microphoneId) return r && r();
                    var e = {video: !1, audio: A()({}, d.audioConstraint, {deviceId: {exact: n}})};
                    I.default.debug("[".concat(d.streamId, "] "), e), ue(e, function (e) {
                        var t = function () {
                            d._cleanupAudioMixing(), d.userMuteAudio && (d.stream.getAudioTracks()[0].enabled = !1), d.isPlaying() && (d.stop(), d.elementID && d.play(d.elementID)), d.microphoneId = n, d.audioConstraint.deviceId = {exact: n}, r && r()
                        };
                        try {
                            Object(R.isSafari)() ? d.replaceTrack(e.getAudioTracks()[0], t, i) : (d.removeTrack(d.stream.getAudioTracks()[0]), d.addTrack(e.getAudioTracks()[0]), t())
                        } catch (e) {
                            return i && i(e)
                        }
                    }, function (e) {
                        return i && i(e)
                    })
                },d.switchDevice = function (e, t, n, r) {
                    var i = w.b.reportApiInvoke(d.sid, {
                        callback: function (e, t) {
                            if (e) return r && r(e);
                            n && n(t)
                        }, name: "Stream.switchDevice", options: arguments, tag: "tracer"
                    });
                    ye(t, "deviceId");
                    var o = function () {
                        return d.inSwitchDevice = !1, i()
                    }, a = function (e) {
                        d.inSwitchDevice = !1, I.default.error("[".concat(d.streamId, "] "), e), i(e)
                    };
                    if (d.inSwitchDevice) return i("Device switch is in process.");
                    if (d.inSwitchDevice = !0, !d.local) return a("Only the local stream can switch the device.");
                    if (d.screen && "video" === e) return a("The device cannot be switched during screen-sharing.");
                    if (d.videoSource || d.audioSource) return a("The device cannot be switched when using videoSource or audioSource.");
                    if (d.lowStream) return a("The device cannot be switched when using lowstream.");
                    var s = !1;
                    for (var c in d.audioMixing.sounds) if (d.audioMixing.sounds[c].state !== d.audioMixing.states.IDLE) {
                        s = !0;
                        break
                    }
                    if (d.audioMixing.audioContextInited && s) return a("The device cannot be switched when using audio Mixing.");
                    fe.getDeviceById(t, function () {
                        if ("video" === e) d._switchVideoDevice(t, o, a); else {
                            if ("audio" !== e) return a("Invalid type.");
                            d._switchAudioDevice(t, o, a)
                        }
                    }, function () {
                        return a("The device does not exist.")
                    })
                },d
            }, De = n(13), Ne = ["live", "rtc", "web", "interop", "h264_interop", "web-only"], Me = ["vp8", "h264"],
            xe = ["aes-128-xts", "aes-256-xts", "aes-128-ecb"], Le = function (e) {
                e && e.apply(this, [].slice.call(arguments, 1))
            }, je = n(5), Ue = function (e, t) {
                var n = {
                    connect: function () {
                        t.host = e, n.signal = function (t) {
                            var r = T();
                            return r.needReconnect = !0, r.isTimeout = !1, r.isInit = !0, r.sendbytes = 0, r.recvbytes = 0, r.startTime = Date.now(), r.lastMsgTime = null, r.clientId = t.clientId, r.hostIndex = 0, r.requestID = 0, t.host instanceof Array ? r.host = t.host : r.host = [t.host], r.getSendBytes = function () {
                                return r.sendbytes
                            }, r.getRecvBytes = function () {
                                return r.recvbytes
                            }, r.getDuration = function () {
                                return Math.ceil((Date.now() - r.startTime) / 1e3)
                            }, r.getURL = function () {
                                return r.connection.url
                            }, r.reconnect = function () {
                                r.isInit = !0, r.creatConnection()
                            }, r.connectNext = function () {
                                r.isInit = !0, ++r.hostIndex, I.default.debug("[" + r.clientId + "] Gateway length:" + r.host.length + " current index:" + r.hostIndex), r.hostIndex >= r.host.length ? r.dispatchEvent(O({type: "recover"})) : r.creatConnection()
                            }, r.replaceHost = function (e) {
                                r.host = e || r.host, r.hostIndex = 0, r.creatConnection()
                            }, r.creatConnection = function () {
                                r.needReconnect = !0, I.default.debug("[" + r.clientId + "] start connect:" + r.host[r.hostIndex]), r.lts = (new Date).getTime(), r.connection = new WebSocket("wss://" + r.host[r.hostIndex]), r.connection.onopen = function (e) {
                                    I.default.debug("[" + r.clientId + "] websockect opened: " + r.host[r.hostIndex]), r.needReconnect = !0, r.isTimeout = !1, r.isInit = !1, r.sendbytes = 0, r.recvbytes = 0, r.startTime = Date.now(), Object(je.d)(), clearTimeout(r.timeoutCheck), r.dispatchEvent(O({
                                        type: "onopen",
                                        event: e,
                                        socket: r
                                    }))
                                }, r.connection.onmessage = function (e) {
                                    r.recvbytes += Object(le.e)(e.data);
                                    var t = JSON.parse(e.data);
                                    r.lastMsgTime = Date.now(), t.hasOwnProperty("_id") ? r.dispatchEvent(O({
                                        type: t._id,
                                        msg: t
                                    })) : t.hasOwnProperty("_type") && r.dispatchSocketEvent(O({type: t._type, msg: t.message}))
                                }, r.connection.onclose = function (e) {
                                    r.needReconnect ? r.isTimeout || r.isInit ? (I.default.debug("[" + r.clientId + "] websockect connect timeout"), w.b.joinGateway(t.sid, {
                                        lts: r.lts,
                                        succ: !1,
                                        ec: "timeout",
                                        addr: r.connection.url
                                    }), r.connectNext()) : r.dispatchEvent(O({
                                        type: "disconnect",
                                        event: e
                                    })) : (I.default.debug("[" + r.clientId + "] websockect closeed"), Le(t.onFailure, e), clearTimeout(r.timeoutCheck), r.dispatchEvent(O({
                                        type: "close",
                                        event: e
                                    })), r.connection.onopen = void 0, r.connection.onclose = void 0, r.connection.onerror = void 0, r.connection.onmessage = void 0, r.connection = void 0)
                                }, r.connection.onerror = function (e) {
                                }, setTimeout(function () {
                                    r.connection && r.connection.readyState != WebSocket.OPEN && (r.isTimeout = !0, r.connection.close())
                                }, 5e3)
                            }, r.creatConnection(), r.sendMessage = function (e, t) {
                                if (r.connection && r.connection.readyState == WebSocket.OPEN) {
                                    var n = JSON.stringify(e);
                                    r.sendbytes += Object(le.e)(n), r.connection.send(n)
                                } else t({error: "Gateway not connected"})
                            }, r.disconnect = function () {
                                r.needReconnect = !0, r.connection.close()
                            }, r.close = function () {
                                r.needReconnect = !1, r.connection.onclose = void 0, r.connection.close()
                            }, r.sendSignalCommand = function (t, n) {
                                t._id = "_request_" + r.requestID, r.requestID += 1, "publish_stats" !== t._type && "subscribe_stats" !== t._type && "publish_stats_low" !== t._type && r.on(t._id, function (e) {
                                    e.msg && n && n(e.msg._result, e.msg.message), delete r.dispatcher.eventListeners[t._id]
                                }), r.sendMessage(t, function (e) {
                                    e.reason = "NOT_CONNECTED", n && n(e.reason, e)
                                })
                            }, r
                        }(t), n.on = n.signal.on, n.dispatchEvent = n.signal.dispatchEvent, n.signal.on("onopen", function (e) {
                            n.signal.onEvent = function (e) {
                                n.dispatchEvent(O({type: e.event, msg: e}))
                            }, n.dispatchEvent(O({type: "connect", msg: e}))
                        }), n.signal.on("onError", function (e) {
                            var t = e.msg;
                            onError(t.code, "error")
                        })
                    }, getLastMsgTime: function () {
                        return n.signal && n.signal.lastMsgTime
                    }, getSendBytes: function () {
                        return n.signal.getSendBytes()
                    }, getRecvBytes: function () {
                        return n.signal.getRecvBytes()
                    }, getDuration: function () {
                        return n.signal.getDuration()
                    }, disconnect: function () {
                        n.signal.disconnect()
                    }, close: function () {
                        n.signal.close()
                    }, getURL: function () {
                        return n.signal.getURL()
                    }, reconnect: function () {
                        n.signal.reconnect()
                    }, connectNext: function () {
                        n.signal.connectNext()
                    }, replaceHost: function (e) {
                        n.signal.replaceHost(e)
                    }, emitSimpleMessage: function (e, t) {
                        n.signal.sendSignalCommand(e, t)
                    }
                };
                return n.connect(), n
            }, Be = function (e, t, n) {
                var r = {service_name: "webrtc_proxy", json_body: JSON.stringify(t)};
                Object(je.c)(e, r, function (e) {
                    n && n(null, e)
                }, function (e) {
                    n && n(e)
                }, {"X-Packet-Service-Type": 0, "X-Packet-URI": 61})
            }, Ve = function (e) {
                if (!e || [] instanceof Array == 0) return [];
                var n = [];
                return e.forEach(function (e) {
                    var t;
                    e.address && e.tcp ? (t = e.address.match(/^[\.\:\d]+$/) ? "".concat(e.address.replace(/[^\d]/g, "-"), ".edge.agora.io") : (I.default.info("[" + joinInfo.clientId + "] " + "Cannot recognized as IP address ".concat(e.address, ". Used As Host instead")), "".concat(e.address, ":").concat(e.tcp)), n.push(t)) : I.default.error("[" + joinInfo.clientId + "] Invalid address format ", e)
                }), n
            }, Fe = {}, We = function (d, u, l, p) {
                var f = (new Date).getTime(), e = "";
                u.multiIP && u.multiIP.gateway_ip && (e = {vocs_ip: [u.multiIP.uni_lbs_ip], vos_ip: [u.multiIP.gateway_ip]});
                var t = {flag: 4, ts: +new Date, key: u.appId, cname: u.cname, sid: u.sid, detail: {}, uid: u.uid || 0};
                e && (t.detail[5] = JSON.stringify(e)), Object(je.c)(d, t, function (t) {
                    try {
                        var e = JSON.parse(t).res, n = e.code
                    } catch (e) {
                        var r = "requestChooseServer failed with unexpected body " + t;
                        return I.default.error("[" + joinInfo.clientId + "]", r), p(r)
                    }
                    if (n) {
                        var i = m[e.code] || n;
                        return w.b.joinChooseServer(u.sid, {
                            lts: f,
                            succ: !1,
                            csAddr: d,
                            serverList: null,
                            ec: i
                        }), p("Get server node failed [" + i + "]", d, i)
                    }
                    var o = [], a = [".agora.io", ".agoraio.cn"], s = 0;
                    if (-1 < d.indexOf(a[1]) && (s = 1), e.addresses.forEach(function (e) {
                        var t;
                        e.ip && e.port ? (t = e.ip.match(/^[\.\:\d]+$/) ? "webrtc-".concat(e.ip.replace(/[^\d]/g, "-")).concat(a[s++ % a.length], ":").concat(e.port) : (I.default.info("[" + joinInfo.clientId + "] " + "Cannot recognized as IP address ".concat(e.ip, ". Used As Host instead")), "".concat(e.ip, ":").concat(e.port)), o.push(t)) : I.default.error("[" + joinInfo.clientId + "] Invalid address format ", e)
                    }), !o.length) return I.default.error("[" + joinInfo.clientId + "] Empty Address response", e), i = "EMPTY_ADDRESS_RESPONSE", w.b.joinChooseServer(u.sid, {
                        lts: f,
                        succ: !1,
                        csAddr: d,
                        serverList: null,
                        ec: i
                    }), p("Get server node failed [" + i + "]", d, i);
                    var c = {gateway_addr: o, uid: e.uid, cid: e.cid, uni_lbs_ip: e.detail};
                    return l(c, d)
                }, function (e, t) {
                    "timeout" === e.type ? (w.b.joinChooseServer(u.sid, {
                        lts: f,
                        succ: !1,
                        csAddr: t,
                        serverList: null,
                        ec: "timeout"
                    }), p("Connect choose server timeout", t)) : w.b.joinChooseServer(u.sid, {
                        lts: f,
                        succ: !1,
                        csAddr: t,
                        serverList: null,
                        ec: "server_wrong"
                    })
                }, {"X-Packet-Service-Type": 0, "X-Packet-URI": 44})
            }, He = function (o, a, e) {
                var g = !1, y = null, r = 1, s = 1, S = null, c = o.clientId;
                Fe[c] = !0;
                var d = function t(n, f) {
                    if (!g) {
                        var m = !1, h = !1, v = [], e = R.getBrowserInfo() || {};
                        (function (e, i) {
                            var o = A()({}, e), a = Object(_.getParameter)("WEBCS_DOMAIN").concat(Object(_.getParameter)("WEBCS_DOMAIN_BACKUP_LIST")),
                                s = [], c = !1;
                            (a = a.map(function (e) {
                                return o.proxyServer ? "https://".concat(o.proxyServer, "/ap/?url=").concat(e + "/api/v1") : "https://".concat(e, "/api/v1")
                            })).map(function (e) {
                                var t, n, r;
                                t = e, n = function (e, t) {
                                    c || (e ? (s.push(e), s.length >= a.length && i && i("ALL_REQUEST_FAILED")) : (c = !0, i && i(null, t)))
                                }, r = {flag: 64, cipher_method: 0, timeout: 1e3, features: o}, Object(je.c)(t, r, function (e) {
                                    try {
                                        var t = JSON.parse(e);
                                        n(null, t)
                                    } catch (e) {
                                        n(e)
                                    }
                                    n(null, e)
                                }, function (e) {
                                    n(e)
                                }, {"X-Packet-Service-Type": 0, "X-Packet-URI": 54})
                            })
                        })({
                            device: e.name,
                            system: e.os,
                            vendor: o.appId,
                            version: _.VERSION,
                            cname: o.cname,
                            sid: o.sid,
                            session_id: Object(w.a)(),
                            detail: "",
                            proxyServer: n
                        }, function (e, t) {
                            h = !0;
                            try {
                                var n = Object.keys(t.test_tags)[0], r = JSON.parse(t.test_tags[n]);
                                S = r[1]
                            } catch (e) {
                                S = null
                            }
                            w.b.reportApiInvoke(o.sid, {name: "_config-distribute-request", options: {err: e, res: t}})(), m && f && f(v, S)
                        }), function (o, e, r) {
                            for (var a = (new Date).getTime(), s = !1, i = !0, c = function (e, t) {
                                if (s) w.b.joinChooseServer(o.sid, {
                                    lts: a,
                                    succ: !0,
                                    csAddr: t,
                                    serverList: e.gateway_addr,
                                    cid: e.cid + "",
                                    uid: e.uid + "",
                                    ec: null
                                }, !1); else {
                                    if (clearTimeout(p), s = !0, I.default.debug("[" + o.clientId + "] Get gateway address:", e.gateway_addr), o.proxyServer) {
                                        for (var n = e.gateway_addr, r = 0; r < n.length; r++) {
                                            var i = n[r].split(":");
                                            e.gateway_addr[r] = o.proxyServer + "/ws/?h=" + i[0] + "&p=" + i[1]
                                        }
                                        I.default.debug("[" + o.clientId + "] Get gateway address:", e.gateway_addr)
                                    }
                                    (function (e) {
                                        m = g = !0, v = e, clearTimeout(y), h && f && f(v, S)
                                    })(e), w.b.joinChooseServer(o.sid, {
                                        lts: a,
                                        succ: !0,
                                        csAddr: t,
                                        serverList: e.gateway_addr,
                                        cid: e.cid + "",
                                        uid: e.uid + "",
                                        ec: null
                                    }, !0)
                                }
                            }, d = function (e, t, n) {
                                i && (I.default.error("[" + o.clientId + "]", e, t, n), n && -1 === b.indexOf(n) && (i = !1, r(n)))
                            }, t = Object(_.getParameter)("WEBCS_DOMAIN"), n = 0; n < t.length; ++n) {
                                var u;
                                if ("string" == typeof t[n]) {
                                    var l = t[n];
                                    u = o.proxyServer ? "https://".concat(o.proxyServer, "/ap/?url=").concat(l + "/api/v1") : "https://".concat(l, "/api/v1"), I.default.debug("[" + o.clientId + "] " + "Connect to choose_server: ".concat(u)), We(u, o, c, d)
                                } else I.default.error("[" + o.clientId + "] Invalid Host", t[n])
                            }
                            var p = setTimeout(function () {
                                if (!s) for (var e = Object(_.getParameter)("WEBCS_DOMAIN_BACKUP_LIST"), t = 0; t < e.length; ++t) if ("string" == typeof e[t]) {
                                    var n = e[t];
                                    u = o.proxyServer ? "https://".concat(o.proxyServer, "/ap/?url=").concat(n + "/api/v1") : "https://".concat(n, "/api/v1"), I.default.debug("[" + o.clientId + "] " + "Connect to backup_choose_server: ".concat(u)), We(u, o, c, d)
                                } else I.default.error("[" + o.clientId + "] Invalid Host", e[t])
                            }, 1e3);
                            setTimeout(function () {
                                !s && i && r()
                            }, Object(_.getParameter)("WEBCS_BACKUP_CONNECT_TIMEOUT"))
                        }(o, 0, function (e) {
                            e ? I.default.info("[" + o.clientId + "] Join failed: " + e) : Fe[c] && (I.default.debug("[" + o.clientId + "] Request gateway list will be restart in " + r + "s"), y = setTimeout(function () {
                                t(n, f)
                            }, 1e3 * r), r = 3600 <= r ? 3600 : 2 * r)
                        })
                    }
                };
                o.useProxyServer ? function r() {
                    var n, i;
                    i = function (e, t) {
                        if (e) {
                            if (I.default.debug("[" + o.clientId + "]", e), !Fe[c]) return;
                            return I.default.debug("[" + o.clientId + "] Request proxy will be restart in " + s + "s"), y = setTimeout(function () {
                                r()
                            }, 1e3 * s), void (s = 3600 <= s ? 3600 : 2 * s)
                        }
                        clearTimeout(y);
                        var n = t.address;
                        o.proxyServer = n, o.turnServer = {
                            url: t.address,
                            tcpport: t.serverResponse.tcpport || "3433",
                            udpport: t.serverResponse.udpport || "3478",
                            username: t.serverResponse.username || "test",
                            credential: t.serverResponse.password || "111111",
                            forceturn: !0
                        }, o.turnServer.tcpport += "", o.turnServer.udpport += "", w.b.setProxyServer(n), I.default.setProxyServer(n), d(n, a)
                    }, function (a, s) {
                        var c = !1, d = 0, e = {
                            command: "convergeAllocateEdge",
                            sid: a.sid,
                            appId: a.appId,
                            token: a.token,
                            uid: a.uid,
                            cname: a.cname,
                            ts: Math.floor(Date.now() / 1e3),
                            version: _.VERSION,
                            seq: 0,
                            requestId: 1
                        };
                        Object(_.getParameter)("PROXY_CS").map(function (i) {
                            var o = (new Date).getTime();
                            Be("https://" + i + "/api/v1", e, function (e, t) {
                                if (e) return I.default.debug("[" + a.clientId + "] Request proxy server failed: ", e), d++, w.b.requestProxyAppCenter(a.sid, {
                                    lts: o,
                                    succ: !1,
                                    APAddr: i,
                                    workerManagerList: null,
                                    ec: JSON.stringify(e),
                                    response: JSON.stringify({err: e, res: t})
                                }), void (d >= Object(_.getParameter)("PROXY_CS").length && s && s("Get proxy server failed: request all failed"));
                                if (!c) if ((t = JSON.parse(t)).json_body) {
                                    var n = JSON.parse(t.json_body);
                                    if (I.default.debug("[" + a.clientId + "] App return:", n.servers), 200 !== n.code) e = "Get proxy server failed: response code [" + n.code + "], reason [ " + n.reason + "]", I.default.debug("[" + a.clientId + "] " + e), w.b.requestProxyAppCenter(a.sid, {
                                        lts: o,
                                        succ: !1,
                                        APAddr: i,
                                        workerManagerList: null,
                                        ec: e,
                                        response: JSON.stringify({err: e, res: t})
                                    }); else {
                                        c = !0;
                                        var r = Ve(n.servers);
                                        w.b.requestProxyAppCenter(a.sid, {
                                            lts: o,
                                            succ: !0,
                                            APAddr: i,
                                            workerManagerList: JSON.stringify(r),
                                            ec: null,
                                            response: JSON.stringify({res: t})
                                        }), s && s(null, r)
                                    }
                                } else I.default.debug("[" + a.clientId + "] Get proxy server failed: no json_body"), w.b.requestProxyAppCenter(a.sid, {
                                    lts: o,
                                    succ: !1,
                                    APAddr: i,
                                    workerManagerList: null,
                                    ec: "Get proxy server failed: no json_body",
                                    response: JSON.stringify({res: t})
                                })
                            })
                        })
                    }(n = o, function (e, t) {
                        if (e) return i(e);
                        I.default.debug("[" + n.clientId + "] getProxyServerList: ", t), function (o, a, s) {
                            var c = !1, d = 0, u = {
                                command: "request",
                                gatewayType: "http",
                                appId: o.appId,
                                cname: o.cname,
                                uid: o.uid + "",
                                sdkVersion: "2.3.1",
                                sid: o.sid,
                                seq: 1,
                                ts: +new Date,
                                requestId: 3,
                                clientRequest: {appId: o.appId, cname: o.cname, uid: o.uid + "", sid: o.sid}
                            };
                            a.map(function (n) {
                                var e, t, r, i = (new Date).getTime();
                                e = "https://" + n + ":4000/v2/machine", t = u, r = function (e, t) {
                                    if (e) return I.default.debug("[" + o.clientId + "] Request worker manager failed: ", e), d++, w.b.requestProxyWorkerManager(o.sid, {
                                        lts: i,
                                        succ: !1,
                                        workerManagerAddr: n,
                                        ec: JSON.stringify(e),
                                        response: JSON.stringify({res: t})
                                    }), void (d >= a.length && s && s("requeet worker manager server failed: request failed"));
                                    if (!c) {
                                        if (!(t = JSON.parse(t)).serverResponse) return s && s("requeet worker manager server failed: serverResponse is undefined");
                                        c = !0, w.b.requestProxyWorkerManager(o.sid, {
                                            lts: i,
                                            succ: !0,
                                            workerManagerAddr: n,
                                            ec: JSON.stringify(e),
                                            response: JSON.stringify({res: t})
                                        }), s && s(null, {address: n, serverResponse: t.serverResponse})
                                    }
                                }, Object(je.c)(e, t, function (e) {
                                    r(null, e)
                                }, function (e) {
                                    r(e)
                                })
                            })
                        }(n, t, i)
                    })
                }() : d(null, a)
            }, Ge = {
                ERR_NO_VOCS_AVAILABLE: "tryNext",
                ERR_NO_VOS_AVAILABLE: "tryNext",
                ERR_JOIN_CHANNEL_TIMEOUT: "tryNext",
                WARN_REPEAT_JOIN: "quit",
                ERR_JOIN_BY_MULTI_IP: "recover",
                WARN_LOOKUP_CHANNEL_TIMEOUT: "tryNext",
                WARN_OPEN_CHANNEL_TIMEOUT: "tryNext",
                ERR_VOM_SERVICE_UNAVAILABLE: "tryNext",
                ERR_TOO_MANY_USERS: "tryNext",
                ERR_MASTER_VOCS_UNAVAILABLE: "tryNext",
                ERR_INTERNAL_ERROR: "tryNext",
                notification_test_recover: "recover",
                notification_test_tryNext: "tryNext",
                notification_test_retry: "retry"
            }, qe = {
                googResidualEchoLikelihood: "A_rel",
                googResidualEchoLikelihoodRecentMax: "A_rem",
                googTypingNoiseState: "A_tns",
                totalSamplesDuration: "A_sd",
                googAdaptationChanges: "A_ac",
                googBandwidthLimitedResolution: "A_blr",
                googCpuLimitedResolution: "A_clr",
                googEncodeUsagePercent: "A_eup",
                googHasEnteredLowResolution: "A_helr",
                googActualEncBitrate: "A_aeb",
                googAvailableReceiveBandwidth: "A_arb",
                googAvailableSendBandwidth: "A_asb",
                googRetransmitBitrate: "A_rb",
                googTargetEncBitrate: "A_teb",
                googCaptureStartNtpTimeMs: "A_csnt",
                googPreemptiveExpandRate: "A_per",
                googPreferredJitterBufferMs: "A_pjbm",
                googSecondaryDecodedRate: "A_sder",
                googSecondaryDiscardedRate: "A_sdir",
                googSpeechExpandRate: "A_ser",
                googFrameHeightReceived: "A_fhr",
                googInterframeDelayMax: "A_ifdm",
                googMinPlayoutDelayMs: "A_mpdm",
                aecDivergentFilterFraction: "A_dff",
                codecImplementationName: "A_cin",
                googEchoCancellationReturnLoss: "A_ecl",
                googEchoCancellationReturnLossEnhancement: "A_ece"
            }, Je = {};
        for (var Ke in qe) {
            var ze = qe[Ke];
            qe[ze] && console.error("Key Conflict: ".concat(Ke)), Je[ze] = Ke
        }
        var Ye = function (e) {
            return qe[e] || e
        }, Qe = function n(c) {
            var i = !1, l = function (e) {
                return {_type: "control", message: e}
            }, t = function (t) {
                var n = {};
                return Object.keys(t).forEach(function (e) {
                    n[Ye(e)] = t[e]
                }), {_type: "subscribe_related_stats", options: n}
            }, u = function (e, t, n) {
                return {_type: "publish", options: e, sdp: t, p2pid: n}
            }, d = n.DISCONNECTED, p = n.CONNECTING, f = n.CONNECTED, o = n.DISCONNECTING, r = d, m = T();
            Object.defineProperty(m, "state", {
                set: function (e) {
                    var t = r;
                    t !== (r = e) && m.dispatchEvent({
                        type: "connection-state-change",
                        prevState: n.connetionStateMap[t],
                        curState: n.connetionStateMap[e]
                    })
                }, get: function () {
                    return r
                }
            }), m.socket = void 0, m.state = d, m.mode = c.mode, m.role = c.role, m.codec = c.codec, m.config = {}, m.timers = {}, m.timer_counter = {}, m.localStreams = {}, m.remoteStreams = {}, m.attemps = 1, m.p2p_attemps = 1, m.audioLevel = {}, m.activeSpeaker = void 0, m.reconnectMode = "retry", m.rejoinAttempt = 0, m.hasChangeBGPAddress = !1, m.traffic_stats = {}, m.clientId = c.clientId, m.pingpongCounter = 0, m.p2ps = new Map, m.liveStreams = new Map, m.injectLiveStreams = new Map, m.remoteStreamsInChannel = new Set, m.inChannelInfo = {
                joinAt: null,
                duration: 0
            };
            var a = Le;
            m.p2pCounter = Object(le.g)(1e5), m.generateP2PId = function () {
                return ++m.p2pCounter
            }, m.audioVolumeIndication = {
                enabled: !1,
                sortedAudioVolumes: [],
                smooth: 3,
                interval: 2e3
            }, m.remoteVideoStreamTypes = {
                REMOTE_VIDEO_STREAM_HIGH: 0,
                REMOTE_VIDEO_STREAM_LOW: 1,
                REMOTE_VIDEO_STREAM_MEDIUM: 2
            }, m.streamFallbackTypes = {
                STREAM_FALLBACK_OPTION_DISABLED: 0,
                STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW: 1,
                STREAM_FALLBACK_OPTION_AUDIO_ONLY: 2
            }, m.configPublisher = function (e) {
                m.config = e
            }, m.getGatewayInfo = function (e, t) {
                g({_type: "gateway_info"}, e, t)
            }, m.setClientRole = function (r, e) {
                I.default.debug("[".concat(m.clientId, "] setClientRole to ").concat(r));
                var i = w.b.reportApiInvoke(m.joinInfo.sid, {name: "_setClientRole", callback: e});
                g({_type: "set_client_role", message: r}, function () {
                    m.role = r, m.dispatchEvent({type: "client-role-changed", role: r}), i && i(null, {role: r})
                }, function (e) {
                    var t = e && e.code ? e.code : 0, n = D[t];
                    if ("ERR_ALREADY_IN_USE" === n) return i && i(null);
                    n || (n = "UNKNOW_ERROR_".concat(t)), I.default.error("set Client role error to " + r + ": " + n), i && i(n)
                })
            }, m.join = function (r, e, i, o) {
                r.useProxyServer && (m.hasChangeBGPAddress = !0);
                var a = (new Date).getTime(), s = r.uid;
                if (m.inChannelInfo.joinAt && (m.inChannelInfo.duration += a - m.inChannelInfo.joinAt), m.inChannelInfo.joinAt = a, m.state !== p) return I.default.error("[".concat(m.clientId, "] GatewayClient.join Failed: state "), m.state), o && o(M), void w.b.joinGateway(r.sid, {
                    lts: a,
                    succ: !1,
                    ec: M,
                    addr: null
                });
                if (null != s && parseInt(s) !== s) return I.default.error("[".concat(m.clientId, "] Input uid is invalid")), m.state = d, o && o(N), void w.b.joinGateway(r.sid, {
                    lts: a,
                    succ: !1,
                    ec: N,
                    addr: null
                });
                var t = Xe.register(m, {uid: s, cname: r && r.cname});
                if (t) return m.state = d, o && o(t), void w.b.joinGateway(r.sid, {lts: a, succ: !1, ec: t, addr: null});
                m.joinInfo = A()({}, r), m.uid = s, m.key = e, m.pingpongCounter = 0, v(r, function (e) {
                    var t, n;
                    m.state = f, I.default.debug("[".concat(m.clientId, "] Connected to gateway server")), m.pingTimer = setInterval(function () {
                        var e = Object(_.getParameter)("PING_PONG_TIME_OUT");
                        if (++m.pingpongCounter >= e) {
                            var t = Date.now();
                            I.default.warning("PINGPONG Timeout. Last Socket Message: ".concat(t - m.socket.getLastMsgTime(), "ms")), m.socket && m.socket.getLastMsgTime() && t - m.socket.getLastMsgTime() > Object(_.getParameter)("WEBSOCKET_TIMEOUT_MIN") && (m.pingpongCounter = 0, m.socket.close(), m.socket.dispatchEvent(O({
                                type: "disconnect",
                                event: {msg: "PING_PONG_TIME_OUT"}
                            })))
                        }
                        var n = Date.now();
                        g({_type: "ping"}, function () {
                            m.pingpongCounter = 0;
                            var e = Date.now() - n;
                            g({_type: "signal_stats", message: {pingpongElapse: e}}, function () {
                            }, function (e) {
                            })
                        }, function (e) {
                        })
                    }, 3e3), g((t = {role: m.role}.role, n = {
                        appId: c.appId,
                        key: m.key,
                        channel: m.joinInfo.cname,
                        uid: m.uid,
                        version: _.VERSION,
                        browser: navigator.userAgent,
                        mode: m.mode,
                        codec: m.codec,
                        role: t,
                        config: m.config,
                        processId: Object(w.a)()
                    }, m.joinInfo.hasOwnProperty("stringUid") && (n.stringUid = m.joinInfo.stringUid), {_type: "join1", message: n}), function (e) {
                        if (w.b.joinGateway(r.sid, {
                            lts: a,
                            succ: !0,
                            ec: null,
                            vid: e.vid,
                            addr: m.socket.getURL()
                        }), m.rejoinAttempt = 0, i && i(e.uid), m.dispatchEvent({type: "join"}), m.leaveOnConnected) {
                            I.default.info("[".concat(m.clientId, "] Calling Leave() once joined"));
                            var t = m.leaveOnConnected;
                            m.leaveOnConnected = null, m.leave(t.onSuccess, t.onFailure)
                        }
                    }, function (e) {
                        if (I.default.error("[".concat(m.clientId, "] User join failed [").concat(e, "]")), Ge[e] && m.rejoinAttempt < 4) {
                            if (m._doWithAction(Ge[e], i, o), m.leaveOnConnected) {
                                I.default.error("[".concat(m.clientId, "] Calling Leave() once joined: Join Failed"));
                                var t = m.leaveOnConnected;
                                m.leaveOnConnected = null, t.onFailure(V)
                            }
                        } else o && o(e);
                        w.b.joinGateway(r.sid, {lts: a, succ: !1, ec: e, addr: m.socket.getURL()})
                    })
                }, function (e) {
                    I.default.error("[".concat(m.clientId, "] User join failed [").concat(e, "]")), o && o(e), w.b.joinGateway(r.sid, {
                        lts: a,
                        succ: !1,
                        ec: e,
                        addr: m.socket.getURL()
                    })
                }), clearInterval(m.timers.trafficStats), m.timers.trafficStats = setInterval(function () {
                    g({_type: "traffic_stats"}, function (n) {
                        m.traffic_stats = n;
                        var e = m.joinInfo.stringUid, t = m.localStreams[s] || m.localStreams[e];
                        t && (t.traffic_stats = {access_delay: n.access_delay}), n.peer_delay && n.peer_delay.forEach(function (e) {
                            var t = m.remoteStreams[e.peer_uid];
                            t && (t.traffic_stats = {
                                access_delay: n.access_delay,
                                e2e_delay: e.e2e_delay,
                                audio_delay: e.audio_delay,
                                video_delay: e.video_delay
                            })
                        })
                    })
                }, 3e3), m.resetAudioVolumeIndication()
            }, m.leave = function (t, n) {
                switch (m.state) {
                    case d:
                        return I.default.debug("[".concat(m.clientId, "] Client Already in DISCONNECTED status")), void a(t);
                    case o:
                        return I.default.error("[".concat(m.clientId, "] Client Already in DISCONNECTING status")), void a(n, M);
                    case p:
                        return m.leaveOnConnected ? (I.default.error("[".concat(m.clientId, "] Client.leave() already called")), void a(n, M)) : (I.default.debug("[".concat(m.clientId, "] Client connecting. Waiting for Client Fully Connected(And leave)")), void (m.leaveOnConnected = {
                            onSuccess: t,
                            onFailure: n
                        }))
                }
                var e = Xe.unregister(m);
                if (e) I.default.error("[".concat(m.clientId, "] "), e); else {
                    for (var r in m.state = o, clearInterval(m.pingTimer), m.timers) m.timers.hasOwnProperty(r) && clearInterval(m.timers[r]);
                    for (var r in m.inChannelInfo.joinAt && (m.inChannelInfo.duration += Date.now() - m.inChannelInfo.joinAt, m.inChannelInfo.joinAt = null), g({_type: "leave"}, function (e) {
                        m.socket.close(), m.socket = void 0, I.default.info("[".concat(m.clientId, "] Leave channel success")), m.state = d, t && t(e)
                    }, function (e) {
                        I.default.error("[".concat(m.clientId, "] Leave Channel Failed"), e), m.state = f, n && n(e)
                    }), m.localStreams) if (m.localStreams.hasOwnProperty(r)) {
                        var i = m.localStreams[r];
                        delete m.localStreams[r], void 0 !== i.pc && (i.pc.close(), i.pc = void 0)
                    }
                    b()
                }
            }, m.publish = function (o, r, i, a) {
                var s = (new Date).getTime(), c = !1;
                if (o.publishLTS = s, "object" !== he()(o) || null === o) return I.default.error("[".concat(m.clientId, "] Invalid local stream")), a && a(x), void w.b.publish(m.joinInfo.sid, {
                    lts: s,
                    succ: !1,
                    audioName: o.hasAudio() && o.audioName,
                    videoName: o.hasVideo() && o.videoName,
                    screenName: o.hasScreen() && o.screenName,
                    ec: x
                });
                if (null === o.stream && void 0 === o.url) return I.default.error("[".concat(m.clientId, "] Invalid local media stream")), a && a(x), void w.b.publish(m.joinInfo.sid, {
                    lts: s,
                    succ: !1,
                    audioName: o.hasAudio() && o.audioName,
                    videoName: o.hasVideo() && o.videoName,
                    screenName: o.hasScreen() && o.screenName,
                    ec: x
                });
                if (m.state !== f) return I.default.error("[".concat(m.clientId, "] User is not in the session")), a && a(M), void w.b.publish(m.joinInfo.sid, {
                    lts: s,
                    succ: !1,
                    audioName: o.hasAudio() && o.audioName,
                    videoName: o.hasVideo() && o.videoName,
                    screenName: o.hasScreen() && o.screenName,
                    ec: M
                });
                var e = o.getAttributes() || {};
                if (o.local && void 0 === m.localStreams[o.getId()] && (o.hasAudio() || o.hasVideo() || o.hasScreen())) {
                    var d = m.generateP2PId();
                    if (m.p2ps.set(d, o), o.p2pId = d, void 0 !== o.url) y(u({
                        state: "url",
                        audio: o.hasAudio(),
                        video: o.hasVideo(),
                        attributes: o.getAttributes(),
                        mode: m.mode
                    }, o.url), function (e, t) {
                        "success" === e ? (o.getUserId() !== t && o.setUserId(t), (m.localStreams[t] = o).onClose = function () {
                            m.unpublish(o)
                        }) : I.default.error("[".concat(m.clientId, "] Publish local stream failed"), e)
                    }); else {
                        (m.localStreams[o.getId()] = o).connectionSpec = {
                            callback: function (n) {
                                I.default.debug("[".concat(m.clientId, "] SDP exchange in publish : send offer --  "), JSON.parse(n)), y(u({
                                    state: "offer",
                                    id: o.getId(),
                                    audio: o.hasAudio(),
                                    video: o.hasVideo() || o.hasScreen(),
                                    attributes: o.getAttributes(),
                                    streamType: r.streamType,
                                    dtx: o.DTX,
                                    hq: o.highQuality,
                                    lq: o.lowQuality,
                                    stereo: o.stereo,
                                    speech: o.speech,
                                    mode: m.mode,
                                    codec: m.codec,
                                    p2pid: d,
                                    turnip: m.joinInfo.turnServer.url,
                                    turnport: Number(m.joinInfo.turnServer.udpport),
                                    turnusername: m.joinInfo.turnServer.username,
                                    turnpassword: m.joinInfo.turnServer.credential
                                }, n), function (e, t) {
                                    if ("error" === e) return I.default.error("[".concat(m.clientId, "] Publish local stream failed")), a && a(F), void w.b.publish(m.joinInfo.sid, {
                                        lts: s,
                                        succ: !1,
                                        audioName: o.hasAudio() && o.audioName,
                                        videoName: o.hasVideo() && o.videoName,
                                        screenName: o.hasScreen() && o.screenName,
                                        localSDP: n,
                                        ec: F
                                    });
                                    o.pc.onsignalingmessage = function (e) {
                                        o.pc.onsignalingmessage = function () {
                                        }, y(u({
                                            state: "ok",
                                            id: o.getId(),
                                            audio: o.hasAudio(),
                                            video: o.hasVideo(),
                                            screen: o.hasScreen(),
                                            streamType: r.streamType,
                                            attributes: o.getAttributes(),
                                            mode: m.mode
                                        }, e)), o.getUserId() !== t.id && o.setUserId(t.id), I.default.info("[".concat(m.clientId, "] Local stream published with uid"), t.id), o.onClose = function () {
                                            m.unpublish(o)
                                        }, o._onAudioUnmute = function () {
                                            g(l({action: "audio-out-on", streamId: o.getId()}), function () {
                                            }, function () {
                                            })
                                        }, o._onVideoUnmute = function () {
                                            g(l({action: "video-out-on", streamId: o.getId()}), function () {
                                            }, function () {
                                            })
                                        }, o._onAudioMute = function () {
                                            g(l({action: "audio-out-off", streamId: o.getId()}), function () {
                                            }, function () {
                                            })
                                        }, o._onVideoMute = function () {
                                            g(l({action: "video-out-off", streamId: o.getId()}), function () {
                                            }, function () {
                                            })
                                        }, o.getId() === o.getUserId() && (o.isAudioOn() || o.hasAudio() && (I.default.debug("[".concat(m.clientId, "] local stream audio mute")), o._onAudioMute()), o.isVideoOn() || (o.hasVideo() || o.hasScreen()) && (I.default.debug("[".concat(m.clientId, "] local stream video mute")), o._onVideoMute()))
                                    }, o.pc.oniceconnectionstatechange = function (e) {
                                        if ("failed" === e) {
                                            if (null != m.timers[o.getId()] && (clearInterval(m.timers[o.getId()]), clearInterval(m.timers[o.getId()] + "_RelatedStats")), I.default.error("[".concat(m.clientId, "] Publisher connection is lost -- streamId: ").concat(o.getId(), ", p2pId: ").concat(d)), m.p2ps.delete(d), I.default.debug("[".concat(m.clientId, "] publish p2p failed: "), m.p2ps), !c) return c = !0, w.b.publish(m.joinInfo.sid, {
                                                lts: s,
                                                succ: !1,
                                                audioName: o.hasAudio() && o.audioName,
                                                videoName: o.hasVideo() && o.videoName,
                                                screenName: o.hasScreen() && o.screenName,
                                                ec: B
                                            }), m.dispatchEvent(E({type: "pubP2PLost", stream: o})), a && a(B);
                                            m.dispatchEvent(E({type: "pubP2PLost", stream: o}))
                                        } else if ("connected" === e && (I.default.debug("[".concat(m.clientId, "] publish p2p connected: "), m.p2ps), !c)) return c = !0, w.b.publish(m.joinInfo.sid, {
                                            lts: s,
                                            succ: !0,
                                            audioName: o.hasAudio() && o.audioName,
                                            videoName: o.hasVideo() && o.videoName,
                                            screenName: o.hasScreen() && o.screenName,
                                            ec: null
                                        }), i && i()
                                    }, I.default.debug("[".concat(m.clientId, "] SDP exchange in publish : receive answer --  "), JSON.parse(e)), o.pc.processSignalingMessage(e)
                                })
                            },
                            audio: o.hasAudio(),
                            video: o.hasVideo(),
                            screen: o.hasScreen(),
                            isSubscriber: !1,
                            stunServerUrl: m.stunServerUrl,
                            turnServer: m.joinInfo.turnServer,
                            maxAudioBW: e.maxAudioBW,
                            minVideoBW: e.minVideoBW,
                            maxVideoBW: e.maxVideoBW,
                            mode: m.mode,
                            codec: m.codec,
                            isVideoMute: o.userMuteVideo || o.peerMuteVideo,
                            isAudioMute: o.userMuteAudio || o.peerMuteAudio,
                            maxFrameRate: o.attributes.maxFrameRate,
                            clientId: m.clientId
                        }, o.pc = de(o.connectionSpec), o.pc.addStream(o.stream), I.default.debug("[".concat(m.clientId, "] PeerConnection add stream :"), o.stream), o.pc.onnegotiationneeded = function (e) {
                            y(u({state: "negotiation", p2pid: d}, e), function (e, t) {
                                o.pc.processSignalingMessage(e)
                            })
                        }, m.timers[o.getId()] = setInterval(function () {
                            var n = 0;
                            o && o.pc && o.pc.getStats && o.pc.getStatsRate(function (e) {
                                e.forEach(function (e) {
                                    if (e && e.id && !/_recv$/.test(e.id) && !/^time$/.test(e.id) && o.getUserId()) if (-1 === e.id.indexOf("outbound_rtp") && -1 === e.id.indexOf("OutboundRTP") || "video" !== e.mediaType || (e.googFrameWidthSent = o.videoWidth + "", e.googFrameHeightSent = o.videoHeight + ""), o.getId() == o.getUserId()) {
                                        var t = 200 * n;
                                        n++, setTimeout(function () {
                                            var t, n;
                                            g((t = e, n = {}, Object.keys(t).forEach(function (e) {
                                                n[Ye(e)] = t[e]
                                            }), {_type: "publish_stats", options: {stats: n}, sdp: null}), null, null)
                                        }, t)
                                    } else t = 200 * n, n++, setTimeout(function () {
                                        var t, n;
                                        g((t = e, n = {}, Object.keys(t).forEach(function (e) {
                                            n[Ye(e)] = t[e]
                                        }), {_type: "publish_stats_low", options: {stats: n}, sdp: null}), null, null)
                                    }, t)
                                })
                            })
                        }, 3e3);
                        var t = function () {
                            o && o.pc && o.pc.getVideoRelatedStats && o.pc.getVideoRelatedStats(function (e) {
                                var t, n, r, i;
                                o.getId() === o.getUserId() ? g((t = e, n = {}, Object.keys(t).forEach(function (e) {
                                    n[Ye(e)] = t[e]
                                }), {
                                    _type: "publish_related_stats",
                                    options: n
                                }), null, null) : g((r = e, i = {}, Object.keys(r).forEach(function (e) {
                                    i[Ye(e)] = r[e]
                                }), {_type: "publish_related_stats_low", options: i}), null, null)
                            })
                        };
                        t(), m.timers[o.getId() + "_RelatedStats"] = setInterval(t, 1e3)
                    }
                }
            }, m.unpublish = function (e, t, n, r) {
                return "object" !== he()(e) || null === e ? (I.default.error("[".concat(m.clientId, "] Invalid local stream")), void a(r, x)) : m.state !== f ? (I.default.error("[".concat(m.clientId, "] User not in the session")), void a(r, M)) : (null != m.timers[e.getId()] && (clearInterval(m.timers[e.getId()]), clearInterval(m.timers[e.getId() + "_RelatedStats"])), void (void 0 !== m.socket ? e.local && void 0 !== m.localStreams[e.getId()] ? (delete m.localStreams[e.getId()], g({
                    _type: "unpublish",
                    message: e.getUserId(),
                    streamType: t.streamType
                }), (e.hasAudio() || e.hasVideo() || e.hasScreen()) && void 0 === e.url && void 0 !== e.pc && (e.pc.close(), e.pc = void 0), e.onClose = void 0, e._onAudioMute = void 0, e._onAudioUnute = void 0, e._onVideoMute = void 0, e._onVideoUnmute = void 0, m.p2ps.delete(e.p2pId), n && n()) : (I.default.error("[".concat(m.clientId, "] Invalid local stream")), a(r, x)) : (I.default.error("[".concat(m.clientId, "] User not in the session")), a(r, M))))
            }, m.subscribe = function (a, o, s) {
                var c = (new Date).getTime();
                a.subscribeLTS = c;
                var d = !1;
                if (I.default.info("[".concat(m.clientId, "] Gatewayclient ").concat(m.uid, " Subscribe ").concat(a.getId(), ": ").concat(JSON.stringify(a.subscribeOptions))), "object" !== he()(a) || null === a) return I.default.error("[".concat(m.clientId, "] Invalid remote stream")), s && s(L), void w.b.subscribe(m.joinInfo.sid, {
                    lts: c,
                    succ: !1,
                    video: a.subscribeOptions && a.subscribeOptions.video,
                    audio: a.subscribeOptions && a.subscribeOptions.audio,
                    peerid: a.getId(),
                    ec: L
                });
                if (m.state !== f && (I.default.error("[".concat(m.clientId, "] User is not in the session")), !d)) return d = !0, w.b.subscribe(m.joinInfo.sid, {
                    lts: c,
                    succ: !1,
                    video: a.subscribeOptions && a.subscribeOptions.video,
                    audio: a.subscribeOptions && a.subscribeOptions.audio,
                    peerid: a.getId(),
                    ec: M
                }), s && s(M);
                if (!a.local && m.remoteStreams.hasOwnProperty(a.getId())) if (a.hasAudio() || a.hasVideo() || a.hasScreen()) {
                    var u = m.generateP2PId();
                    m.p2ps.set(u, a), a.p2pId = u, a.pc = de({
                        callback: function (e) {
                            I.default.debug("[".concat(m.clientId, "] SDP exchange in subscribe : send offer --  "), JSON.parse(e));
                            var t = A()({
                                streamId: a.getId(),
                                video: !0,
                                audio: !0,
                                mode: m.mode,
                                codec: m.codec,
                                p2pid: u,
                                turnip: m.joinInfo.turnServer.url,
                                turnport: Number(m.joinInfo.turnServer.udpport),
                                turnusername: m.joinInfo.turnServer.username,
                                turnpassword: m.joinInfo.turnServer.credential,
                                tcc: Object(_.getParameter)("SUBSCRIBE_TCC")
                            }, a.subscribeOptions);
                            y({_type: "subscribe", options: t, sdp: e, p2pid: void 0}, function (e) {
                                if ("error" === e) return I.default.error("[".concat(m.clientId, "] Subscribe remote stream failed, closing stream "), a.getId()), a.close(), s && s(W), void w.b.subscribe(m.joinInfo.sid, {
                                    lts: c,
                                    succ: !1,
                                    video: a.subscribeOptions && a.subscribeOptions.video,
                                    audio: a.subscribeOptions && a.subscribeOptions.audio,
                                    peerid: a.getId(),
                                    ec: W
                                });
                                I.default.debug("[".concat(m.clientId, "] SDP exchange in subscribe : receive answer --  "), JSON.parse(e)), a.pc.processSignalingMessage(e)
                            })
                        },
                        nop2p: !0,
                        audio: !0,
                        video: !0,
                        screen: a.hasScreen(),
                        isSubscriber: !0,
                        stunServerUrl: m.stunServerUrl,
                        turnServer: m.joinInfo.turnServer,
                        isVideoMute: a.userMuteVideo,
                        isAudioMute: a.userMuteAudio,
                        uid: a.getId(),
                        clientId: m.clientId
                    }), a.pc.onaddstream = function (e, t) {
                        if (a._onAudioUnmute = function () {
                            g(l({action: "audio-in-on", streamId: a.getId()}), function () {
                            }, function () {
                            })
                        }, a._onAudioMute = function () {
                            g(l({action: "audio-in-off", streamId: a.getId()}), function () {
                            }, function () {
                            })
                        }, a._onVideoUnmute = function () {
                            g(l({action: "video-in-on", streamId: a.getId()}), function () {
                            }, function () {
                            })
                        }, a._onVideoMute = function () {
                            g(l({action: "video-in-off", streamId: a.getId()}), function () {
                            }, function () {
                            })
                        }, "ontrack" === t && "video" === e.track.kind || "onaddstream" === t) {
                            I.default.info("[".concat(m.clientId, "] Remote stream subscribed with uid "), a.getId());
                            var n = m.remoteStreams[a.getId()];
                            if (m.remoteStreams[a.getId()].stream = "onaddstream" === t ? e.stream : e.streams[0], m.remoteStreams[a.getId()].hasVideo()) {
                                if (Object(R.isFireFox)() || Object(R.isSafari)()) {
                                    var r = m.remoteStreams[a.getId()].stream;
                                    Object(le.h)(r, function (e, t) {
                                        a.videoWidth = e, a.videoHeight = t
                                    }, function (e) {
                                        return I.default.warning("[".concat(m.clientId, "] vsResHack failed: ") + e)
                                    })
                                }
                            } else {
                                var i = m.remoteStreams[a.getId()];
                                i.peerMuteVideo = !0, m._adjustPCMuteStatus(i)
                            }
                            n && n.isPlaying() && n.elementID && (I.default.debug("[".concat(m.clientId, "] Reload Player ").concat(n.elementID, " StreamId ").concat(n.getId())), a.audioOutput = n.audioOutput, n.stop(), a.play(n.elementID, n.playOptions)), delete a.audioLevelHelper;
                            var o = C({type: "stream-subscribed", stream: m.remoteStreams[a.getId()]});
                            m.dispatchEvent(o)
                        }
                    }, m.timers[a.getId()] = setInterval(function () {
                        var t = 0;
                        a && a.pc && a.pc.getStats && a.pc.getStatsRate(function (e) {
                            e.forEach(function (r) {
                                if (r && r.id) {
                                    if (/_send$/.test(r.id) || /^time$/.test(r.id) || /^bweforvideo$/.test(r.id)) return;
                                    -1 === r.id.indexOf("inbound_rtp") && -1 === r.id.indexOf("inbound-rtp") || "video" !== r.mediaType || (r.googFrameWidthReceived = a.videoWidth + "", r.googFrameHeightReceived = a.videoHeight + "");
                                    var e = 200 * t;
                                    t++;
                                    var i = a.getId();
                                    setTimeout(function () {
                                        var e, t, n;
                                        y((e = i, t = r, n = {}, Object.keys(t).forEach(function (e) {
                                            n[Ye(e)] = t[e]
                                        }), {_type: "subscribe_stats", options: {id: e, stats: n}, sdp: null}), null, null)
                                    }, e)
                                }
                            })
                        })
                    }, 3e3), m.timers[a.getId() + "_RelatedStats"] = setInterval(function () {
                        a && a.pc && (a.pc.getVideoRelatedStats && a.pc.getVideoRelatedStats(function (e) {
                            g(t(e), null, null)
                        }), a.pc.getAudioRelatedStats && a.pc.getAudioRelatedStats(function (e) {
                            g(t(e), null, null)
                        }))
                    }, 1e3), m.audioLevel[a.getId()] = 0, m.timers[a.getId() + "audio"] = setInterval(function () {
                        m.hasListeners("active-speaker") && a && a.pc && "established" === a.pc.state && a.pc.getStats && a.pc.getStats(function (e) {
                            e.forEach(function (e) {
                                if ("audio" === e.mediaType) {
                                    if (5e3 < e.audioOutputLevel) for (var t in m.audioLevel[a.getId()] < 20 && (m.audioLevel[a.getId()] += 1), m.audioLevel) t !== "" + a.getId() && 0 < m.audioLevel[t] && (m.audioLevel[t] -= 1);
                                    var n = Object.keys(m.audioLevel).sort(function (e, t) {
                                        return m.audioLevel[t] - m.audioLevel[e]
                                    });
                                    if (m.activeSpeaker !== n[0]) {
                                        var r = E({type: "active-speaker", uid: n[0]});
                                        m.dispatchEvent(r), m.activeSpeaker = n[0], I.default.debug("[".concat(m.clientId, "] Update active speaker: ").concat(m.activeSpeaker))
                                    }
                                }
                            })
                        }, 50)
                    }, 50), a.pc.oniceconnectionstatechange = function (e) {
                        if ("failed" === e) null != m.timers[a.getId()] && (clearInterval(m.timers[a.getId()]), clearInterval(m.timers[a.getId()] + "audio")), I.default.error("[".concat(m.clientId, "] Subscriber connection is lost -- streamId: ").concat(a.getId(), ", p2pId: ").concat(u)), I.default.debug("[".concat(m.clientId, "] subscribe p2p failed: "), m.p2ps), d || (d = !0, s && s(B), w.b.subscribe(m.joinInfo.sid, {
                            lts: c,
                            succ: !1,
                            video: a.subscribeOptions && a.subscribeOptions.video,
                            audio: a.subscribeOptions && a.subscribeOptions.audio,
                            peerid: a.getId(),
                            ec: B
                        })), m.remoteStreams[a.getId()] && m.p2ps.has(u) && (m.p2ps.delete(u), m.dispatchEvent(E({
                            type: "subP2PLost",
                            stream: a
                        }))); else if ("connected" === e && (I.default.debug("[".concat(m.clientId, "] subscribe p2p connected: "), m.p2ps), !d)) {
                            d = !0, w.b.subscribe(m.joinInfo.sid, {
                                lts: c,
                                succ: !0,
                                video: a.subscribeOptions && a.subscribeOptions.video,
                                audio: a.subscribeOptions && a.subscribeOptions.audio,
                                peerid: a.getId(),
                                ec: null
                            }), m._adjustPCMuteStatus(a);
                            var t = !1, n = setInterval(function () {
                                a.pc ? a.pc.getStats(function (e) {
                                    e.forEach(function (e) {
                                        -1 !== e.id.indexOf("recv") && "audio" === e.mediaType && 0 < parseInt(e.googDecodingNormal) && (t || (t = !0, m.dispatchEvent({
                                            type: "first-audio-frame-decode",
                                            stream: a
                                        }), clearInterval(n), w.b.reportApiInvoke(m.joinInfo.sid, {name: "firstAudioDecode"})(null, {elapse: Date.now() - a.subscribeLTS})))
                                    })
                                }, 100) : clearInterval(n)
                            }, 100), r = !1, i = setInterval(function () {
                                a.pc ? a.pc.getStats(function (e) {
                                    e.forEach(function (e) {
                                        -1 === e.id.indexOf("recv") && -1 === e.id.indexOf("inbound_rtp") && -1 === e.id.indexOf("inbound-rtp") && -1 === e.id.indexOf("InboundRTP") || "video" === e.mediaType && (0 < e.framesDecoded || 0 < e.googFramesDecoded) && (r || (r = !0, m.dispatchEvent({
                                            type: "first-video-frame-decode",
                                            stream: a
                                        }), clearInterval(i), a.firstFrameTime = (new Date).getTime() - a.subscribeLTS, w.b.firstRemoteFrame(m.joinInfo.sid, {
                                            lts: (new Date).getTime(),
                                            peerid: a.getId(),
                                            succ: !0,
                                            width: +e.googFrameWidthReceived,
                                            height: +e.googFrameHeightReceived
                                        })))
                                    })
                                }, 100) : clearInterval(i)
                            }, 100);
                            return a.sid = m.joinInfo.sid, o && o()
                        }
                    }
                } else I.default.error("[".concat(m.clientId, "] Invalid remote stream")), d || (d = !0, s && s(L), w.b.subscribe(m.joinInfo.sid, {
                    lts: c,
                    succ: !1,
                    video: a.subscribeOptions && a.subscribeOptions.video,
                    audio: a.subscribeOptions && a.subscribeOptions.audio,
                    peerid: a.getId(),
                    ec: L
                })); else I.default.error("[".concat(m.clientId, "] No such remote stream")), d || (d = !0, s && s(G), w.b.subscribe(m.joinInfo.sid, {
                    lts: c,
                    succ: !1,
                    video: a.subscribeOptions && a.subscribeOptions.video,
                    audio: a.subscribeOptions && a.subscribeOptions.audio,
                    peerid: a.getId(),
                    ec: G
                }))
            }, m.subscribeChange = function (n, r, i) {
                var e, t, o = Date.now();
                I.default.info("[".concat(m.clientId, "] Gatewayclient ").concat(m.uid, " SubscribeChange ").concat(n.getId(), ": ").concat(JSON.stringify(n.subscribeOptions))), m._adjustPCMuteStatus(n), g((e = n.getId(), t = n.subscribeOptions, {
                    _type: "subscribe_change",
                    options: A()({streamId: e}, t)
                }), function (e) {
                    if ("error" === e) return I.default.error("[".concat(m.clientId, "] Subscribe Change Failed ").concat(n.getId())), void a(i, "SUBSCRIBE_CHANGE_FAILED");
                    var t = C({type: "stream-subscribe-changed", stream: m.remoteStreams[n.getId()]});
                    w.b.subscribe(m.joinInfo.sid, {
                        lts: o,
                        succ: !0,
                        video: n.subscribeOptions && n.subscribeOptions.video,
                        audio: n.subscribeOptions && n.subscribeOptions.audio,
                        peerid: n.getId(),
                        ec: null
                    }), m.dispatchEvent(t), r && r()
                }, i)
            }, m._adjustPCMuteStatus = function (r) {
                !r.local && r.pc && r.pc.peerConnection.getReceivers && r.pc.peerConnection.getReceivers().forEach(function (e) {
                    if (e && e.track && "audio" === e.track.kind) {
                        var t = !r.userMuteAudio && !r.peerMuteAudio;
                        r.subscribeOptions && !r.subscribeOptions.audio && (t = !1), e.track.enabled = !!t
                    } else if (e && e.track && "video" === e.track.kind) {
                        var n = !r.userMuteVideo && !r.peerMuteVideo;
                        r.subscribeOptions && !r.subscribeOptions.video && (n = !1), e.track.enabled = !!n
                    }
                })
            }, m.unsubscribe = function (t, n, r) {
                if ("object" !== he()(t) || null === t) return I.default.error("[".concat(m.clientId, "] Invalid remote stream")), void a(r, L);
                if (m.state !== f) return I.default.error("[".concat(m.clientId, "] User is not in the session")), void a(r, M);
                if (null != m.timers[t.getId()] && (clearInterval(m.timers[t.getId()]), clearInterval(m.timers[t.getId()] + "audio")), null != m.audioLevel[t.getId()] && delete m.audioLevel[t.getId()], null != m.timer_counter[t.getId()] && delete m.timer_counter[t.getId()], m.remoteStreams.hasOwnProperty(t.getId())) {
                    if (!m.socket) return I.default.error("[".concat(m.clientId, "] User is not in the session")), void a(r, M);
                    if (t.local) return I.default.error("[".concat(m.clientId, "] Invalid remote stream")), void a(r, L);
                    t.close(), g({_type: "unsubscribe", message: t.getId()}, function (e) {
                        if ("error" === e) return I.default.error("[".concat(m.clientId, "] Unsubscribe remote stream failed ").concat(t.getId())), void a(r, H);
                        void 0 !== t.pc && (t.pc.close(), t.pc = void 0), t.onClose = void 0, t._onAudioMute = void 0, t._onAudioUnute = void 0, t._onVideoMute = void 0, t._onVideoUnmute = void 0, delete t.subscribeOptions, m.p2ps.delete(t.p2pId), I.default.info("[".concat(m.clientId, "] Unsubscribe stream success")), n && n()
                    }, r)
                } else a(r, G)
            }, m.setRemoteVideoStreamType = function (e, t) {
                if (I.default.debug("[".concat(m.clientId, "] Switching remote video stream ").concat(e.getId(), " to ").concat(t)), "object" === he()(e) && null !== e) if (m.state === f) {
                    if (!e.local) {
                        switch (t) {
                            case m.remoteVideoStreamTypes.REMOTE_VIDEO_STREAM_HIGH:
                            case m.remoteVideoStreamTypes.REMOTE_VIDEO_STREAM_LOW:
                            case m.remoteVideoStreamTypes.REMOTE_VIDEO_STREAM_MEDIUM:
                                break;
                            default:
                                return
                        }
                        g({_type: "switchVideoStream", message: {id: e.getId(), type: t}}, null, null)
                    }
                } else I.default.error("[".concat(m.clientId, "] User is not in the session")); else I.default.error("[".concat(m.clientId, "] Invalid remote stream"))
            }, m.renewToken = function (e, t, n) {
                e ? m.key ? m.state !== f ? (I.default.debug("[".concat(m.clientId, "] Client is not connected. Trying to rejoin")), m.key = e, m.rejoin(), t && t()) : (I.default.debug("[".concat(m.clientId, "] renewToken from ").concat(m.key, " to ").concat(e)), g({
                    _type: "renew_token",
                    message: {token: e}
                }, t, n)) : (I.default.error("[".concat(m.clientId, "] Client is previously joined without token")), n && n(N)) : (I.default.error("[".concat(m.clientId, "] Invalid Token ").concat(e)), n && n(N))
            }, m.setStreamFallbackOption = function (e, t) {
                if (I.default.debug("[".concat(m.clientId, "] Set stream fallback option ").concat(e.getId(), " to ").concat(t)), "object" === he()(e) && null !== e) if (m.state === f) {
                    if (!e.local) {
                        switch (t) {
                            case m.streamFallbackTypes.STREAM_FALLBACK_OPTION_DISABLED:
                            case m.streamFallbackTypes.STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW:
                            case m.streamFallbackTypes.STREAM_FALLBACK_OPTION_AUDIO_ONLY:
                                break;
                            default:
                                return
                        }
                        g({_type: "setFallbackOption", message: {id: e.getId(), type: t}}, null, null)
                    }
                } else I.default.error("[".concat(m.clientId, "] User is not in the session")); else I.default.error("[".concat(m.clientId, "] Invalid remote stream"))
            }, m.startLiveStreaming = function (e, t) {
                m.liveStreams.set(e, t), I.default.debug("[".concat(m.clientId, "] Start live streaming ").concat(e, " ").concat(t, " ").concat(t)), m.state === f ? g({
                    _type: "start_live_streaming",
                    message: {url: e, transcodingEnabled: t}
                }, null, null) : I.default.error("[".concat(m.clientId, "] User is not in the session"))
            }, m.stopLiveStreaming = function (e) {
                I.default.debug("[".concat(m.clientId, "] Stop live streaming ").concat(e)), m.state === f ? (m.liveStreams.delete(e), g({
                    _type: "stop_live_streaming",
                    message: {url: e}
                }, null, null)) : I.default.error("[".concat(m.clientId, "] User is not in the session"))
            }, m.setLiveTranscoding = function (e) {
                Object(le.d)(e) && (m.transcoding = e, I.default.debug("[".concat(m.clientId, "] Set live transcoding "), e), m.state === f ? g({
                    _type: "set_live_transcoding",
                    message: {transcoding: e}
                }, null, null) : I.default.error("[".concat(m.clientId, "] User is not in the session")))
            }, m.addInjectStreamUrl = function (e, t) {
                m.injectLiveStreams.set(e, t), I.default.debug("[".concat(m.clientId, "] Add inject stream url ").concat(e, " config "), t), m.state === f ? g({
                    _type: "add_inject_stream_url",
                    message: {url: e, config: t}
                }, null, null) : I.default.error("[".concat(m.clientId, "] User is not in the session"))
            }, m.removeInjectStreamUrl = function (e) {
                I.default.debug("[".concat(m.clientId, "] Remove inject stream url ").concat(e)), m.state === f ? (m.injectLiveStreams.delete(e), g({
                    _type: "remove_inject_stream_url",
                    message: {url: e}
                }, null, null)) : I.default.error("[".concat(m.clientId, "] User is not in the session"))
            }, m.enableAudioVolumeIndicator = function (e, t) {
                m.audioVolumeIndication.enabled = !0, m.audioVolumeIndication.interval = e, m.audioVolumeIndication.smooth = t, m.resetAudioVolumeIndication()
            }, m.resetAudioVolumeIndication = function () {
                if (clearInterval(m.timers.audioVolumeIndication), clearInterval(m.timers.audioVolumeSampling), m.audioVolumeIndication.enabled && m.audioVolumeIndication.interval) {
                    var o = Math.floor(1e3 * m.audioVolumeIndication.smooth / 100);
                    m.timers.audioVolumeSampling = setInterval(function () {
                        m.audioVolumeSampling || (m.audioVolumeSampling = {});
                        var e = {};
                        for (var t in m.remoteStreams) {
                            var n = m.remoteStreams[t];
                            if (n.stream && n.hasAudio()) {
                                var r = n.getAudioLevel();
                                0 < r && r < 1 && (r *= 100);
                                var i = m.audioVolumeSampling[t] || [];
                                for (i.push(r); i.length > o;) i.shift();
                                e[t] = i
                            }
                        }
                        m.audioVolumeSampling = e
                    }, 100), m.timers.audioVolumeIndication = setInterval(function () {
                        var e = [];
                        for (var t in m.remoteStreams) if (m.audioVolumeSampling && m.audioVolumeSampling[t]) {
                            var n = m.audioVolumeSampling[t], r = 0;
                            n.forEach(function (e) {
                                r += e
                            });
                            var i = {uid: t, level: Math.floor(r / n.length)};
                            i.level && e.push(i)
                        }
                        var o = e.sort(function (e, t) {
                            return e.level - t.level
                        });
                        I.default.debug("[".concat(m.clientId, "] volume-indicator "), JSON.stringify(o)), m.audioVolumeIndication.sortedAudioVolumes = o;
                        var a = E({type: "volume-indicator", attr: o});
                        m.dispatchEvent(a)
                    }, m.audioVolumeIndication.interval)
                }
            }, m.closeGateway = function () {
                I.default.debug("[".concat(m.clientId, "] close gateway")), m.state = d, m.socket.close(), s()
            };
            var s = function () {
                for (var e in m.timers) m.timers.hasOwnProperty(e) && clearInterval(m.timers[e]);
                for (var e in m.remoteStreams) if (m.remoteStreams.hasOwnProperty(e)) {
                    var t = m.remoteStreams[e], n = E({type: "stream-removed", uid: t.getId(), stream: t});
                    m.dispatchEvent(n)
                }
                m.p2ps.clear(), b(), S(), clearInterval(m.pingTimer)
            };
            m.rejoin = function () {
                m.socket && (clearInterval(m.pingTimer), m.socket.close(), m.socket = void 0), m.state = p, h()
            };
            var h = function (e, t) {
                m.dispatchEvent(E({type: "rejoin-start"})), e = e || function (e) {
                    I.default.info("[".concat(m.clientId, "] User ").concat(e, " is re-joined to ").concat(m.joinInfo.cname)), m.dispatchEvent(E({type: "rejoin"})), m.liveStreams && m.liveStreams.size && m.liveStreams.forEach(function (e, t) {
                        e && m.setLiveTranscoding(m.transcoding), m.startLiveStreaming(t, e)
                    }), m.injectLiveStreams && m.injectLiveStreams.size && m.injectLiveStreams.forEach(function (e, t) {
                        m.addInjectStreamUrl(t, e)
                    })
                }, t = t || function (e) {
                    I.default.error("[".concat(m.clientId, "] Re-join to channel failed "), e), m.dispatchEvent(C({type: "error", reason: e}))
                }, m.key ? (++m.rejoinAttempt, m.join(m.joinInfo, m.key, e, t)) : I.default.error("[".concat(m.clientId, "] Connection recover failed [Invalid channel key]"))
            }, v = function (n, e, r) {
                var t;
                m.onConnect = e, m.socket ? (m.dispatchEvent({type: "reconnect"}), "retry" === m.reconnectMode ? (I.default.debug("[".concat(m.clientId, "] Retry current gateway")), m.socket.reconnect()) : "tryNext" === m.reconnectMode ? (I.default.debug("[".concat(m.clientId, "] Try next gateway")), m.socket.connectNext()) : "recover" === m.reconnectMode && (I.default.debug("[".concat(m.clientId, "] Recover gateway")), I.default.debug("[".concat(m.clientId, "] Try to reconnect choose server and get gateway list again ")), He(m.joinInfo, function (e) {
                    m.socket.replaceHost(e.gateway_addr)
                }))) : (t = n.gatewayAddr, m.socket = Ue(t, {sid: m.joinInfo.sid, clientId: m.clientId}), m.socket.on("onUplinkStats", function (e) {
                    m.OutgoingAvailableBandwidth = e.uplink_available_bandwidth, m.localStreams[m.uid] && (m.localStreams[m.uid].uplinkStats = e)
                }), m.socket.on("connect", function () {
                    var e, t;
                    m.dispatchEvent({type: "connected"}), m.attemps = 1, g(((t = e = n).uni_lbs_ip && (t = A()(e, {
                        wanip: e.uni_lbs_ip,
                        hasChange: m.hasChangeBGPAddress
                    })), {_type: "token", message: t}), m.onConnect, r)
                }), m.socket.on("recover", function () {
                    m.state = p, I.default.debug("[".concat(m.clientId, "] Try to reconnect choose server and get gateway list again ")), He(m.joinInfo, function (e) {
                        m.socket.replaceHost(e.gateway_addr)
                    })
                }), m.socket.on("disconnect", function (e) {
                    if (m.state !== d) {
                        m.state = d;
                        var t = C({type: "error", reason: U});
                        if (m.dispatchEvent(t), 0 === m.p2ps.size ? m.reconnectMode = "tryNext" : m.reconnectMode = "retry", s(), 1 != i) {
                            var n, r = (n = m.attemps, 1e3 * Math.min(30, Math.pow(2, n) - 1));
                            I.default.error("[".concat(m.clientId, "] Disconnect from server [").concat(JSON.stringify(e), "], attempt to recover [#").concat(m.attemps, "] after ").concat(r / 1e3, " seconds")), setTimeout(function () {
                                m.attemps++, m.state = p, h()
                            }, r)
                        }
                    }
                }), m.socket.on("onAddAudioStream", function (e) {
                    if (I.default.info("[".concat(m.clientId, "] Newly added audio stream with uid ").concat(e.id)), m.joinInfo.stringUid && "string" != typeof e.id && I.default.error("StringUID is Mixed with UintUID"), m.remoteStreamsInChannel.has(e.id) || m.remoteStreamsInChannel.add(e.id), void 0 === m.remoteStreams[e.id]) {
                        var t = Pe({streamID: e.id, local: !1, audio: e.audio, video: e.video, screen: e.screen, attributes: e.attributes});
                        t.peerMuteVideo = !0, m.remoteStreams[e.id] = t;
                        var n = C({type: "stream-added", stream: t});
                        m.dispatchEvent(n)
                    }
                }), m.socket.on("onUpdateStream", function (e) {
                    var t = m.remoteStreams[e.id];
                    if (m.joinInfo.stringUid && "string" != typeof e.id && I.default.error("StringUID is Mixed with UintUID"), t) {
                        delete e.id, t.audio = e.audio, t.video = e.video, t.screen = e.screen, t.pc && m._adjustPCMuteStatus(t);
                        var n = C({type: "stream-updated", stream: t});
                        m.dispatchEvent(n)
                    } else I.default.debug("[".concat(m.clientId, "] Ignoring onUpdateStream event before onAddStream for uid ").concat(e.id))
                }), m.socket.on("onAddVideoStream", function (e) {
                    if (I.default.info("[".concat(m.clientId, "] Newly added remote stream with uid ").concat(e.id, ".")), m.joinInfo.stringUid && "string" != typeof e.id && I.default.error("StringUID is Mixed with UintUID"), m.remoteStreamsInChannel.has(e.id) || m.remoteStreamsInChannel.add(e.id), void 0 === m.remoteStreams[e.id]) {
                        var t = Pe({streamID: e.id, local: !1, audio: e.audio, video: e.video, screen: e.screen, attributes: e.attributes});
                        m.remoteStreams[e.id] = t;
                        var n = C({type: "stream-added", stream: t});
                        m.dispatchEvent(n)
                    } else {
                        var r = m.remoteStreams[e.id];
                        if (r.peerMuteVideo = !1, r.video = !0, void 0 !== r.stream) {
                            if ((t = m.remoteStreams[e.id]).pc && m._adjustPCMuteStatus(t), I.default.info("[".concat(m.clientId, "] Stream changed: enable video ").concat(e.id)), t.isPlaying()) {
                                var i = t.player.elementID;
                                t.stop(), t.play(i, t.playOptions)
                            }
                        } else r.p2pId ? m.remoteStreams[e.id].video = !0 : (t = Pe({
                            streamID: e.id,
                            local: !1,
                            audio: !0,
                            video: !0,
                            screen: !1,
                            attributes: e.attributes
                        }), m.remoteStreams[e.id] = t, I.default.info("[".concat(m.clientId, "] Stream changed: modify video ").concat(e.id)))
                    }
                }), m.socket.on("onRemoveStream", function (e) {
                    m.remoteStreamsInChannel.has(e.id) && m.remoteStreamsInChannel.delete(e.id);
                    var t = m.remoteStreams[e.id];
                    if (t) {
                        delete m.remoteStreams[e.id];
                        var n = C({type: "stream-removed", stream: t});
                        m.dispatchEvent(n), t.close(), void 0 !== t.pc && (t.pc.close(), t.pc = void 0, m.p2ps.delete(t.p2pId))
                    } else console.log("ERROR stream ", e.id, " not found onRemoveStream ", e)
                }), m.socket.on("onPublishStream", function (e) {
                    var t = m.localStreams[e.id], n = C({type: "streamPublished", stream: t});
                    m.dispatchEvent(n)
                }), m.socket.on("mute_audio", function (e) {
                    I.default.info("[".concat(m.clientId, "] rcv peer mute audio: ").concat(e.peerid));
                    var t = E({type: "mute-audio", uid: e.peerid}), n = m.remoteStreams[e.peerid];
                    n ? (n.peerMuteAudio = !0, n.pc && m._adjustPCMuteStatus(n)) : I.default.debug("Ignoring event ".concat(e.type), e), m.dispatchEvent(t)
                }), m.socket.on("unmute_audio", function (e) {
                    I.default.info("[".concat(m.clientId, "] rcv peer unmute audio: ").concat(e.peerid));
                    var t = E({type: "unmute-audio", uid: e.peerid}), n = m.remoteStreams[e.peerid];
                    n ? (n.peerMuteAudio = !1, n.pc && m._adjustPCMuteStatus(n)) : I.default.debug("Ignoring event ".concat(e.type), e), m.dispatchEvent(t)
                }), m.socket.on("mute_video", function (e) {
                    I.default.info("[".concat(m.clientId, "] rcv peer mute video: ").concat(e.peerid));
                    var t = E({type: "mute-video", uid: e.peerid}), n = m.remoteStreams[e.peerid];
                    n ? (n.peerMuteVideo = !0, n.pc && m._adjustPCMuteStatus(n)) : I.default.debug("Ignoring event ".concat(e.type), e), m.dispatchEvent(t)
                }), m.socket.on("unmute_video", function (e) {
                    I.default.info("[".concat(m.clientId, "] rcv peer unmute video: ").concat(e.peerid));
                    var t = E({type: "unmute-video", uid: e.peerid}), n = m.remoteStreams[e.peerid];
                    n ? (n.peerMuteVideo = !1, n.pc && m._adjustPCMuteStatus(n)) : I.default.debug("Ignoring event ".concat(e.type), e), m.dispatchEvent(t)
                }), m.socket.on("user_banned", function (e) {
                    I.default.info("[".concat(m.clientId, "] user banned uid: ").concat(e.id, " error: ").concat(e.errcode));
                    var t = E({type: "client-banned", uid: e.id, attr: e.errcode});
                    m.dispatchEvent(t), i = !0
                }), m.socket.on("stream_fallback", function (e) {
                    I.default.info("[".concat(m.clientId, "] stream fallback uid: ").concat(e.id, " peerId: ").concat(e.peerid, " type: ").concat(e.type));
                    var t = E({type: "stream-fallback", uid: e.id, stream: e.peerid, attr: e.type});
                    m.dispatchEvent(t)
                }), m.socket.on("stream_recover", function (e) {
                    I.default.info("[".concat(m.clientId, "] stream recover uid: ").concat(e.id, " peerId: ").concat(e.peerid, " type: ").concat(e.type));
                    var t = E({type: "stream-recover", uid: e.id, stream: e.peerid, attr: e.type});
                    m.dispatchEvent(t)
                }), m.socket.on("onP2PLost", function (e) {
                    I.default.debug("[".concat(m.clientId, "] p2plost: "), e, "p2ps:", m.p2ps);
                    var t, n = "DTLS failed";
                    (t = m.localStreams[e.uid] || m.remoteStreams[e.uid]) ? (t.pc && t.pc.offerCandidates && 0 === t.pc.offerCandidates.length && (n = "NO_CANDIDATES_IN_OFFER"), "publish" === e.event && w.b.publish(m.joinInfo.sid, {
                        lts: t.publishLTS,
                        succ: !1,
                        audioName: t.hasAudio() && t.audioName,
                        videoName: t.hasVideo() && t.videoName,
                        screenName: t.hasScreen() && t.screenName,
                        ec: n
                    }), "subscribe" === e.event && w.b.subscribe(m.joinInfo.sid, {
                        lts: t.subscribeLTS,
                        succ: !1,
                        video: t.subscribeOptions && t.subscribeOptions.video,
                        audio: t.subscribeOptions && t.subscribeOptions.audio,
                        peerid: e.uid + "",
                        ec: n
                    })) : I.default.warning("P2PLost Stream Not found", e), I.default.debug("[".concat(m.clientId, "] p2plost:"), e.p2pid), (t = m.p2ps.get(e.p2pid)) && (m.p2ps.delete(e.p2pid), t.local ? m.dispatchEvent(E({
                        type: "pubP2PLost",
                        stream: t,
                        attr: n
                    })) : m.remoteStreams[t.getId()] && m.dispatchEvent(E({type: "subP2PLost", stream: t, attr: n})))
                }), m.socket.on("onTokenPrivilegeWillExpire", function (e) {
                    I.default.debug("[".concat(m.clientId, "] Received Message onTokenPrivilegeWillExpire")), m.dispatchEvent(E({type: "onTokenPrivilegeWillExpire"}))
                }), m.socket.on("onTokenPrivilegeDidExpire", function () {
                    I.default.warning("[".concat(m.clientId, "] Received Message onTokenPrivilegeDidExpire, please get new token and join again")), m.closeGateway(), m.dispatchEvent(E({type: "onTokenPrivilegeDidExpire"}))
                }), m._doWithAction = function (e, t, n) {
                    var r, i, o, a;
                    "tryNext" === e ? (o = t, a = n, I.default.debug("[".concat(m.clientId, "] Connect next gateway")), m.state = d, m.socket.close(), s(), m.reconnectMode = "tryNext", h(o, a)) : "retry" === e ? (r = t, i = n, I.default.debug("[".concat(m.clientId, "] Reconnect gateway")), m.state = d, m.socket.close(), s(), m.reconnectMode = "retry", h(r, i)) : "quit" === e ? (I.default.debug("[".concat(m.clientId, "] quit gateway")), m.state = d, m.socket.close(), s()) : "recover" === e && (I.default.debug("[".concat(m.clientId, "] Reconnect gateway")), m.state = d, m.socket.close(), s(), m.reconnectMode = "recover", h())
                }, m.socket.on("notification", function (e) {
                    if (I.default.debug("[".concat(m.clientId, "] Receive notification: "), e), "ERR_JOIN_BY_MULTI_IP" === P[e.code]) return m.dispatchEvent({
                        type: "onMultiIP",
                        arg: e
                    });
                    e.detail ? m._doWithAction(Ge[P[e.code]]) : e.action && m._doWithAction(e.action)
                }), m.socket.on("onPeerLeave", function (e) {
                    var t = E({type: "peer-leave", uid: e.id});
                    if (m.remoteStreamsInChannel.has(e.id) && m.remoteStreamsInChannel.delete(e.id), m.remoteStreams.hasOwnProperty(e.id) && (t.stream = m.remoteStreams[e.id]), m.dispatchEvent(t), m.remoteStreams.hasOwnProperty(e.id)) {
                        I.default.info("[".concat(m.clientId, "] closing stream on peer leave"), e.id);
                        var n = m.remoteStreams[e.id];
                        n.close(), delete m.remoteStreams[e.id], void 0 !== n.pc && (n.pc.close(), n.pc = void 0, m.p2ps.delete(n.p2pId))
                    }
                    m.timers.hasOwnProperty(e.id) && (clearInterval(m.timers[e.id]), clearInterval(m.timers[e.id] + "_RelatedStats"), delete m.timers[e.id]), null != m.audioLevel[e.id] && delete m.audioLevel[e.id], null != m.timer_counter[e.id] && delete m.timer_counter[e.id]
                }), m.socket.on("onUplinkStats", function (e) {
                }), m.socket.on("liveStreamingStarted", function (e) {
                    var t = k({type: "liveStreamingStarted", url: e.url});
                    m.dispatchEvent(t)
                }), m.socket.on("liveStreamingFailed", function (e) {
                    var t = k({type: "liveStreamingFailed", url: e.url});
                    m.dispatchEvent(t)
                }), m.socket.on("liveStreamingStopped", function (e) {
                    var t = k({type: "liveStreamingStopped", url: e.url});
                    m.dispatchEvent(t)
                }), m.socket.on("liveTranscodingUpdated", function (e) {
                    var t = k({type: "liveTranscodingUpdated", reason: e.reason});
                    m.dispatchEvent(t)
                }), m.socket.on("streamInjectedStatus", function (e) {
                    var t = k({type: "streamInjectedStatus", url: e.url, uid: e.uid, status: e.status});
                    m.dispatchEvent(t)
                }), m.socket.on("onUserOnline", function (e) {
                    m.joinInfo.stringUid && "string" != typeof e.id && I.default.error("StringUID is Mixed with UintUID"), m.dispatchEvent({
                        type: "peer-online",
                        uid: e.id
                    })
                }))
            }, g = function (e, n, r) {
                if (void 0 === m.socket) return I.default.error("[".concat(m.clientId, "] No socket available")), void a(r, M);
                try {
                    m.socket.emitSimpleMessage(e, function (e, t) {
                        "success" === e ? "function" == typeof n && n(t) : "function" == typeof r && r(P[t] || t)
                    })
                } catch (n) {
                    I.default.error("[".concat(m.clientId, "] Socket emit message failed ").concat(JSON.stringify(e))), I.default.error("[".concat(m.clientId, "] "), n), a(r, j)
                }
            }, y = function (e, n) {
                if (void 0 !== m.socket) try {
                    m.socket.emitSimpleMessage(e, function (e, t) {
                        n && n(e, t)
                    })
                } catch (e) {
                    I.default.error("[".concat(m.clientId, "] Error in sendSimpleSdp [").concat(e, "]"))
                } else I.default.error("[".concat(m.clientId, "] Error in sendSimpleSdp [socket not ready]"))
            }, S = function () {
                for (var e in m.localStreams) if (void 0 !== m.localStreams[e]) {
                    var t = m.localStreams[e];
                    delete m.localStreams[e], void 0 !== t.pc && (t.pc.close(), t.pc = void 0)
                }
            }, b = function () {
                for (var e in m.remoteStreamsInChannel.clear(), m.remoteStreams) if (m.remoteStreams.hasOwnProperty(e)) {
                    var t = m.remoteStreams[e];
                    t.isPlaying() && t.stop(), t.close(), delete m.remoteStreams[e], void 0 !== t.pc && (t.pc.close(), t.pc = void 0)
                }
            };
            return m
        }, Xe = {
            _gatewayClients: {}, register: function (e, t) {
                if (!t.uid) {
                    var n = "NO_UID_PROVIDED";
                    return I.default.error("[".concat(e.clientId, "] "), n, t), n
                }
                if (t.cname) return this._gatewayClients[t.cname] && this._gatewayClients[t.cname][t.uid] && this._gatewayClients[t.cname][t.uid] !== e ? (n = "UID_CONFLICT", I.default.error("[".concat(e.clientId, "] "), n, t), n) : (I.default.debug("[".concat(e.clientId, "] register client Channel"), t.cname, "Uid", t.uid), this._gatewayClients[t.cname] || (this._gatewayClients[t.cname] = {}), this._gatewayClients[t.cname][t.uid] = e, null);
                n = "NO_CHANNEL_PROVIDED";
                return I.default.error("[".concat(e.clientId, "] "), n, t), n
            }, unregister: function (e) {
                var t = e && e.uid, n = e.joinInfo && e.joinInfo.cname;
                if (!t || !n) {
                    var r = "INVALID_GATEWAYCLIENT";
                    return I.default.error("[".concat(e.clientId, "] "), r), r
                }
                if (this._gatewayClients[n] && this._gatewayClients[n][t]) return this._gatewayClients[n][t] !== e ? (r = "GATEWAYCLIENT_UID_CONFLICT", I.default.error("[".concat(e.clientId, "] "), r), r) : (I.default.debug("[".concat(e.clientId, "] unregister client "), e.uid), delete this._gatewayClients[n][t], null);
                r = "GATEWEAY_CLIENT_UNREGISTERED";
                I.default.error("[".concat(e.clientId, "] "), r)
            }
        };
        Qe.DISCONNECTED = 0, Qe.CONNECTING = 1, Qe.CONNECTED = 2, Qe.DISCONNECTING = 3, Qe.connetionStateMap = {
            0: "DISCONNECTED",
            1: "CONNECTING",
            2: "CONNECTED",
            3: "DISCONNECTING"
        };
        var $e = Qe, Ze = function (e) {
            var t;
            switch (e) {
                case"120p":
                case"120p_1":
                    t = ["120p_1", "120p_1", "120p_1"];
                    break;
                case"120p_3":
                    t = ["120p_3", "120p_3", "120p_3"];
                    break;
                case"180p":
                case"180p_1":
                    t = ["90p_1", "90p_1", "180p_1"];
                    break;
                case"180p_3":
                    t = ["120p_3", "120p_3", "180p_3"];
                    break;
                case"180p_4":
                    t = ["120p_1", "120p_1", "180p_4"];
                    break;
                case"240p":
                case"240p_1":
                    t = ["120p_1", "120p_1", "240p_1"];
                    break;
                case"240p_3":
                    t = ["120p_3", "120p_3", "240p_3"];
                    break;
                case"240p_4":
                    t = ["120p_4", "120p_4", "240p_4"];
                    break;
                case"360p":
                case"360p_1":
                case"360p_4":
                case"360p_9":
                case"360p_10":
                case"360p_11":
                    t = ["90p_1", "90p_1", "360p_1"];
                    break;
                case"360p_3":
                case"360p_6":
                    t = ["120p_3", "120p_3", "360p_3"];
                    break;
                case"360p_7":
                case"360p_8":
                    t = ["120p_1", "120p_1", "360p_7"];
                    break;
                case"480p":
                case"480p_1":
                case"480p_2":
                case"480p_4":
                case"480p_10":
                    t = ["120p_1", "120p_1", "480p_1"];
                    break;
                case"480p_3":
                case"480p_6":
                    t = ["120p_3", "120p_3", "480p_3"];
                    break;
                case"480p_8":
                case"480p_9":
                    t = ["120p_4", "120p_4", "480p_8"];
                    break;
                case"720p":
                case"720p_1":
                case"720p_2":
                case"720p_3":
                    t = ["90p_1", "90p_1", "720p_1"];
                    break;
                case"720p_5":
                case"720p_6":
                    t = ["120p_1", "120p_1", "720p_5"];
                    break;
                case"1080p":
                case"1080p_1":
                case"1080p_2":
                case"1080p_3":
                case"1080p_5":
                    t = ["90p_1", "90p_1", "1080p_1"];
                    break;
                case"1440p":
                case"1440p_1":
                case"1440p_2":
                    t = ["90p_1", "90p_1", "1440p_1"];
                    break;
                case"4k":
                case"4k_1":
                case"4k_3":
                    t = ["90p_1", "90p_1", "4k_1"];
                    break;
                default:
                    t = ["120p_1", "120p_1", "360p_7"]
            }
            return Object(R.isOpera)() ? [e, 15, 50] : Object(R.isFireFox)() ? [t[1], 15, 100] : Object(R.isSafari)() ? [t[2], 15, 50] : [t[0], 15, 50]
        }, et = {
            1001: "FRAMERATE_INPUT_TOO_LOW",
            1002: "FRAMERATE_SENT_TOO_LOW",
            1003: "SEND_VIDEO_BITRATE_TOO_LOW",
            1005: "RECV_VIDEO_DECODE_FAILED",
            2001: "AUDIO_INPUT_LEVEL_TOO_LOW",
            2002: "AUDIO_OUTPUT_LEVEL_TOO_LOW",
            2003: "SEND_AUDIO_BITRATE_TOO_LOW",
            2005: "RECV_AUDIO_DECODE_FAILED",
            3001: "FRAMERATE_INPUT_TOO_LOW_RECOVER",
            3002: "FRAMERATE_SENT_TOO_LOW_RECOVER",
            3003: "SEND_VIDEO_BITRATE_TOO_LOW_RECOVER",
            3005: "RECV_VIDEO_DECODE_FAILED_RECOVER",
            4001: "AUDIO_INPUT_LEVEL_TOO_LOW_RECOVER",
            4002: "AUDIO_OUTPUT_LEVEL_TOO_LOW_RECOVER",
            4003: "SEND_AUDIO_BITRATE_TOO_LOW_RECOVER",
            4005: "RECV_AUDIO_DECODE_FAILED_RECOVER"
        }, tt = {
            FramerateInput: 1001,
            FramerateSent: 1002,
            SendVideoBitrate: 1003,
            VideoDecode: 1005,
            AudioIntputLevel: 2001,
            AudioOutputLevel: 2002,
            SendAudioBitrate: 2003,
            AudioDecode: 2005
        }, nt = function (a) {
            var c = {remoteStreamStorage: {}, localStreamStorage: {}};
            return c.gatewayClient = a, c.checkAudioOutputLevel = function (e) {
                return !(e && 0 < parseInt(e.audioRecvBytesDelta) && 0 < parseInt(e.audioDecodingNormalDelta) && 0 === parseInt(e.audioOutputLevel))
            }, c.checkAudioIntputLevel = function (e) {
                return !e || 0 !== parseInt(e.audioInputLevel)
            }, c.checkFramerateInput = function (e, t) {
                if (!e || !t.attributes) return !0;
                var n = parseInt(t.attributes.maxFrameRate), r = parseInt(e.googFrameRateInput);
                return !n || !r || !(10 < n && r < 5 || n < 10 && 5 <= n && r <= 1)
            }, c.checkFramerateSent = function (e) {
                return !(e && 5 < parseInt(e.googFrameRateInput) && parseInt(e.googFrameRateSent) <= 1)
            }, c.checkSendVideoBitrate = function (e) {
                return !e || 0 !== parseInt(e.videoSendBytesDelta)
            }, c.checkSendAudioBitrate = function (e) {
                return !e || 0 !== parseInt(e.audioSendBytesDelta)
            }, c.checkVideoDecode = function (e) {
                return !e || 0 === parseInt(e.videoRecvBytesDelta) || 0 !== parseInt(e.googFrameRateDecoded)
            }, c.checkAudioDecode = function (e) {
                return !e || 0 === parseInt(e.audioRecvBytesDelta) || 0 !== parseInt(e.audioDecodingNormalDelta)
            }, c.record = function (e, t, n, r, i) {
                n[e] || (n[e] = {isPrevNormal: !0, record: []});
                var o = n[e], a = c["check" + e](t, i);
                if (o.record.push(a), 5 <= o.record.length) {
                    o.isCurNormal = -1 !== o.record.indexOf(!0);
                    var s = tt[e];
                    o.isPrevNormal && !o.isCurNormal && c.gatewayClient.dispatchEvent({
                        type: "exception",
                        code: s,
                        msg: et[s],
                        uid: r
                    }), !o.isPrevNormal && o.isCurNormal && c.gatewayClient.dispatchEvent({
                        type: "exception",
                        code: s + 2e3,
                        msg: et[s + 2e3],
                        uid: r
                    }), o.isPrevNormal = o.isCurNormal, o.record = []
                }
            }, c.setLocalStats = function (i) {
                var o = {};
                Object.keys(i).map(function (e) {
                    var t = i[e], n = c.gatewayClient.localStreams[parseInt(e)], r = c.localStreamStorage[e] || {};
                    n && n.hasVideo() && (c.record("SendVideoBitrate", t.videoStats, r, e), c.record("FramerateInput", t.videoStats, r, e, n), c.record("FramerateSent", t.videoStats, r, e)), n && n.hasAudio() && (c.record("AudioIntputLevel", t.audioStats, r, e), c.record("SendAudioBitrate", t.audioStats, r, e)), o[e] = r
                }), c.localStreamStorage = o
            }, c.setRemoteStats = function (i) {
                var o = {};
                Object.keys(i).map(function (e) {
                    var t = i[e], n = a.remoteStreams[e], r = c.remoteStreamStorage[e] || {};
                    n && n.hasVideo() && n.isPlaying() && c.record("VideoDecode", t.videoStats, r, e), n && n.hasAudio() && n.isPlaying() && (c.record("AudioOutputLevel", t.audioStats, r, e), c.record("AudioDecode", t.audioStats, r, e)), o[e] = r
                }), c.remoteStreamStorage = o
            }, c
        }, rt = new function () {
            var i = T();
            return i.states = {
                UNINIT: "UNINIT",
                INITING: "INITING",
                INITED: "INITED"
            }, i.state = i.states.UNINIT, i.type = null, i.lastConnectedAt = null, i.lastDisconnectedAt = null, i.lastTypeChangedAt = null, i.networkChangeTimer = null, i._init = function (e, t) {
                if (i.state = i.states.INITING, navigator.connection && navigator.connection.addEventListener) {
                    var n = i._getNetworkInfo();
                    i.type = n && n.type, i.state = i.states.INITED, e && e()
                } else i.state = i.states.UNINIT, t && t("DO_NOT_SUPPORT")
            }, i._getNetworkInfo = function () {
                return navigator.connection
            }, i._reloadNetworkInfo = function () {
                var e = i._getNetworkInfo(), t = e && e.type || "UNSUPPORTED", n = Date.now();
                if (t !== i.type) {
                    i.lastTypeChangedAt = n, "none" == t ? i.lastDisconnectedAt = n : "none" == i.type && (i.lastConnectedAt = n);
                    var r = {type: "networkTypeChanged", networkType: i.type = t};
                    i.dispatchEvent(r)
                }
            }, i.getStats = function (e, t) {
                var n = {}, r = i._getNetworkInfo();
                r && (n.NetworkType = r.type || "UNSUPPORTED"), setTimeout(function () {
                    e(n)
                }, 0)
            }, i._init(function () {
                navigator.connection.addEventListener("change", function () {
                    i._reloadNetworkInfo()
                }), i.networkChangeTimer = setInterval(function () {
                    i._reloadNetworkInfo()
                }, 5e3)
            }, function (e) {
            }), i
        }, it = {
            width: 640,
            height: 360,
            videoBitrate: 400,
            videoFramerate: 15,
            lowLatency: !1,
            audioSampleRate: 48e3,
            audioBitrate: 48,
            audioChannels: 1,
            videoGop: 30,
            videoCodecProfile: 100,
            userCount: 0,
            userConfigExtraInfo: {},
            backgroundColor: 0,
            transcodingUsers: []
        }, ot = {
            width: 0,
            height: 0,
            videoGop: 30,
            videoFramerate: 15,
            videoBitrate: 400,
            audioSampleRate: 44100,
            audioBitrate: 48,
            audioChannels: 1
        }, at = fe.getDevices, st = ae, ct = JSON.parse(JSON.stringify(_.SUPPORT_RESOLUTION_LIST));
        t.default = {
            TranscodingUser: {uid: 0, x: 0, y: 0, width: 0, height: 0, zOrder: 0, alpha: 1},
            LiveTranscoding: it,
            createClient: function (t) {
                var e = w.b.reportApiInvoke(null, {name: "createClient", options: arguments, tag: "tracer"});
                (t = A()({}, t || {})).codec || (t.codec = function (e) {
                    switch (t.mode) {
                        case"h264_interop":
                            return "h264";
                        default:
                            return "vp8"
                    }
                }());
                var n,
                    r = (n = t, -1 === Ne.indexOf(n.mode) ? s : -1 === Me.indexOf(n.codec) ? c : "h264_interop" == n.mode && "h264" !== n.codec && d);
                if (r) throw I.default.error("Invalid parameter setting MODE: ".concat(t.mode, " CODEC: ").concat(t.codec, " ERROR ").concat(r)), e(r), new Error(r);
                return I.default.info("Creating client, MODE: ".concat(t.mode, " CODEC: ").concat(t.codec)), function (e) {
                    switch (e.mode) {
                        case"interop":
                        case"h264_interop":
                            e.mode = "live";
                            break;
                        case"web-only":
                            e.mode = "rtc"
                    }
                }(t), e(null, t), function (h) {
                    var t, i, e, f, v = {
                        key: void 0,
                        highStream: null,
                        lowStream: null,
                        lowStreamParameter: null,
                        isDualStream: !1,
                        highStreamState: 2,
                        lowStreamState: 2,
                        proxyServer: null,
                        turnServer: {},
                        useProxyServer: !1
                    };
                    return v.mode = h.mode, v.clientId = Object(le.b)().slice(0, 5), v.uintUid = null, h = A()({}, h), v.aespassword = null, v.aesmode = "none", v.hasPublished = !1, v.getConnectionState = function () {
                        var e = w.b.reportApiInvoke(h.sessionId, {name: "Client.getConnectionState", options: arguments, tag: "tracer"}),
                            t = $e.connetionStateMap[v.gatewayClient.state];
                        return e(), t
                    }, v.setClientRole = function (e, t) {
                        var n = w.b.reportApiInvoke(h.sessionId, {callback: t, name: "Client.setClientRole", options: arguments, tag: "tracer"});
                        if (ve(e, "setClientRole", ["host", "audience"]), "rtc" === v.mode) {
                            var r = "RTC mode can not use setClientRole";
                            return I.default.warning("[".concat(v.clientId, "] ").concat(r)), n && n(r)
                        }
                        v.gatewayClient && v.gatewayClient.state === $e.CONNECTED ? ("audience" === e && (0 === this.highStreamState ? this._unpublish(this.highStream, function () {
                            n && n(null, {role: e})
                        }, function (e) {
                            n && n(e)
                        }) : v.gatewayClient.setClientRole("audience", n)), "host" === e && v.gatewayClient.setClientRole("host", n)) : (v.gatewayClient.role = e, n && n(null, {role: e}))
                    }, v.getGatewayInfo = function (t) {
                        if (v.gatewayClient.state !== $e.CONNECTED) {
                            var e = "Client is not in connected state";
                            return I.default.error("[".concat(v.clientId, "] ").concat(e)), void t(e)
                        }
                        v.gatewayClient.getGatewayInfo(function (e) {
                            t(null, e)
                        }, t)
                    }, v.renewToken = function (e, n, r) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return r && r(e);
                                n && n(t)
                            }, name: "Client.renewToken", options: arguments, tag: "tracer"
                        });
                        if (!Te(e)) throw new Error("Invalid token: Token is of the string type .Length of the string: [1,255]. ASCII characters only.");
                        return v.gatewayClient ? v.key ? (v.key = e, void v.gatewayClient.renewToken(e, function (e) {
                            return t(null, e)
                        }, t)) : (I.default.error("[".concat(v.clientId, "] renewToken should not be called before user join")), t(M)) : (I.default.error("[".concat(v.clientId, "] renewToken Failed. GatewayClient not Exist")), t(M))
                    }, v.setLowStreamParameter = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.setLowStreamParameter", options: arguments, tag: "tracer"});
                        ge(e, "param");
                        var n = e.width, r = e.height, i = e.framerate, o = e.bitrate;
                        ke(n) || Se(n, "width"), ke(r) || Se(r, "height"), ke(i) || Se(i, "framerate"), ke(o) || Se(o, "bitrate", 1, 1e7), (!n && r || n && !r) && I.default.warning("[".concat(v.clientId, "] The width and height parameters take effect only when both are set")), v.lowStreamParameter = e, t()
                    }, v.init = function (e, n, r) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return r && r(e);
                                n && n(t)
                            }, name: "Client.init", options: arguments, tag: "tracer"
                        });
                        ye(e), Object(R.isChromeKernel)() && Object(R.getChromeKernelVersion)() <= 48 ? r ? t(X) : Object(le.f)() : (I.default.info("[".concat(v.clientId, "] Initializing AgoraRTC client, appId: ").concat(e, ".")), h.appId = e, h.sessionId = Object(le.b)(), t())
                    }, v.setTurnServer = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.setTurnServer", options: arguments, tag: "tracer"});
                        if (v.gatewayClient && v.gatewayClient.state !== $e.DISCONNECTED) throw new Error("Set turn server before join channel");
                        if (v.useProxyServer) throw new Error("You have already set the proxy");
                        ge(e, "turnServer");
                        var n = e.turnServerURL, r = e.username, i = e.password, o = e.udpport, a = e.forceturn, s = e.tcpport;
                        ye(n, "turnServerURL"), ye(r, "username"), ye(i, "password"), ye(o, "udpport"), ke(a) || be(a, "forceturn"), v.turnServer.url = n, v.turnServer.udpport = o, v.turnServer.username = r, v.turnServer.credential = i, v.turnServer.forceturn = a || !1, ke(s) || (ye(s, "tcpport"), v.turnServer.tcpport = s, I.default.info("[".concat(v.clientId, "] Set turnserver tcpurl. ").concat(v.turnServer.url, ":").concat(v.turnServer.tcpport))), I.default.info("[".concat(v.clientId, "] Set turnserver udpurl. ").concat(v.turnServer.url, ":").concat(v.turnServer.udpport, ",username: ").concat(v.turnServer.uername, ",password: ").concat(v.turnServer.credential)), t()
                    }, v.setProxyServer = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.setProxyServer", options: arguments, tag: "tracer"});
                        if (v.gatewayClient && v.gatewayClient.state !== $e.DISCONNECTED) throw new Error("Set proxy server before join channel");
                        if (!e) throw new Error("Do not set the proxyServer parameter as empty");
                        if (v.useProxyServer) throw new Error("You have already set the proxy");
                        ye(e, "proxyServer"), v.proxyServer = e, w.b.setProxyServer(e), I.default.setProxyServer(e), t()
                    }, v.startProxyServer = function () {
                        var e = w.b.reportApiInvoke(h.sessionId, {name: "Client.startProxyServer", options: arguments, tag: "tracer"});
                        if (v.gatewayClient && v.gatewayClient.state !== $e.DISCONNECTED) throw new Error("Start proxy server before join channel");
                        if (v.proxyServer || v.turnServer.url) throw new Error("You have already set the proxy");
                        v.useProxyServer = !0, e()
                    }, v.stopProxyServer = function () {
                        var e = w.b.reportApiInvoke(h.sessionId, {name: "Client.stopProxyServer", options: arguments, tag: "tracer"});
                        if (v.gatewayClient && v.gatewayClient.state !== $e.DISCONNECTED) throw new Error("Stop proxy server after leave channel");
                        w.b.setProxyServer(), I.default.setProxyServer(), v.turnServer = {}, v.proxyServer = null, v.useProxyServer = !1, e()
                    }, v.setEncryptionSecret = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.setEncryptionSecret", options: arguments, tag: "tracer"});
                        ye(e, "password"), v.aespassword = e, t()
                    }, v.setEncryptionMode = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.setEncryptionMode", options: arguments, tag: "tracer"});
                        if (ye(e, "encryptionMode"), -1 === xe.indexOf(e)) throw new Error('Invalid encryptionMode: encryptionMode should be "aes-128-xts" | "aes-256-xts" | "aes-128-ecb"');
                        v.aesmode = e, t()
                    }, v.configPublisher = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.configPublisher", options: arguments, tag: "tracer"});
                        ge(e, "config");
                        var n = e.width, r = e.height, i = e.framerate, o = e.bitrate, a = e.publisherUrl;
                        Se(n, "width"), Se(r, "height"), Se(i, "framerate"), Se(o, "bitrate", 1, 1e7), a && ye(a, "publisherUrl"), v.gatewayClient.configPublisher(e), t()
                    }, v.enableDualStream = function (n, r) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return r && r(e);
                                n && n(t)
                            }, name: "Client.enableDualStream", options: arguments, tag: "tracer"
                        });
                        return "iOS" === Object(R.getBrowserOS)() ? (w.b.streamSwitch(h.sessionId, {
                            lts: (new Date).getTime(),
                            isdual: !0,
                            succ: !1
                        }), t(p)) : Object(R.isWeChatBrowser)() ? (w.b.streamSwitch(h.sessionId, {
                            lts: (new Date).getTime(),
                            isdual: !0,
                            succ: !1
                        }), t(g)) : (w.b.streamSwitch(h.sessionId, {
                            lts: (new Date).getTime(),
                            isdual: !0,
                            succ: !0
                        }), v.isDualStream = !0, void (0 === v.highStreamState ? v._publishLowStream(function (e) {
                            return t(null, e)
                        }, function (e) {
                            I.default.warning("[".concat(v.clientId, "]"), e), t(z)
                        }) : 1 === v.highStreamState ? t(S) : t(null)))
                    }, v.disableDualStream = function (n, r) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return r && r(e);
                                n && n(t)
                            }, name: "Client.disableDualStream", options: arguments, tag: "tracer"
                        });
                        w.b.streamSwitch(h.sessionId, {
                            lts: (new Date).getTime(),
                            isdual: !1,
                            succ: !0
                        }), v.isDualStream = !1, 0 === v.highStreamState ? v._unpublishLowStream(function () {
                            v.highStream.lowStream = null, t()
                        }, function (e) {
                            I.default.warning("[".concat(v.clientId, "]"), e), t(Y)
                        }) : 1 === v.highStreamState ? t(S) : t()
                    }, v._createLowStream = function (o, a) {
                        if (v.highStream && v.highStream.stream) {
                            var s = A()({}, v.highStream.params);
                            if (s.streamID += 1, s.audio = !1, s.video) {
                                var e = v.highStream.stream.getVideoTracks()[0];
                                e ? fe.getVideoCameraIdByLabel(e.label, function (e) {
                                    s.cameraId = e;
                                    var t = new Pe(s);
                                    if (t.streamId = v.highStream.getId() + 1, v.lowStreamParameter) {
                                        var n = A()({}, v.lowStreamParameter);
                                        if (!n.width || !n.height) {
                                            var r = Ze(v.highStream.profile), i = _.SUPPORT_RESOLUTION_LIST[r[0]];
                                            n.width = i[0], n.height = i[1]
                                        }
                                        n.framerate = n.framerate || 5, n.bitrate = n.bitrate || 50, (Object(R.isSafari)() || Object(R.isOpera)()) && (I.default.debug("[".concat(v.clientId, "] Shimming lowStreamParameter")), i = _.SUPPORT_RESOLUTION_LIST[v.highStream.profile], n.width = i[0], n.height = i[1]), t.setVideoProfileCustomPlus(n)
                                    } else t.setVideoProfileCustom(Ze(v.highStream.profile));
                                    t.init(function () {
                                        v.highStream.lowStream = t, v.highStream.userMuteVideo && t.muteVideo(), o && o(t)
                                    }, a)
                                }, a) : a && a(K)
                            } else a && a(K)
                        } else a && a(K)
                    }, v._getLowStream = function (t, e) {
                        v.lowStream ? t(v.lowStream) : v._createLowStream(function (e) {
                            v.lowStream = e, t(v.lowStream)
                        }, e)
                    }, v._publishLowStream = function (t, n) {
                        return 2 !== v.lowStreamState ? n && n(q) : v.highStream && v.highStream.hasScreen() ? n && n(y) : void v._getLowStream(function (e) {
                            v.lowStreamState = 1, v.gatewayClient.publish(e, {streamType: 1}, function () {
                                v.lowStreamState = 0, t && t()
                            }, function (e) {
                                I.default.debug("[".concat(v.clientId, "] publish low stream failed")), n && n(e)
                            })
                        }, n)
                    }, v._unpublishLowStream = function (e, t) {
                        if (0 !== v.lowStreamState) return t && t(J);
                        v.lowStream && (v.gatewayClient.unpublish(v.lowStream, {streamType: 1}, function () {
                        }, function (e) {
                            I.default.debug("[".concat(v.clientId, "] unpublish low stream failed")), t && t(e)
                        }), v.lowStream.close(), v.lowStream = null, v.lowStreamState = 2, e && e())
                    }, v.join = function (n, r, e, i, o) {
                        var t, a = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return o && o(e);
                                i && i(t)
                            }, name: "Client.join", options: arguments, tag: "tracer"
                        });
                        if (n && !Te(n)) return I.default.warning("[".concat(v.clientId, "] Param channelKey should be string")), a(N);
                        if (!Oe(t = r) || !/^[a-zA-Z0-9!#$%&()+-:;<=.>?@[\]^_{}|~,\s]{1,64}$/.test(t)) return I.default.error("Invalid Channel Name ".concat(r)), I.default.warning("[".concat(v.clientId, "] The length must be within 64 bytes. The supported characters: a-z,A-Z,0-9,space,!, #, $, %, &, (, ), +, -, :, ;, <, =, ., >, ?, @, [, ], ^, _,  {, }, |, ~, ,")), a(N);
                        if ("string" == typeof r && "" === r) return I.default.warning("[".concat(v.clientId, "] Param channel should not be empty")), a(N);
                        if (e && !Object(le.c)(e) && !_e(e, 1, 255)) return I.default.error("Invalid UID ".concat(e, " ").concat(he()(e))), I.default.warning("[".concat(v.clientId, "] [String uid] Length of the string: [1,255]. ASCII characters only. [Number uid] The value range is [0,10000]")), a(N);
                        if ("string" == typeof e && 0 == e.length) return I.default.warning("[".concat(v.clientId, "] String uid should not be empty")), a(N);
                        if ("string" == typeof e && 256 < e.length) return I.default.warning("[".concat(v.clientId, "] Length of string uid should be less than 255")), a(N);
                        v.highStream = null, v.lowStream = null, v.lowStreamParameter = null, v.isDualStream = !1, v.highStreamState = 2, v.lowStreamState = 2;
                        var s = {
                            clientId: v.clientId,
                            appId: h.appId,
                            sid: h.sessionId,
                            cname: r,
                            uid: e,
                            turnServer: v.turnServer,
                            proxyServer: v.proxyServer,
                            token: n || h.appId,
                            useProxyServer: v.useProxyServer
                        };
                        if ("string" == typeof e && (s.stringUid = e, s.uid = v.uintUid || 0), v.aespassword && "none" !== v.aesmode && A()(s, {
                            aespassword: v.aespassword,
                            aesmode: v.aesmode
                        }), w.b.sessionInit(h.sessionId, {
                            lts: (new Date).getTime(),
                            cname: r,
                            appid: h.appId,
                            mode: h.mode,
                            succ: !0
                        }), v.onSuccess = function (e) {
                            v.rtcStatsCollector.startNetworkQualityTimer(), v.onSuccess = null, a(null, e)
                        }, v.onFailure = function (e) {
                            return a(e)
                        }, v.channel = r, v.gatewayClient.state !== $e.DISCONNECTED) return I.default.error("[".concat(v.clientId, "] Client already in connecting/connected state")), a(M), void w.b.joinGateway(h.sessionId, {
                            lts: Date.now(),
                            succ: !1,
                            ec: M,
                            addr: null
                        });
                        v.gatewayClient.state = $e.CONNECTING, He(s, function (e, t) {
                            I.default.info("[".concat(v.clientId, "] Joining channel: ").concat(r)), v.gatewayClient.dispatchEvent({
                                type: "config-distribute",
                                config: t,
                                joinInfo: s
                            }), v.key = n || h.appId, s.cid = e.cid, s.uid = e.uid, s.clientId = v.clientId, v.uintUid = e.uid, e.uni_lbs_ip && e.uni_lbs_ip[1] && (s.uni_lbs_ip = e.uni_lbs_ip[1]), s.gatewayAddr = e.gateway_addr, v.joinInfo = s, v.gatewayClient.join(s, v.key, function (e) {
                                I.default.info("[".concat(v.clientId, "] Join channel ").concat(r, " success, join with uid: ").concat(e, ".")), v.onSuccess = null, v.rtcStatsCollector.startNetworkQualityTimer(), a(null, e)
                            }, function (e) {
                                return a(e)
                            })
                        })
                    }, v.renewChannelKey = function (e, n, r) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return r && r(e);
                                n && n(t)
                            }, name: "Client.renewChannelKey", options: arguments, tag: "tracer"
                        });
                        ye(e, "key", 1, 2047), void 0 === v.key ? (I.default.error("[".concat(v.clientId, "] renewChannelKey should not be called before user join")), t(M)) : (v.key = e, v.gatewayClient.key = e, v.gatewayClient.rejoin(), t())
                    }, v.leave = function (r, i) {
                        var t = !1, n = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return i && i(e);
                                var n;
                                n = v.clientId, Fe[n] = !1, v._renewSession(), v.rtcStatsCollector.clearNetworkQualityTimer(), r && r(t)
                            }, name: "Client.leave", options: arguments, tag: "tracer"
                        });
                        I.default.info("[".concat(v.clientId, "] Leaving channel")), v.gatewayClient.leave(function (e) {
                            t = !0, n(null, e)
                        }, n), setTimeout(function () {
                            t || (v.gatewayClient.socket.close(), v.gatewayClient.socket = null, v.gatewayClient.state = $e.DISCONNECTED, n(null, "LEAVE_MSG_TIMEOUT"))
                        }, Object(_.getParameter)("LEAVE_MSG_TIMEOUT"))
                    }, v._renewSession = function () {
                        var e = Object(le.b)();
                        if (I.default.debug("renewSession ".concat(h.sessionId, " => ").concat(e)), h.sessionId = e, v.joinInfo && (v.joinInfo.sid = e), v.gatewayClient && (v.gatewayClient.joinInfo && (v.gatewayClient.joinInfo.sid = e), v.gatewayClient.localStreams)) for (var t in v.gatewayClient.localStreams) {
                            var n = v.gatewayClient.localStreams[t];
                            n && (n.sid = e)
                        }
                    }, v._publish = function (t, n, r) {
                        if (2 !== v.highStreamState) return I.default.warning("[".concat(v.clientId, "] Can't publish stream when stream already publish ").concat(t.getId())), r && r(u);
                        I.default.info("[".concat(v.clientId, "] Publishing stream, uid ").concat(t.getId())), v.highStream = t, v.highStreamState = 1, v.highStream.streamId = v.joinInfo.stringUid || v.joinInfo.uid, v.hasPublished = !1;
                        var i = function (e, t, n) {
                            v.gatewayClient.publish(e, {streamType: 0}, function () {
                                e.sid = h.sessionId, v.highStreamState = 0, I.default.info("[".concat(v.clientId, "] Publish success, uid: ").concat(e.getId())), v.isDualStream ? v._publishLowStream(function () {
                                    t && t()
                                }, function (e) {
                                    I.default.warning("[".concat(v.clientId, "] "), e), t && t()
                                }) : t && t()
                            }, n)
                        };
                        "audience" === v.gatewayClient.role && "live" === v.mode ? v.gatewayClient.setClientRole("host", function (e) {
                            if (e) return r && r(e);
                            i(t, n, r)
                        }) : i(t, n, r)
                    }, v._unpublish = function (t, n, r) {
                        if (0 !== v.highStreamState) return I.default.warning("[".concat(v.clientId, "] Can't unpublish stream when stream not publish")), r && r(l);
                        I.default.info("[".concat(v.clientId, "] Unpublish stream, uid ").concat(t.getId()));
                        var i = function (t, e, n) {
                            v.isDualStream && v.lowStream && v._unpublishLowStream(null, n), v.gatewayClient.unpublish(t, {streamType: 0}, function () {
                                v.highStreamState = 2, I.default.info("[".concat(v.clientId, "] Unpublish stream success, uid: ").concat(t.getId())), e && e()
                            }, function (e) {
                                I.default.info("[".concat(v.clientId, "] Unpublish stream fail, uid: ").concat(t.getId())), n && n(e)
                            })
                        };
                        "host" === v.gatewayClient.role && "live" === v.mode ? v.gatewayClient.setClientRole("audience", function (e) {
                            if (e) return r && r(e);
                            i(t, n, r)
                        }) : i(t, n, r)
                    }, v.publish = function (e, n) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return n && n(e)
                            }, name: "Client.publish", tag: "tracer", options: {stream: "too long to show", onFailure: !!n}
                        });
                        2 === v.highStreamState ? v._publish(e, function (e) {
                            return t(null, e)
                        }, function (e) {
                            return t(e)
                        }) : t(u)
                    }, v.unpublish = function (e, n, r) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return n && n(e);
                                r && r(t)
                            }, name: "Client.unpublish", tag: "tracer", options: {stream: "too long to show", onFailure: !!n}
                        });
                        0 === v.highStreamState ? v._unpublish(e, function (e) {
                            return t(null, e)
                        }, function (e) {
                            return t(e)
                        }) : t(l)
                    }, v.subscribe = function (e, t, n) {
                        var r = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return n && n(e)
                            }, name: "Client.subscribe", tag: "tracer", options: {stream: "too long to show", options: t, onFailure: !!n}
                        });
                        "function" == typeof t && (n = t, t = null), ge(e, "stream"), ke(t) || (ge(t, "options"), ke(t.video) || be(t.video, "options.video"), ke(t.audio) || be(t.audio, "options.audio"));
                        var i = {video: !0, audio: !0};
                        if (!ke(t)) {
                            if (Object(R.isSafari)() && (!t.video || !t.audio)) {
                                var o = "SAFARI_NOT_SUPPORTED_FOR_TRACK_SUBSCRIPTION";
                                return I.default.error("[".concat(v.clientId, "] "), o), void r(o)
                            }
                            if (!ke(t.video) && !we(t.video) || !ke(t.audio) && !we(t.audio) || !1 === t.audio && !1 === t.video) return o = "INVALID_PARAMETER ".concat(JSON.stringify(t)), I.default.error("[".concat(v.clientId, "] "), o), void r(o)
                        }
                        e.subscribeOptions ? (A()(e.subscribeOptions, i, t), v.gatewayClient.subscribeChange(e, function (e) {
                            return r(null, e)
                        }, r)) : (e.subscribeOptions = A()({}, i, t), v.gatewayClient.subscribe(e, function (e) {
                            return r(null, e)
                        }, r))
                    }, v.unsubscribe = function (e, n) {
                        var t = w.b.reportApiInvoke(h.sessionId, {
                            callback: function (e, t) {
                                if (e) return n && n(e)
                            }, name: "Client.unsubscribe", tag: "tracer", options: {stream: "too long to show", onFailure: !!n}
                        });
                        I.default.info("[".concat(v.clientId, "] Unsubscribe stream, uid: ").concat(e.getId())), v.gatewayClient.unsubscribe(e, function (e) {
                            return t(null, e)
                        }, t)
                    }, v.setRemoteVideoStreamType = function (e, t) {
                        var n = w.b.reportApiInvoke(h.sessionId, {
                            name: "Client.setRemoteVideoStreamType",
                            tag: "tracer",
                            options: {stream: "too long to show", streamType: t}
                        });
                        ve(t, "streamType", [0, 1]), v.gatewayClient.setRemoteVideoStreamType(e, t), n()
                    }, v.setStreamFallbackOption = function (e, t) {
                        var n = w.b.reportApiInvoke(h.sessionId, {
                            name: "Client.setStreamFallbackOption",
                            tag: "tracer",
                            options: {stream: "too long to show", fallbackType: t}
                        });
                        ve(t, "fallbackType", [0, 1, 2]), v.gatewayClient.setStreamFallbackOption(e, t), n()
                    }, v.startLiveStreaming = function (e, t) {
                        var n = w.b.reportApiInvoke(h.sessionId, {name: "Client.startLiveStreaming", options: arguments, tag: "tracer"});
                        ye(e, "url"), ke(t) || be(t, "transcodingEnabled"), v.gatewayClient.startLiveStreaming(e, t), n()
                    }, v.stopLiveStreaming = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.stopLiveStreaming", options: arguments, tag: "tracer"});
                        ye(e, "url"), v.gatewayClient.stopLiveStreaming(e), t()
                    }, v.setLiveTranscoding = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.setLiveTranscoding", options: arguments, tag: "tracer"});
                        ge(e, "transcoding");
                        var n = e.width, r = e.height, i = e.videoBitrate, o = e.videoFramerate, a = e.lowLatency, s = e.audioSampleRate,
                            c = e.audioBitrate, d = e.audioChannels, u = e.videoGop, l = e.videoCodecProfile, p = e.userCount, f = e.backgroundColor,
                            m = e.transcodingUsers;
                        if (ke(n) || Se(n, "width"), ke(r) || Se(r, "height"), ke(i) || Se(i, "videoBitrate", 1, 1e6), ke(o) || Se(o, "videoFramerate"), ke(a) || be(a, "lowLatency"), ke(s) || ve(s, "audioSampleRate", [32e3, 44100, 48e3]), ke(c) || Se(c, "audioBitrate", 1, 128), ke(d) || ve(d, "audioChannels", [1, 2, 3, 4, 5]), ke(u) || Se(u, "videoGop"), ke(l) || ve(l, "videoCodecProfile", [66, 77, 100]), ke(p) || Se(p, "userCount", 0, 17), ke(f) || Se(f, "backgroundColor", 0, 16777215), !ke(m)) {
                            if (!(m instanceof Array)) throw new Error("[transcodingUsers]: transcodingUsers should be Array");
                            if (17 < m.length) throw new Error("The length of transcodingUsers cannot greater than 17");
                            m.map(function (e, t) {
                                if (!ke(e.uid) && !Object(le.c)(e.uid) && !_e(e.uid, 1, 255)) throw new Error("[String uid] Length of the string: [1,255]. ASCII characters only. [Number uid] The value range is [0,10000]");
                                if (ke(e.x) || Se(e.x, "transcodingUser[".concat(t, "].x"), 0, 1e4), ke(e.y) || Se(e.y, "transcodingUser[".concat(t, "].y"), 0, 1e4), ke(e.width) || Se(e.width, "transcodingUser[".concat(t, "].width"), 0, 1e4), ke(e.height) || Se(e.height, "transcodingUser[".concat(t, "].height"), 0, 1e4), ke(e.zOrder) || Se(e.zOrder, "transcodingUser[".concat(t, "].zOrder"), 0, 100), !(ke(e.alpha) || "number" == typeof e.alpha && e.alpha <= 1 && 0 <= e.alpha)) throw new Error("transcodingUser[${index}].alpha: The value range is [0, 1]")
                            })
                        }
                        A()(it, e), v.gatewayClient.setLiveTranscoding(it), t()
                    }, v.addInjectStreamUrl = function (e, t) {
                        var n = w.b.reportApiInvoke(h.sessionId, {name: "Client.addInjectStreamUrl", options: arguments, tag: "tracer"});
                        ye(e, "url", 1, 255), ge(t, "config"), !ke(t && t.width) && Se(t.width, "config.width", 0, 1e4), !ke(t && t.height) && Se(t.height, "config.height", 0, 1e4), !ke(t && t.videoGop) && Se(t.videoGop, "config.videoGop", 1, 1e4), !ke(t && t.videoFramerate) && Se(t.videoFramerate, "config.videoFramerate", 1, 1e4), !ke(t && t.videoBitrate) && Se(t.videoBitrate, "config.videoBitrate", 1, 1e4), !ke(t && t.audioSampleRate) && ve(t.audioSampleRate, "config.audioSampleRate", [32e3, 44100, 48e3]), !ke(t && t.audioBitrate) && Se(t.audioBitrate, "config.audioBitrate", 1, 1e4), !ke(t && t.audioChannels) && Se(t.audioChannels, "config.audioChannels", 1, 2), A()(ot, t), v.gatewayClient.addInjectStreamUrl(e, ot), n()
                    }, v.removeInjectStreamUrl = function (e) {
                        var t = w.b.reportApiInvoke(h.sessionId, {name: "Client.removeInjectStreamUrl", options: arguments, tag: "tracer"});
                        ye(e, "url", 1, 255), v.gatewayClient.removeInjectStreamUrl(e), t()
                    }, v.enableAudioVolumeIndicator = function (e, t) {
                        var n = w.b.reportApiInvoke(h.sessionId, {name: "Client.enableAudioVolumeIndicator", options: arguments, tag: "tracer"});
                        e = e || 2e3, Se(t = t || 3, "smooth", 1, 100), Se(e, "interval", 50, 1e5), v.audioVolumeIndication = v.audioVolumeIndication || {enabled: !0}, v.audioVolumeIndication.interval = e, v.audioVolumeIndication.smooth = t, v.audioVolumeIndication = {
                            interval: e,
                            smooth: t
                        }, I.default.info("[".concat(v.clientId, "] enableAudioVolumeIndicator interval ").concat(e, " smooth ").concat(t)), v.gatewayClient.enableAudioVolumeIndicator(e, t), n()
                    }, v.getNetworkStats = function (e, t) {
                        return I.default.deprecate("[".concat(v.clientId, "] client.getNetworkStats is deprecated. Use client.getTransportStats instead.")), rt.getStats(e, t)
                    }, v.getSystemStats = function (e, t) {
                        return a.getStats(e, t)
                    }, v.getRecordingDevices = function (e, t) {
                        return fe.getRecordingDevices(e, t)
                    }, v.getPlayoutDevices = function (e, t) {
                        return fe.getPlayoutDevices(e, t)
                    }, v.getCameras = function (e, t) {
                        return fe.getCameras(e, t)
                    }, v.getRemoteAudioStats = function (e, t) {
                        return v.rtcStatsCollector.getRemoteAudioStats(e, t)
                    }, v.getLocalAudioStats = function (e, t) {
                        return v.rtcStatsCollector.getLocalAudioStats(e, t)
                    }, v.getRemoteVideoStats = function (e, t) {
                        return v.rtcStatsCollector.getRemoteVideoStats(e, t)
                    }, v.getLocalVideoStats = function (e, t) {
                        return v.rtcStatsCollector.getLocalVideoStats(e, t)
                    }, v._getRemoteVideoQualityStats = function (e, t) {
                        return v.rtcStatsCollector.getRemoteVideoQualityStats(e, t)
                    }, v._getRemoteAudioQualityStats = function (e, t) {
                        return v.rtcStatsCollector.getRemoteAudioQualityStats(e, t)
                    }, v.getTransportStats = function (r, e) {
                        return v.rtcStatsCollector.getTransportStats(function (n) {
                            return rt.getStats(function (e) {
                                var t = A()({}, n, e);
                                r && r(t)
                            }, e)
                        }, e)
                    }, v.getSessionStats = function (e, t) {
                        return v.rtcStatsCollector.getSessionStats(e, t)
                    }, v.onNetworkQuality = function () {
                        return v.rtcStatsCollector.onNetworkQuality(onSuccess, onFailure)
                    }, h.clientId = v.clientId, v.gatewayClient = $e(h), v.on = v.gatewayClient.on, v.off = v.gatewayClient.removeEventListener, v.rtcStatsCollector = (e = v.gatewayClient, (f = T()).gatewayClient = e, f.exceptionMonitor = new nt(e), f.localStats = {}, f.remoteStats = {}, f.session = {
                        sendBytes: 0,
                        recvBytes: 0,
                        WSSendBytes: 0,
                        WSSendBytesDelta: 0,
                        WSRecvBytes: 0,
                        WSRecvBytesDelta: 0,
                        HTTPSendBytes: 0,
                        HTTPSendBytesDelta: 0,
                        HTTPRecvBytes: 0,
                        HTTPRecvBytesDelta: 0
                    }, f.getRemoteAudioStats = function (e) {
                        var t = {};
                        for (var n in f.remoteStats) {
                            var r = {}, i = f.remoteStats[n];
                            pe(r, "End2EndDelay", i.peer_delay && i.peer_delay.audio_delay), pe(r, "TransportDelay", i.peer_delay && i.peer_delay.e2e_delay), pe(r, "PacketLossRate", i.peer_delay && i.peer_delay.e2e_audio_lost_ratio_400ms), pe(r, "RecvLevel", i.audioStats && i.audioStats.audioOutputLevel), pe(r, "RecvBitrate", i.audioRecvBitrate), pe(r, "CodecType", i.audioStats && i.audioStats.googCodecName), pe(r, "MuteState", i.audioDisabled), pe(r, "TotalFreezeTime", i.audioStats && i.audioStats.audioTotalFreezeTime), pe(r, "TotalPlayDuration", i.audioStats && i.audioStats.audioTotalPlayDuration), t[n] = r
                        }
                        e && e(t)
                    }, f.getLocalAudioStats = function (e) {
                        var t = {};
                        for (var n in f.localStats) {
                            var r = {}, i = f.localStats[n];
                            pe(r, "RecordingLevel", i.audioStats && i.audioStats.audioInputLevel), pe(r, "SendLevel", i.audioStats && i.audioStats.totalAudioEnergy), pe(r, "SamplingRate", i.audioStats && i.audioStats.totalSamplesDuration), pe(r, "SendBitrate", i.audioSendBitrate), pe(r, "CodecType", i.audioStats && i.audioStats.googCodecName), pe(r, "MuteState", i.audioDisabled);
                            var o = f.gatewayClient.localStreams[n];
                            o && o.isPlaying() && pe(r, "MuteState", o.userMuteAudio ? "1" : "0"), t[n] = r
                        }
                        e && e(t)
                    }, f.getRemoteVideoStats = function (e) {
                        var t = {};
                        for (var n in f.remoteStats) {
                            var r = {}, i = f.remoteStats[n];
                            pe(r, "End2EndDelay", i.peer_delay && i.peer_delay.video_delay), pe(r, "TransportDelay", i.peer_delay && i.peer_delay.e2e_delay), pe(r, "PacketLossRate", i.peer_delay && i.peer_delay.e2e_video_lost_ratio_400ms), pe(r, "RecvBitrate", i.videoRecvBitrate), pe(r, "RecvResolutionWidth", i.videoStats && i.videoStats.googFrameWidthReceived), pe(r, "RecvResolutionHeight", i.videoStats && i.videoStats.googFrameHeightReceived), pe(r, "RenderResolutionWidth", i.videoStats && i.videoStats.renderRemoteWidth), pe(r, "RenderResolutionHeight", i.videoStats && i.videoStats.renderRemoteHeight), pe(r, "RenderFrameRate", i.videoStats && i.videoStats.googFrameRateOutput), pe(r, "MuteState", i.videoDisabled), pe(r, "TotalFreezeTime", i.videoStats && i.videoStats.videoTotalFreezeTime), pe(r, "TotalPlayDuration", i.videoStats && i.videoStats.videoTotalPlayDuration), t[n] = r
                        }
                        e && e(t)
                    }, f.getLocalVideoStats = function (e) {
                        var t = {};
                        for (var n in f.localStats) {
                            var r = {}, i = f.localStats[n];
                            pe(r, "TargetSendBitrate", i.videoTargetSendBitrate), pe(r, "SendFrameRate", i.videoStats && i.videoStats.googFrameRateSent), pe(r, "SendBitrate", i.videoSendBitrate), pe(r, "SendResolutionWidth", i.videoStats && i.videoStats.googFrameWidthSent), pe(r, "SendResolutionHeight", i.videoStats && i.videoStats.googFrameHeightSent), pe(r, "CaptureResolutionWidth", i.videoStats && i.videoStats.googFrameWidthInput), pe(r, "CaptureResolutionHeight", i.videoStats && i.videoStats.googFrameHeightInput), pe(r, "EncodeDelay", i.videoStats && i.videoStats.googAvgEncodeMs), pe(r, "MuteState", i.videoDisabled), pe(r, "TotalFreezeTime", i.videoStats && i.videoStats.videoTotalFreezeTime), pe(r, "TotalDuration", i.videoStats && i.videoStats.videoTotalPlayDuration), pe(r, "CaptureFrameRate", i.videoStats && i.videoStats.googFrameRateSent), i.videoStats.googFrameWidthInput || pe(r, "CaptureResolutionWidth", i.videoStats && i.videoStats.renderLocalWidth), i.videoStats.googFrameHeightInput || pe(r, "CaptureResolutionHeight", i.videoStats && i.videoStats.renderLocalHeight), t[n] = r, e && e(t)
                        }
                    }, f.getRemoteVideoQualityStats = function (e) {
                        var t = {};
                        for (var n in f.remoteStats) {
                            var r = {}, i = f.remoteStats[n];
                            pe(r, "videoReceiveDelay", i.videoStats && i.videoStats.googCurrentDelayMs), pe(r, "VideoFreezeRate", i.videoStats && i.videoStats.videoFreezeRate), pe(r, "FirstFrameTime", i.firstFrameTime), t[n] = r
                        }
                        e && e(t)
                    }, f.getRemoteAudioQualityStats = function (e) {
                        var t = {};
                        for (var n in f.remoteStats) {
                            var r = {}, i = f.remoteStats[n];
                            pe(r, "audioReceiveDelay", i.audioStats && i.audioStats.googCurrentDelayMs), pe(r, "AudioFreezeRate", i.videoStats && i.videoStats.videoFreezeRate), t[n] = r
                        }
                        e && e(t)
                    }, f.getTransportStats = function (e) {
                        var t = {}, n = {}, r = f.gatewayClient.traffic_stats, i = r.peer_delay;
                        if (pe(t, "OutgoingAvailableBandwidth", f.gatewayClient.OutgoingAvailableBandwidth / 1e3), pe(t, "RTT", r && r.access_delay), i) {
                            var o = !0, a = !1, s = void 0;
                            try {
                                for (var c, d = i[Symbol.iterator](); !(o = (c = d.next()).done); o = !0) {
                                    var u = c.value;
                                    u.downlink_estimate_bandwidth && (n[u.peer_uid] = u.downlink_estimate_bandwidth / 1e3 + "")
                                }
                            } catch (e) {
                                a = !0, s = e
                            } finally {
                                try {
                                    o || null == d.return || d.return()
                                } finally {
                                    if (a) throw s
                                }
                            }
                        }
                        t.IncomingAvailableBandwidth = n, e && e(t)
                    }, f.getSessionStats = function (e) {
                        var t = {}, n = f.gatewayClient.traffic_stats, r = f.gatewayClient.socket, i = 0, o = 0;
                        for (var a in f.remoteStats) (s = f.remoteStats[a]) && s.videoStats && s.videoStats.videoRecvBytesDelta && (o += parseInt(s.videoStats.videoRecvBytesDelta)), s && s.audioStats && s.audioStats.audioRecvBytesDelta && (o += parseInt(s.audioStats.audioRecvBytesDelta));
                        for (var a in f.localStats) {
                            var s;
                            (s = f.localStats[a]) && s.videoStats && s.videoStats.videoSendBytesDelta && (i += parseInt(s.videoStats.videoSendBytesDelta)), s && s.audioStats && s.audioStats.audioSendBytesDelta && (i += parseInt(s.audioStats.audioSendBytesDelta))
                        }
                        var c = i + f.session.WSSendBytesDelta + f.session.HTTPSendBytesDelta,
                            d = o + f.session.WSRecvBytesDelta + f.session.HTTPRecvBytesDelta, u = f.session.sendBytes + Object(je.b)(),
                            l = f.session.recvBytes + Object(je.a)();
                        f.gatewayClient.socket && f.gatewayClient.socket.state === f.gatewayClient.CONNECTED && (u += r.getSendBytes(), l += r.getRecvBytes());
                        var p = 1;
                        n.peer_delay && (p = n.peer_delay.length, p += 1), pe(t, "Duration", r.getDuration()), pe(t, "UserCount", p), pe(t, "SendBytes", u), pe(t, "RecvBytes", l), pe(t, "SendBitrate", 8 * c / 1e3), pe(t, "RecvBitrate", 8 * d / 1e3), e && e(t)
                    }, f.isLocalVideoFreeze = function (e, t) {
                        var n = 0, r = 0;
                        if (!e || !t) return !1;
                        if (Object(R.isChrome)() || Object(R.isOpera)()) n = e.googFrameRateInput, r = e.googFrameRateSent; else if (Object(R.isSafari)()) n = parseInt(e.framerateMean), r = parseInt(e.framesEncoded) - parseInt(t.framesEncoded); else {
                            if (!Object(R.isFireFox)()) return !1;
                            n = parseInt(e.framerateMean), r = parseInt(e.framesEncoded) - parseInt(t.framesEncoded)
                        }
                        return 5 < n && r < 3
                    }, f.isRemoteVideoFreeze = function (e, t) {
                        var n = 0, r = 0;
                        if (!e || !t) return !1;
                        if (Object(R.isChrome)() || Object(R.isOpera)()) n = e.googFrameRateReceived, r = e.googFrameRateDecoded; else if (Object(R.isSafari)()) n = e.framerateMean, r = parseInt(e.framesDecoded) - parseInt(t.framesDecoded); else {
                            if (!Object(R.isFireFox)()) return !1;
                            n = parseInt(e.framesReceived) - parseInt(t.framesReceived), r = parseInt(e.framesDecoded) - parseInt(t.framesDecoded)
                        }
                        return 5 < n && n < 10 && r < 3 || 10 < n && n < 20 && r < 4 || 20 < n && r < 5
                    }, f.isAudioFreeze = function (e) {
                        if (Object(R.isChrome)() && e) {
                            if (e.googDecodingPLC && e.googDecodingPLCCNG && e.googDecodingCTN) return .2 < (parseInt(e.googDecodingPLC) + parseInt(e.googDecodingPLCCNG)) / parseInt(e.googDecodingCTN)
                        } else if ((Object(R.isSafari)() || Object(R.isFireFox)()) && e.packetsLost && e.packetsReceived) return .2 < parseInt(e.packetsLost) / (parseInt(e.packetsLost) + parseInt(e.packetsReceived));
                        return !1
                    }, f.isAudioDecodeFailed = function (e) {
                        return !!((Object(R.isChrome)() || Object(R.isOpera)()) && e && 0 < parseInt(e.bytesReceived) && 0 === parseInt(e.googDecodingNormal))
                    }, f.startNetworkQualityTimer = function () {
                        f.clearNetworkQualityTimer(), f.networkQualityTimer = setInterval(function () {
                            if (f.gatewayClient.state !== $e.CONNECTED) f.gatewayClient.dispatchEvent({
                                type: "network-quality",
                                uplinkNetworkQuality: 0,
                                downlinkNetworkQuality: 0
                            }); else {
                                var e = f.gatewayClient.traffic_stats;
                                f.gatewayClient.dispatchEvent({
                                    type: "network-quality",
                                    uplinkNetworkQuality: f.networkQualityTrans(e.uplink_network_quality),
                                    downlinkNetworkQuality: f.networkQualityTrans(e.downlink_network_quality)
                                })
                            }
                        }, 2e3)
                    }, f.clearNetworkQualityTimer = function () {
                        f.networkQualityTimer && clearInterval(f.networkQualityTimer)
                    }, f.networkQualityTrans = function (e) {
                        return 0 <= e && e < .17 ? 1 : .17 <= e && e < .36 ? 2 : .36 <= e && e < .59 ? 3 : .59 <= e && e <= 1 ? 4 : 1 < e ? 5 : 0
                    }, f.getStatsTimer = setInterval(function () {
                        var n = f.gatewayClient.traffic_stats, r = Date.now();
                        f.gatewayClient.dispatchEvent({type: "_testException"}), Object.keys(f.localStats).length && f.exceptionMonitor.setLocalStats(f.localStats), Object.keys(f.remoteStats).length && f.exceptionMonitor.setRemoteStats(f.remoteStats);
                        var i = {};
                        Object.keys(f.gatewayClient.remoteStreams).forEach(function (t) {
                            var o = f.gatewayClient.remoteStreams[t], a = f.remoteStats[t], s = {id: t, updatedAt: r};
                            (i[t] = s).firstFrameTime = o.firstFrameTime, a ? (s.audioTotalPlayDuration = a.audioTotalPlayDuration + 1, s.audioTotalFreezeTime = a.audioTotalFreezeTime, s.isAudioFreeze = !1, s.isAudioDecodeFailed = !1, s.videoTotalPlayDuration = a.videoTotalPlayDuration + 1, s.videoTotalFreezeTime = a.videoTotalFreezeTime, s.isVideoFreeze = !1) : (s.audioTotalPlayDuration = 1, s.audioTotalFreezeTime = 0, s.videoTotalPlayDuration = 1, s.videoTotalFreezeTime = 0);
                            var e = n && n.peer_delay && n.peer_delay.find(function (e) {
                                return e.peer_uid == t
                            });
                            e && (s.peer_delay = e), o && (o.isPlaying() && (s.audioDisabled = o.userMuteAudio || o.peerMuteAudio ? "1" : "0", s.videoDisabled = o.userMuteVideo || o.peerMuteVideo ? "1" : "0"), a && a.peer_delay && e && a.peer_delay.stream_type !== e.stream_type && f.gatewayClient.dispatchEvent({
                                type: "streamTypeChange",
                                uid: t,
                                streamType: e.stream_type
                            }), o.pc && "established" == o.pc.state && o.pc.getStats(function (e) {
                                if (s.pcStats = e, s.audioStats = e.find(function (e) {
                                    return "audio" == e.mediaType && (-1 < e.id.indexOf("_recv") || -1 < e.id.toLowerCase().indexOf("inbound"))
                                }), s.videoStats = e.find(function (e) {
                                    return "video" == e.mediaType && (-1 < e.id.indexOf("_recv") || -1 < e.id.toLowerCase().indexOf("inbound"))
                                }), a && a.audioStats && s.audioStats) {
                                    var t = parseInt(s.audioStats.bytesReceived) - parseInt(a.audioStats.bytesReceived),
                                        n = parseInt(s.audioStats.googDecodingNormal) - parseInt(a.audioStats.googDecodingNormal);
                                    if (s.audioStats.audioRecvBytesDelta = t, s.audioStats.audioDecodingNormalDelta = n, f.session.recvBytes += t, isFinite(t) && s.audioStats.timestamp) {
                                        var r = s.audioStats.timestamp.getTime() - a.audioStats.timestamp.getTime();
                                        s.audioRecvBitrate = Math.floor(8 * t / r)
                                    }
                                    f.isAudioFreeze(s.audioStats) && 10 < s.audioTotalPlayDuration && (s.audioTotalFreezeTime++, s.isAudioFreeze = !0), f.isAudioDecodeFailed(s.audioStats) && 10 < s.audioTotalPlayDuration && (s.isAudioDecodeFailed = !0), s.audioStats.audioTotalFreezeTime = s.audioTotalFreezeTime, s.audioStats.audioTotalPlayDuration = s.audioTotalPlayDuration, s.audioStats.audioFreezeRate = Math.ceil(100 * s.audioTotalFreezeTime / s.audioTotalPlayDuration)
                                }
                                if (a && a.videoStats && s.videoStats) {
                                    var i = parseInt(s.videoStats.bytesReceived) - parseInt(a.videoStats.bytesReceived);
                                    s.videoStats.videoRecvBytesDelta = i, f.session.recvBytes += i, isFinite(i) && s.videoStats.timestamp && (r = s.videoStats.timestamp.getTime() - a.videoStats.timestamp.getTime(), s.videoRecvBitrate = Math.floor(8 * i / r)), f.isRemoteVideoFreeze(s.videoStats, a.videoStats) && (s.videoTotalFreezeTime++, s.isVideoFreeze = !0), s.videoStats.videoTotalFreezeTime = s.videoTotalFreezeTime, s.videoStats.videoTotalPlayDuration = s.videoTotalPlayDuration, s.videoStats.videoFreezeRate = Math.ceil(100 * s.videoTotalFreezeTime / s.videoTotalPlayDuration), o.player && o.player.video && o.player.video.videoWidth && o.player.video.videoHeight ? (s.videoStats.renderRemoteWidth = o.player.video.videoWidth, s.videoStats.renderRemoteHeight = o.player.video.videoHeight) : (s.videoStats.renderRemoteWidth = o.videoWidth || s.videoStats.googFrameWidthReceived, s.videoStats.renderRemoteHeight = o.videoHeight || s.videoStats.googFrameHeightReceived)
                                }
                            }))
                        }), f.remoteStats = i;
                        var t = {};
                        if (Object.keys(f.gatewayClient.localStreams).forEach(function (e) {
                            var i = f.gatewayClient.localStreams[e], o = f.localStats[e], a = {id: e, updatedAt: r};
                            t[e] = a, o ? (a.videoTotalPlayDuration = o.videoTotalPlayDuration + 1, a.videoTotalFreezeTime = o.videoTotalFreezeTime, a.isVideoFreeze = !1) : (a.videoTotalPlayDuration = 1, a.videoTotalFreezeTime = 0), i && (i.isPlaying() && (a.audioDisabled = i.userMuteAudio ? "1" : "0", a.videoDisabled = i.userMuteVideo ? "1" : "0"), i.video && i.attributes.maxVideoBW ? a.videoTargetSendBitrate = i.attributes.maxVideoBW : i.video && i.screenAttributes && (a.videoTargetSendBitrate = i.screenAttributes.maxVideoBW), i.pc && "established" == i.pc.state && i.pc.getStats(function (e) {
                                if (a.pcStats = e.reverse(), a.audioStats = e.find(function (e) {
                                    return "audio" == e.mediaType && (-1 < e.id.indexOf("_send") || -1 < e.id.toLowerCase().indexOf("outbound"))
                                }), a.videoStats = e.find(function (e) {
                                    return "video" == e.mediaType && (-1 < e.id.indexOf("_send") || -1 < e.id.toLowerCase().indexOf("outbound"))
                                }), a.audioStats && o && o.audioStats) {
                                    var t = parseInt(a.audioStats.bytesSent) - parseInt(o.audioStats.bytesSent);
                                    if (a.audioStats.audioSendBytesDelta = t, f.session.sendBytes += t, isFinite(t) && a.audioStats.timestamp) {
                                        var n = a.audioStats.timestamp.getTime() - o.audioStats.timestamp.getTime();
                                        a.audioSendBitrate = Math.floor(8 * t / n)
                                    }
                                }
                                if (a.videoStats && o && o.videoStats) {
                                    var r = parseInt(a.videoStats.bytesSent) - parseInt(o.videoStats.bytesSent);
                                    a.videoStats.videoSendBytesDelta = r, f.session.sendBytes += r, isFinite(r) && a.videoStats.timestamp && (n = a.videoStats.timestamp.getTime() - o.videoStats.timestamp.getTime(), a.videoSendBitrate = Math.floor(8 * r / n)), f.isLocalVideoFreeze(a.videoStats, o.videoStats) && (a.videoTotalFreezeTime++, a.isVideoFreeze = !0), a.videoStats.videoTotalFreezeTime = a.videoTotalFreezeTime, a.videoStats.videoTotalPlayDuration = a.videoTotalPlayDuration, a.videoStats.videoFreezeRate = Math.ceil(100 * a.videoTotalFreezeTime / a.videoTotalPlayDuration), a.videoStats.renderLocalWidth = i.videoWidth || a.videoStats.googFrameWidthSent, a.videoStats.renderLocalHeight = i.videoHeight || a.videoStats.googFrameHeightSent
                                }
                            }))
                        }), f.localStats = t, f.session.HTTPSendBytesDelta = Object(je.b)() - f.session.HTTPSendBytes, f.session.HTTPSendBytes = Object(je.b)(), f.session.HTTPRecvBytesDelta = Object(je.a)() - f.session.HTTPRecvBytes, f.session.HTTPRecvBytes = Object(je.a)(), f.gatewayClient.socket && f.gatewayClient.socket.state === f.gatewayClient.CONNECTED) {
                            var e = f.gatewayClient.socket;
                            f.session.WSSendBytesDelta = e.getSendBytes() - f.session.WSSendBytes, f.session.WSSendBytes = e.getSendBytes(), f.session.WSRecvBytesDelta = e.getRecvBytes() - f.session.WSRecvBytes, f.session.WSRecvBytes = e.getRecvBytes()
                        }
                    }, 1e3), f.gatewayClient.on("join", function () {
                        f.session = {
                            sendBytes: 0,
                            recvBytes: 0,
                            WSSendBytes: 0,
                            WSSendBytesDelta: 0,
                            WSRecvBytes: 0,
                            WSRecvBytesDelta: 0,
                            HTTPSendBytes: 0,
                            HTTPSendBytesDelta: 0,
                            HTTPRecvBytes: 0,
                            HTTPRecvBytesDelta: 0
                        }
                    }), f), v.configDistributManager = ((i = {}).client = t = v, i.client.on("config-distribute", function (e) {
                        var n = e.joinInfo, r = e.config;
                        if (r) {
                            ke(r.uploadLog) || (Object(_.setParameter)("UPLOAD_LOG", r.uploadLog), w.b.reportApiInvoke(n.sid, {
                                name: "_configDistribute",
                                options: {feature: "uploadLog", value: r.uploadLog}
                            })()), ke(r.dualStream) || (t.isDualStream = r.dualStream, w.b.reportApiInvoke(n.sid, {
                                name: "_configDistribute",
                                options: {feature: "dualStream", value: r.dualStream}
                            })()), ke(r.streamFallbackOption) || i.client.on("stream-subscribed", function (e) {
                                var t = e.stream;
                                t ? (i.client.gatewayClient.setStreamFallbackOption(t, r.streamFallbackOption), w.b.reportApiInvoke(n.sid, {
                                    name: "_configDistribute",
                                    options: {feature: "streamFallbackOption", value: r.streamFallbackOption, streamId: t.getId()}
                                })()) : w.b.reportApiInvoke(n.sid, {
                                    name: "_configDistribute",
                                    options: {
                                        feature: "streamFallbackOption",
                                        value: r.streamFallbackOption,
                                        streamId: t.getId(),
                                        err: "invalid stream"
                                    }
                                })()
                            });
                            try {
                                Object.keys(r).map(function (e) {
                                    return Object(_.setParameter)(e, r[e])
                                })
                            } catch (e) {
                            }
                        }
                    }), i), ke(h.turnServer) || v.setTurnServer(h.turnServer), ke(h.proxyServer) || v.setProxyServer(h.proxyServer), "live" === v.mode && (v.gatewayClient.role = "audience"), "rtc" === v.mode && (v.gatewayClient.role = "host"), v.on("onMultiIP", function (e) {
                        v.gatewayClient.closeGateway(), v.gatewayClient.socket = void 0, v.gatewayClient.hasChangeBGPAddress = !0, v.joinInfo.multiIP = e.arg.option, v.gatewayClient.state = $e.CONNECTING, He(v.joinInfo, function (e) {
                            I.default.info("[".concat(v.clientId, "] Joining channel: ").concat(v.channel)), v.joinInfo.cid = e.cid, v.joinInfo.uid = e.uid, v.joinInfo.uni_lbs_ip = e.uni_lbs_ip, v.joinInfo.gatewayAddr = e.gateway_addr, v.onSuccess ? v.gatewayClient.join(v.joinInfo, v.key, function (e) {
                                I.default.info("[".concat(v.clientId, "] Join channel ").concat(v.channel, " success"));
                                var t = v.onSuccess;
                                v.onSuccess = null, v.onFailure = null, t(e)
                            }, v.onFailure) : (v.gatewayClient.joinInfo = A()({}, v.joinInfo), v.gatewayClient.rejoin())
                        }, v.onFailure)
                    }), v.on("rejoin-start", function () {
                        v._renewSession(), w.b.sessionInit(h.sessionId, {
                            lts: (new Date).getTime(),
                            extend: {rejoin: !0},
                            cname: v.channel,
                            appid: h.appId,
                            mode: h.mode,
                            succ: !0
                        })
                    }), v.on("recover", function () {
                        v._renewSession(), w.b.sessionInit(h.sessionId, {
                            lts: (new Date).getTime(),
                            extend: {recover: !0},
                            cname: v.channel,
                            appid: h.appId,
                            mode: h.mode,
                            succ: !0
                        })
                    }), v.on("rejoin", function () {
                        var e = 2 === v.highStreamState ? 2 : 0;
                        if (v.onSuccess) {
                            var t = v.onSuccess;
                            v.onSuccess = null, v.onFailure = null, t()
                        }
                        v.highStream && 0 == e && (I.default.info("[".concat(v.clientId, "] publish after rejoin")), v.highStreamState = 2, v.lowStreamState = 2, v.publish(v.highStream, function (e) {
                            e && I.default.info("[".concat(v.clientId, "] "), e)
                        }))
                    }), v.on("streamPublished", function (e) {
                        v.hasPublished || (v.hasPublished = !0, v.gatewayClient.dispatchEvent(C({type: "stream-published", stream: e.stream})))
                    }), v.on("pubP2PLost", function (e) {
                        I.default.debug("[".concat(v.clientId, "] Start reconnect local peerConnection: ").concat(v.highStream.getId())), v.gatewayClient.dispatchEvent({
                            type: "stream-reconnect-start",
                            uid: v.highStream.getId()
                        }), 1 === v.highStreamState && (v.highStreamState = 0, v.lowStreamState = 0), v._unpublish(v.highStream, function () {
                            v._publish(v.highStream, function () {
                                I.default.debug("[".concat(v.clientId, "] Reconnect local peerConnection success: ").concat(v.highStream.getId())), v.gatewayClient.dispatchEvent({
                                    type: "stream-reconnect-end",
                                    uid: v.highStream.getId(),
                                    success: !0,
                                    reason: ""
                                })
                            }, function (e) {
                                I.default.debug("[".concat(v.clientId, "] Reconnect local peerConnection failed: ").concat(e)), v.gatewayClient.dispatchEvent({
                                    type: "stream-reconnect-end",
                                    uid: v.highStream.getId(),
                                    success: !1,
                                    reason: e
                                })
                            })
                        }, function (e) {
                            I.default.debug("[".concat(v.clientId, "] Reconnect local peerConnection failed: ").concat(e)), v.gatewayClient.dispatchEvent({
                                type: "stream-reconnect-end",
                                uid: v.highStream.getId(),
                                success: !1,
                                reason: e
                            })
                        })
                    }), v.on("subP2PLost", function (t) {
                        I.default.debug("[".concat(v.clientId, "] Start reconnect remote peerConnection: ").concat(t.stream.getId())), v.gatewayClient.dispatchEvent({
                            type: "stream-reconnect-start",
                            uid: t.stream.getId()
                        }), v.gatewayClient.unsubscribe(t.stream, function () {
                            v.gatewayClient.subscribe(t.stream, function () {
                                I.default.debug("[".concat(v.clientId, "] Reconnect remote peerConnection success: ").concat(t.stream.getId())), v.gatewayClient.dispatchEvent({
                                    type: "stream-reconnect-end",
                                    uid: t.stream.getId(),
                                    success: !1,
                                    reason: ""
                                })
                            }, function (e) {
                                I.default.debug("[".concat(v.clientId, "] Reconnect remote peerConnection failed: "), e), v.gatewayClient.dispatchEvent({
                                    type: "stream-reconnect-end",
                                    uid: t.stream.getId(),
                                    success: !1,
                                    reason: e
                                })
                            })
                        }, function (e) {
                            I.default.debug("[".concat(v.clientId, "] \" + 'Reconnect remote peerConnection failed: "), e), v.gatewayClient.dispatchEvent({
                                type: "stream-reconnect-end",
                                uid: t.stream.getId(),
                                success: !1,
                                reason: e
                            })
                        })
                    }), rt.on("networkTypeChanged", function (e) {
                        v.gatewayClient && v.gatewayClient.dispatchEvent(e);
                        var t = A()({}, e, {type: "network-type-changed"});
                        v.gatewayClient.dispatchEvent(t)
                    }), fe.on("recordingDeviceChanged", function (e) {
                        v.gatewayClient && v.gatewayClient.dispatchEvent(e);
                        var t = A()({}, e, {type: "recording-device-changed"});
                        v.gatewayClient.dispatchEvent(t)
                    }), fe.on("playoutDeviceChanged", function (e) {
                        v.gatewayClient && v.gatewayClient.dispatchEvent(e);
                        var t = A()({}, e, {type: "playout-device-changed"});
                        v.gatewayClient.dispatchEvent(t)
                    }), fe.on("cameraChanged", function (e) {
                        v.gatewayClient && v.gatewayClient.dispatchEvent(e);
                        var t = A()({}, e, {type: "camera-changed"});
                        v.gatewayClient.dispatchEvent(t)
                    }), v.gatewayClient.on("streamTypeChange", function (e) {
                        var t = A()({}, e, {type: "stream-type-changed"});
                        v.gatewayClient.dispatchEvent(t), w.b.reportApiInvoke(h.sessionId, {name: "streamTypeChange"})(null, JSON.stringify(e))
                    }), v
                }(t)
            },
            createStream: function (e) {
                var t = w.b.reportApiInvoke(null, {name: "createStream", options: arguments, tag: "tracer"});
                ge(e, "StreamSpec");
                var n = e.streamID, r = e.audio, i = e.video, o = e.screen, a = (e.audioSource, e.videoSource, e.cameraId), s = e.microphoneId,
                    c = e.mirror, d = e.extensionId, u = e.mediaSource, l = e.audioProcessing;
                if (!ke(n) && !Object(le.c)(n) && !_e(n, 1, 255)) throw new Error("[String streamID] Length of the string: [1,255]. ASCII characters only. [Number streamID] The value range is Uint32");
                if (be(r, "audio"), be(i, "video"), ke(o) || be(o, "screen"), ke(a) || ye(a, "cameraId", 0, 255, !1), ke(s) || ye(s, "microphoneId", 0, 255, !1), ke(d) || ye(d, "extensionId"), ke(u) || ve(u, "mediaSource", ["screen", "application", "window"]), ke(c) || be(c, "mirror"), !ke(l)) {
                    var p = l.AGC, f = l.AEC, m = l.ANS;
                    ke(p) || be(p, "AGC"), ke(f) || be(f, "AEC"), ke(m) || be(m, "ANS")
                }
                I.default.debug("Create stream");
                var h = Pe(e);
                return t(), h
            },
            Logger: I.default,
            getDevices: at,
            getScreenSources: st,
            getParameter: _.getParameter,
            setParameter: _.setParameter,
            checkSystemRequirements: function () {
                var e = w.b.reportApiInvoke(null, {name: "checkSystemRequirements", options: arguments, tag: "tracer"}),
                    t = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
                    n = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
                    r = window.WebSocket, i = !!t && !!n && !!r, o = !1;
                I.default.debug(R.getBrowserInfo(), "isAPISupport:" + i), R.isChrome() && 58 <= R.getBrowserVersion() && "iOS" !== R.getBrowserOS() && (o = !0), R.isFireFox() && 56 <= R.getBrowserVersion() && (o = !0), R.isOpera() && 45 <= R.getBrowserVersion() && (o = !0), R.isSafari() && 11 <= R.getBrowserVersion() && (o = !0), R.isEdge() && (o = !0), (R.isWeChatBrowser() || R.isQQBrowser()) && "iOS" !== R.getBrowserOS() && (o = !0), R.isSupportedPC() || R.isSupportedMobile() || (o = !1);
                var a = i && o;
                return e(null, a), a
            },
            getSupportedCodec: De.getSupportedCodec,
            VERSION: _.VERSION,
            BUILD: _.BUILD,
            PROFILE_TABLE: ct,
            AUDIO_SAMPLE_RATE_32000: 32e3,
            AUDIO_SAMPLE_RATE_44100: 44100,
            AUDIO_SAMPLE_RATE_48000: 48e3,
            VIDEO_CODEC_PROFILE_BASELINE: 66,
            VIDEO_CODEC_PROFILE_MAIN: 77,
            VIDEO_CODEC_PROFILE_HIGH: 100,
            REMOTE_VIDEO_STREAM_HIGH: 0,
            REMOTE_VIDEO_STREAM_LOW: 1,
            REMOTE_VIDEO_STREAM_MEDIUM: 2
        }
    }]).default
});
var serviceNetArr = [], cc_user_self = 0, main_url = document.domain, document_url = "document.csslcloud.net";
"class.csslcloud.net" === main_url || "class.csslcloud-as.com" === main_url ? (main_url = main_url.replace("class", "ccapi"), document_url = document.domain.replace("class", "document"), cc_user_self = 1) : main_url = "ccapi.csslcloud.net", function () {
    var platForm = 0, mqttClientId, isUpdateRtmpLayout = !1;

    function EventEmitter() {
        this.events = {}, this.token = ""
    }

    function Rtc(e) {
        (InitRtc = this).token = e.sessionid, this.userid = e.userid, this.sessionid = e.sessionid, this.roomid = e.roomid, e.screenId && (ATLAS.extend_id = e.screenId), !0 === e.isUpdateRtmpLayout && (isUpdateRtmpLayout = !0);
        var t = window.localStorage, n = e.areaCode;
        try {
            this.ajax({
                url: "https://dapi.csslcloud.net/api/detect", async: !1, type: "GET", data: {}, success: function (e) {
                    if ("OK" == (e = JSON.parse(e)).result) {
                        var t = serviceNetArr = e.data;
                        if (0 === cc_user_self && (1 == e.abroad && (main_url = "ccapi.csslcloud-as.com"), o)) for (var n in t) t[n].area_code == o && (main_url = t[n].domain)
                    }
                }
            })
        } catch (e) {
        }
        if (1 === cc_user_self) {
            var r = window.location.href, i = r.indexOf("&region=");
            if (-1 === i) {
                (o = t.getItem("area_code")) ? this.join(o) : this.join()
            } else {
                for (var o = r.slice(i + 8).split("&")[0], a = 0; a < serviceNetArr.length; a++) o === serviceNetArr[a].area_code && (main_url = serviceNetArr[a].domain);
                t.setItem("area_code", o), this.join(o)
            }
        } else n ? this.join(n) : this.join()
    }

    function CCstream(a) {
        this.stream = a, this.id = function () {
            return platForm ? a.getId() : a.id
        }, this.attr = function (e) {
            if (!platForm) return a.attributes && a.attributes[e] ? a.attributes[e] : void 0;
            for (var t = a.getId(); String(t).length < 10;) t = 9 === String(t).length ? "1" + String(t) : "0" + String(t);
            if (t = parseInt(t)) for (var n = 0; n < Speaker.onlineUsers.length; n++) if (parseInt(Speaker.onlineUsers[n].uid) === t) {
                if ("role" === e) return Speaker.onlineUsers[n].role;
                if ("name" === e) return Speaker.onlineUsers[n].name;
                if ("userid" === e) return Speaker.onlineUsers[n].id
            }
        }, this.attributes = function () {
            return platForm ? void 0 : a.attributes ? a.attributes : void 0
        }, this.hasVideo = function () {
            var e = a.mediaStream;
            return platForm && (e = a.stream), !(!e || !e.getVideoTracks().length)
        }, this.hasAudio = function () {
            var e = a.mediaStream;
            return platForm && (e = a.stream), !(!e || !e.getAudioTracks().length)
        }, this.isScreen = function () {
            return platForm ? String(a.getId()).length < 10 : !(!a.source || "screen-cast" !== a.source.audio && "screen-cast" !== a.source.video)
        }, this.isMixed = function () {
            return !platForm && !(!a.source || "mixed" !== a.source.audio && "mixed" !== a.source.video)
        }, this.isCamera = function () {
            return platForm ? !(String(a.getId()).length < 10) : !(!a.source || "mic" !== a.source.audio && "camera" !== a.source.video)
        }, this.show = function (e) {
            var t = "streamBox_" + a.id, r = "streamId_" + a.id;
            platForm && (t = "streamBox_" + a.getId(), r = "streamId_" + a.getId());
            var n = document.getElementById(e);
            n.innerHTML = "";
            var i = document.createElement("div");
            i.setAttribute("id", t), i.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;");
            var o = document.createElement("video");
            o.setAttribute("id", r), o.setAttribute("style", "width: 100%; height: 100%; position: absolute"), o.setAttribute("autoplay", "autoplay"), a.mediaStream ? o.srcObject = a.mediaStream : o.srcObject = a.stream, platForm ? a.local && (o.volume = 0) : a.origin || (o.volume = 0), i.appendChild(o), n.appendChild(i), setTimeout(function () {
                o.play().then(function () {
                }, function (e) {
                    console.log(e);
                    var t = document.createElement("div");
                    t.setAttribute("style", "width: 0;height: 0;border-width: 10px;border-style: solid;border-color: transparent transparent transparent rgba(62,62,62,1);margin: 10px 15px;");
                    var n = document.createElement("div");
                    n.setAttribute("id", "autoPlay" + r), n.setAttribute("style", "width: 38px;height: 38px;border-radius: 50%;position: absolute;top: 50%;left: 50%;margin-left: -19px;margin-top: -19px;background:rgba(232,233,235,0.9);cursor: pointer;z-index:9999999999999"), n.appendChild(t), i.appendChild(n), n.onmousedown = function () {
                        o.play().then(function () {
                        }, function (e) {
                            console.log(e, "手动播放失败")
                        })
                    }, o.onplay = function () {
                        console.log("成功播放"), i.removeChild(n)
                    }, InitRtc.emit("playError", {videoDom: o})
                })
            }, 200)
        }, this.stop = function () {
            "function" == typeof a.stop && a.stop()
        }, this.mediaStream = function () {
            return platForm ? a.stream : a.mediaStream
        }
    }

    EventEmitter.prototype = {
        on: function (e, t) {
            this.events[e] = this.events[e] || [], this.events[e].push(t)
        }, emit: function (e, t) {
            var n, r, i = this.events[e], o = Array.prototype.slice.call(arguments, 1);
            if (i) for (n = 0, r = i.length; n < r; n++) i[n].apply(null, o)
        }, jsonp: function (t) {
            if ((t = t || {}).callback = t.callback || "callback", !t.url || !t.callbackName) throw new Error("params is illegal!");
            t.beforeSend && t.beforeSend();
            var n = (t.callbackName + Math.random()).replace(".", "");
            t.data[t.callback] = n;
            var e = function (e) {
                var t = [];
                for (var n in e) t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
                return t.join("&")
            }(t.data);
            window[n] = function (e) {
                r.removeChild(i), clearTimeout(i.timer), window[n] = null, t.success && t.success(e)
            };
            var r = document.getElementsByTagName("head")[0], i = document.createElement("script");
            r.appendChild(i), i.src = t.url + "?" + e, t.time && (i.timer = setTimeout(function () {
                window[n] = null, r.removeChild(i), t.error && t.error({message: "over time"})
            }, t.time))
        }, ajax: function (t) {
            var e = this.token, n = mqttClientId = function () {
                {
                    if (o("client_id")) return o("client_id");
                    var e = (new Date).getTime().toString().substring(5);
                    return function (e, t) {
                        document.cookie = e + "=" + escape(t) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                    }("client_id", e), e
                }
            }();
            (t = t || {}).type = (t.type || "GET").toUpperCase(), t.dataType = t.dataType || "json", !1 === t.async || !0 === t.async ? t.async = t.async : t.async = !0;
            var r, i = function (e) {
                var t = [];
                for (var n in e) t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
                return t.join("&")
            }(t.data);
            if ((r = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")).onreadystatechange = function () {
                if (4 == r.readyState) {
                    var e = r.status;
                    200 <= e && e < 300 ? t.success && t.success(r.responseText, r.responseXML) : t.fail && t.fail(e)
                }
            }, "GET" == t.type) {
                r.open("GET", t.url + "?" + i, t.async), t.noClientId || (r.setRequestHeader("ClientID", n), r.setRequestHeader("token", e)), "function" == typeof t.beforeSend && t.beforeSend();
                try {
                    r.send(null)
                } catch (e) {
                    t.fail && t.fail(e.message)
                }
            } else if ("POST" == t.type) {
                r.open("POST", t.url, t.async), "json" === t.dataType ? r.setRequestHeader("Content-Type", "application/json") : r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), t.noClientId || (r.setRequestHeader("ClientID", n), r.setRequestHeader("token", e)), "function" == typeof t.beforeSend && t.beforeSend();
                try {
                    r.send(t.data)
                } catch (e) {
                    t.fail && t.fail(e.message)
                }
            }

            function o(e) {
                var t, n = new RegExp("(^| )" + e + "=([^;]*)(;|$)");
                return (t = document.cookie.match(n)) ? unescape(t[2]) : null
            }
        }
    }, Rtc.prototype = new EventEmitter, Rtc.prototype.join = function (e) {
        if (1 === ATLAS.connect) console.log("不能重复登录"); else {
            var a = this;
            if (e) var t = {userid: a.userid, sessionid: a.sessionid, isp: e}; else t = {userid: a.userid, sessionid: a.sessionid};
            this.ajax({
                url: "https://" + main_url + "/api/room/join", type: "GET", data: t, dataType: "json", async: !0, success: function (e) {
                    if ("FAIL" === (e = JSON.parse(e)).result) throw a.emit("login_failed", e.errorMsg), new Error(e.errorMsg);
                    var t = e.data, n = t.mq_token[0], r = t.mq_token[1];
                    document_url = t.doc_server[0].replace("https://", "").replace("http://", "").replace("/", ""), a.socket_address = t.chart_server[0], a.socket_spare_address = t.chart_server[1] ? t.chart_server[1] : t.chart_server[0], a.viewerid = t.user.id, a.name = t.user.name, a.roomid = t.user.roomid, a.videoMode = t.video_mode, a.startTime = t.live.startTime ? parseInt(t.live.startTime) : 0, a.userRole = t.user.role, a.area_code = t.live.area_code, a.template = t.template, a.role = t.user.role, a.extUrl = t.rtspurl, a.allowCdnPub = t.pubcdn_switch, a.bitrate_limit = 720 === t.bitrate_limit, a.desktopAudio = !!t.desktop_audio;
                    var i = t.live.atlas_token, o = t.live.atlas_token_parent;
                    if (platForm = a.platForm = t.service_platform, a.appId = t.live.ago_appid, a.uid = t.user.uid, a.uid) for (a.screen_uid = a.uid.slice(1); "0" === a.screen_uid[0];) a.screen_uid = a.screen_uid.slice(1);
                    a.cdnUrl = t.ago_rtmp_cdn, t.live.hasOwnProperty("id") && (a.liveId = t.live.id), n && MQTT.init(a, n, a.roomid, r), Speaker.roomOptions.isFollow = t.is_follow, Speaker.roomOptions.classTpye = t.class_type, Speaker.roomOptions.maxStreams = t.max_streams, Speaker.roomOptions.allowChat = t.allow_chat, Speaker.roomOptions.allowAudio = t.allow_audio, Speaker.roomOptions.allowSpeak = t.allow_speak, Speaker.roomOptions.videoMode = t.video_mode, Speaker.roomOptions.template = t.template, a.startData = t, "function" == typeof a.ChoicePhoneInit && a.ChoicePhoneInit(t), "function" == typeof a.roomUpdateWatcher && a.roomUpdateWatcher(), platForm ? (AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE), a.startTime ? WEBRTC.init(a, t.live.ago_token) : (a.emit("login_success", t), a.emit("conference_join"), a.hasJoin = 1, SOCKET.user || (a.socket_init(), SOCKET.user = !0))) : (ATLAS.reconnect || (ATLAS.init(a), ATLAS.reconnect = !0), a.AtlasJoin(i), a.join_timeout = setTimeout(function () {
                        a.emit("join_timeOut")
                    }, 1e4), o && setTimeout(function () {
                        ATLAS.init(a, o), a.otherAtlasJoin(o)
                    }, 1e3)), reportData.init(a, t)
                }, fail: function (e) {
                    a.emit("login_failed", "网络请求失败"), console.log("login_failed", e), reportData.reportError(a, 9002)
                }
            })
        }
    }, Rtc.prototype.AtlasJoin = function (e) {
        ATLAS.AtlasJoin(this, e)
    }, Rtc.prototype.otherAtlasJoin = function (e) {
        ATLAS.otherAtlasJoin(this, e)
    }, Rtc.prototype.streamServerConnect = function (e) {
        ATLAS.streamServerConnect(this, e)
    }, Rtc.prototype.createLocalStream = function (e) {
        this.platForm ? WEBRTC.createLocalStream(this, e) : ATLAS.createLocalStream(this, e)
    }, Rtc.prototype.leave = function () {
        this.platForm || ATLAS.leave(this)
    }, Rtc.prototype.detectExtension = function (e) {
        this.platForm ? e && "function" == typeof e.success && e.success() : ATLAS.detectExtension(e, this)
    }, Rtc.prototype.publishShareStream = function (t) {
        var n = this;
        this.ajax({
            url: "https://" + main_url + "/api/live/stat", type: "GET", data: {roomid: n.roomid}, success: function (e) {
                "OK" === (e = JSON.parse(e)).result ? !0 === e.started ? (n.liveId = e.liveid, n.platForm ? WEBRTC.publishShareStream(n, t) : ATLAS.publishShareStream(n, t)) : (console.log("直播未开始"), t && "function" == typeof t.fail && t.fail("直播未开始")) : (t && "function" == typeof t.fail && t.fail(e.errorMsg), console.log(e.errorMsg))
            }, fail: function () {
                console.log("查询直播状态失败，导致没有推桌面共享流"), t && "function" == typeof t.fail && t.fail("查询直播状态失败，导致没有推桌面共享流")
            }
        })
    }, Rtc.prototype.unPubShareStream = function () {
        this.platForm ? WEBRTC.unPubShareStream(this) : ATLAS.unPubShareStream(this)
    }, Rtc.prototype.publish = function (t) {
        var n = this;
        this.ajax({
            url: "https://" + main_url + "/api/live/stat", type: "GET", data: {roomid: n.roomid}, success: function (e) {
                "OK" === (e = JSON.parse(e)).result ? !0 === e.started ? (n.liveId = e.liveid, n.platForm ? WEBRTC.publishLocalStream(n, t) : ATLAS.publishLocalStream(n, t)) : (console.log("直播未开始，不能推流"), "function" == typeof t.fail && t.fail("直播未开始，不能推流"), n.emit("not_live", "直播未开始，不能推流")) : (console.log(e.errorMsg), "function" == typeof t.fail && t.fail(e.errorMsg))
            }, fail: function () {
                console.log("查询直播状态失败，导致没有推流"), "function" == typeof t.fail && t.fail("查询直播状态失败，导致没有推流"), n.emit("local_stream_publish_failed", "推流查询直播状态失败，导致没有推流")
            }
        })
    }, Rtc.prototype.unPublish = function (e) {
        this.platForm ? WEBRTC.unPublish(this, e) : ATLAS.unPublish(this, e)
    }, Rtc.prototype.trySubscribeStream = function (e) {
        this.platForm ? WEBRTC.trySubscribeStream(this, e) : ATLAS.trySubscribeStream(this, e)
    }, Rtc.prototype.unSubscribeStream = function (e) {
        this.platForm ? WEBRTC.unSubscribeStream(this, e) : ATLAS.unSubscribeStream(this, e)
    }, Rtc.prototype.pauseVideo = function (e) {
        this.platForm ? WEBRTC.pauseVideo(e) : ATLAS.pauseVideo(e)
    }, Rtc.prototype.playVideo = function (e) {
        this.platForm ? WEBRTC.playVideo(e) : ATLAS.playVideo(e)
    }, Rtc.prototype.pauseAudio = function (e) {
        this.platForm ? WEBRTC.pauseAudio(e) : ATLAS.pauseAudio(e)
    }, Rtc.prototype.playAudio = function (e) {
        this.platForm ? WEBRTC.playAudio(e) : ATLAS.playAudio(e)
    }, Rtc.prototype.unSubVideo = function (e) {
        this.platForm ? WEBRTC.unSubVideo(e) : ATLAS.unSubVideo(e)
    }, Rtc.prototype.reSubVideo = function (e) {
        this.platForm ? WEBRTC.reSubVideo(e) : ATLAS.reSubVideo(e)
    }, Rtc.prototype.unSubAudio = function (e) {
        this.platForm ? WEBRTC.unSubAudio(e) : ATLAS.unSubAudio(e)
    }, Rtc.prototype.reSubAudio = function (e) {
        this.platForm ? WEBRTC.reSubAudio(e) : ATLAS.reSubAudio(e)
    }, Rtc.prototype.closeRemoteStreams = function () {
        this.platForm || ATLAS.closeRemoteStreams()
    }, Rtc.prototype.closeVideo = function (e) {
        this.platForm ? WEBRTC.closeVideo(this, e) : ATLAS.closeVideo(e)
    }, Rtc.prototype.mixInStream = function (e) {
        API_request.mixInStream(this, e)
    }, Rtc.prototype.setRegion = function (e) {
        API_request.setRegion(this, e)
    }, Rtc.prototype.getConnectionStats = function (e) {
        this.platForm ? WEBRTC.getConnectionStats(e) : ATLAS.getConnectionStats(e)
    }, Rtc.prototype.startRecorder = function (e) {
        ATLAS.startRecorder(this, e)
    }, Rtc.prototype.stopRecorder = function (e) {
        ATLAS.stopRecorder(e)
    }, Rtc.prototype.trySubscribeOtherStream = function (e, t, n) {
        ATLAS.trySubscribeOtherStream(this, e, t, n)
    }, Rtc.prototype.unSubscribeOtherStream = function (e, t) {
        ATLAS.unSubscribeOtherStream(this, e, t)
    }, Rtc.prototype.publishStreamAdd = function (e) {
        API_request.publishStreamAdd(this, e)
    }, Rtc.prototype.unPublishStreamRemoved = function (e, t, n) {
        API_request.unPublishStreamRemoved(this, e, t, n)
    }, Rtc.prototype.streamSubscribe = function (e) {
        API_request.streamSubscribe(this, e)
    }, Rtc.prototype.unStreamSubscribe = function (e) {
        API_request.unStreamSubscribe(this, e)
    }, Rtc.prototype.getLiveStat = function (e) {
        API_request.getLiveStat(this, e)
    }, Rtc.prototype.startLive = function (e) {
        API_request.startLive(this, e)
    }, Rtc.prototype.liveRecord = function (e) {
        API_request.liveRecord(this, e)
    }, Rtc.prototype.stopLive = function (e) {
        API_request.stopLive(this, e)
    }, Rtc.prototype.streamBreak = function () {
        API_request.streamBreak(this)
    }, Rtc.prototype.getNetPoint = function (e) {
        API_request.getNetPoint(this, e)
    }, Rtc.prototype.getDevice = function (e) {
        Device.getDevice(e)
    }, Rtc.prototype.getHistory = function (e) {
        API_request.getHistory(this, e)
    }, Rtc.prototype.logOutRoom = function (e) {
        API_request.logOutRoom(this, e)
    }, Rtc.prototype.streamRecordDone = function (e) {
        ATLAS.streamRecordDone(this, e)
    }, Rtc.prototype.streamRecordDoneApi = function (e) {
        API_request.streamRecordDoneApi(this, e)
    }, Rtc.prototype.updateCustomStatus = function (e) {
        API_request.updateCustomStatus(this, e)
    }, Rtc.prototype.getRoomAllUsers = function () {
        API_request.getRoomAllUsers(this)
    }, Rtc.prototype.switchRoom = function (e) {
        API_request.switchRoom(this, e)
    }, Rtc.prototype.socket_disconnect = function () {
        SOCKET.socket_disconnect()
    }, Rtc.prototype.socket_init = function () {
        SOCKET.init(this)
    }, Rtc.prototype.sendMsg = function (e) {
        SOCKET.send(e)
    }, Rtc.prototype.sendImg = function (e) {
        SOCKET.media(e)
    }, Rtc.prototype.moveInBlacklist = function (e, t) {
        SOCKET.moveInBlacklist(e, t)
    }, Rtc.prototype.moveOutFromAllList = function (e, t) {
        SOCKET.moveOutFromAllList(e, t)
    }, Rtc.prototype.kickOut = function (e, t) {
        SOCKET.kickOut(e, t)
    }, Rtc.prototype.silenceChat = function () {
        SOCKET.silenceChat()
    }, Rtc.prototype.unSilenceChat = function () {
        SOCKET.unSilenceChat()
    }, Rtc.prototype.flip = function (e) {
        SOCKET.flip(e, this)
    }, Rtc.prototype.do_animation = function (e) {
        SOCKET.do_animation(e, this)
    }, Rtc.prototype.draw = function (e, t, n) {
        SOCKET.draw(e, t, n, this)
    }, Rtc.prototype.videoDraw = function (e, t) {
        SOCKET.videoDraw(e, t, this)
    }, Rtc.prototype.startRollcall = function (e, t) {
        SOCKET.startRollcall(e, t, this)
    }, Rtc.prototype.answerRollcall = function (e, t) {
        SOCKET.answerRollcall(e, t, this)
    }, Rtc.prototype.switchUserSetting = function (e, t, n, r) {
        SOCKET.switchUserSetting(e, t, n, r)
    }, Rtc.prototype.warnDown = function (e) {
        SOCKET.warnDown(e)
    }, Rtc.prototype.mediaPlayer = function (e) {
        SOCKET.mediaPlayer(e)
    }, Rtc.prototype.sendPublishMessage = function (e) {
        SOCKET.sendPublishMessage(e)
    }, Rtc.prototype.sendCard = function (e, t, n, r) {
        SOCKET.sendCard(e, t, n, r)
    }, Rtc.prototype.stopAnswer = function (e) {
        SOCKET.stopAnswer(e)
    }, Rtc.prototype.sendAnswer = function (e, t, n, r) {
        SOCKET.sendAnswer(e, t, n, r)
    }, Rtc.prototype.send_card_result = function (e) {
        SOCKET.send_card_result(e)
    }, Rtc.prototype.mqSend = function (e) {
        MQTT.mqSend(e)
    };
    var ATLAS = {
        conference: new Owt.Conference.ConferenceClient([{urls: "stun:turn-cc2.csslcloud.net:80"}, {
            urls: ["turn:turn-cc2.csslcloud.net:80?transport=udp", "turn:turn-cc2.csslcloud.net:443?transport=udp", "turn:turn-cc2.csslcloud.net:80?transport=tcp", "turn:turn-cc2.csslcloud.net:443?transport=tcp"],
            username: "class",
            credential: "class_2017"
        }]),
        otherConference: new Owt.Conference.ConferenceClient,
        extend_id: "fhkhaonmodlnobihbmjnpogaklimmoeo",
        localStreams: {},
        publishStreams: {},
        subscriptions: {},
        otherSubscriptions: {},
        share_stream_pub: null,
        connect: 0,
        mixStream: "",
        reconnect: !1,
        cdnPubNum: 0,
        cdnLock: !0,
        recordObj: {},
        normalBreakStream: [],
        publish_timer: {},
        streamResolution: {},
        streamServerConnect: function (r, i) {
            var o = this, e = {roomid: r.roomid, userid: r.userid, region: r.area_code};
            i.isp && (e.exclude_isp = i.isp), "presenter" === r.userRole || "assistant" === r.userRole ? e.role = 1 : e.role = 0, r.ajax({
                url: "https://" + main_url + "/api/atlas/token/create",
                type: "POST",
                async: !0,
                dataType: "json",
                data: JSON.stringify(e),
                success: function (e) {
                    if ("OK" === (e = JSON.parse(e)).result) {
                        var t = e.token, n = e.isp;
                        r.emit("updataIsp", n), o.AtlasJoin(r, t, i)
                    } else i && "function" == typeof i.fail && i.fail({status: 1001, err: "获取token失败"})
                },
                fail: function (e) {
                    i && "function" == typeof i.fail && i.fail({status: 1001, err: "本地网络异常"})
                }
            })
        },
        AtlasJoin: function (n, e, r) {
            var i = this;
            ATLAS.conference.join(e).then(function (e) {
                n.join_timeout && clearTimeout(n.join_timeout);
                var t = e.remoteStreams;
                r ? "function" == typeof r.success && r.success() : (n.emit("login_success", n.startData), n.emit("conference_join", t), SOCKET.user || (n.socket_init(), SOCKET.user = !0)), ATLAS.connect = 1, t.map(function (e) {
                    e = new CCstream(e), Speaker.streams.push(e), e.isMixed() ? (i.mixStream = e, n.emit("allow_sub", e), Speaker.allow_streams.push(e)) : e.isScreen() ? (n.emit("allow_sub", e), Speaker.allow_streams.push(e)) : "function" == typeof n.ChoicePhoneInit ? n.emit("stream_added", e) : (n.emit("allow_sub", e), Speaker.allow_streams.push(e)), e.stream.addEventListener("ended", function () {
                        i.streamRemove(n, e)
                    })
                })
            }, function (e) {
                n.join_timeout && clearTimeout(n.join_timeout), r ? r && "function" == typeof r.fail && r.fail({
                    status: 1002,
                    err: e
                }) : (n.emit("login_success", n.startData), n.emit("conference_join_failed", e)), console.log("conference_join_failed", e)
            })
        },
        otherAtlasJoin: function (t, e) {
            ATLAS.otherConference.join(e).then(function (e) {
                e.remoteStreams.map(function (e) {
                    (e = new CCstream(e)).isMixed() || InitRtc.emit("otherRoomStream", e), e.stream.addEventListener("ended", function () {
                        t.emit("otherStreamRemove", e)
                    })
                })
            }, function (e) {
                console.log("第二个ATLAS初始化失败"), console.log("conference_join_failed", e)
            })
        },
        init: function (i, e) {
            var o = this;
            e ? this.otherConference.addEventListener("streamadded", function (e) {
                console.log("A new stream is added ", e.stream.id);
                var t = new CCstream(e.stream);
                t.stream.addEventListener("ended", function () {
                    i.emit("otherStreamRemove", t)
                }), t.isMixed() || InitRtc.emit("otherRoomStream", t)
            }) : (this.conference.addEventListener("streamadded", function (e) {
                console.log("A new stream is added ", e.stream.id);
                var t = new CCstream(e.stream);
                t.stream.addEventListener("ended", function () {
                    o.streamRemove(i, t)
                });
                var n = !1;
                if (t.isMixed()) o.mixStream = t; else {
                    if (t.isScreen()) return Speaker.allow_streams.push(t), void i.emit("allow_sub", t);
                    if (t.isCamera()) {
                        for (var r in o.publishStreams) if (o.publishStreams[r] && o.publishStreams[r].id() === t.id()) {
                            n = !0;
                            break
                        }
                        if (n) return
                    }
                }
                Speaker.streams.push(t), "function" == typeof i.ChoicePhoneInit ? i.emit("stream_added", t) : (i.emit("allow_sub", t), Speaker.allow_streams.push(t))
            }), this.conference.addEventListener("serverdisconnected", function (e) {
                if (o.connect = 0, reportData.PreStreamobj = {}, console.log("server_disconnected", e), reportData) for (var t in reportData.reportError(i, 9001), reportData.streamLIST) clearInterval(reportData.streamLIST[t]), delete reportData.streamLIST[t];
                for (var n in ATLAS.publishStreams) ATLAS.publishStreams[n] && (ATLAS.normalBreakStream.push(ATLAS.publishStreams[n].id()), ATLAS.publishStreams[n].stop(), i.emit("stream_removed", ATLAS.publishStreams[n]), delete ATLAS.publishStreams[n]);
                for (var r = 0; r < Speaker.has_sub_streams.length; r++) Speaker.has_sub_streams[r] && i.emit("stream_removed", Speaker.has_sub_streams[r]);
                ATLAS.subscriptions = {}, Speaker.streams = [], Speaker.has_sub_streams = [], Speaker.allow_streams = [], Speaker.remove_streams = [], i.emit("server_disconnected")
            }), this.conference.addEventListener("participantjoined", function (e) {
                i.emit("participantjoined", e)
            }))
        },
        streamRemove: function (e, t) {
            for (var n in this.publishStreams) this.publishStreams[n] && this.publishStreams[n].id() === t.id() && (this.publishStreams[n].stop(), delete this.publishStreams[n]);
            for (var r in this.subscriptions) this.subscriptions[r] && r === t.id() && (this.subscriptions[r].stop(), delete this.subscriptions[r]);
            if (void 0 !== t) {
                delete reportData.PreStreamobj[t.id()];
                var i = t.attr("userid"), o = t.id();
                console.log("stream_removed", t), t.isScreen() ? e.unPublishStreamRemoved(i, o, 1) : e.unPublishStreamRemoved(i, o)
            }
            if (reportData.streamLIST[t.id()] && (clearInterval(reportData.streamLIST[t.id()]), delete reportData.streamLIST[t.id()]), t.attr("userid") === e.viewerid && t.isCamera()) e.emit("stream_removed", t); else {
                var a = t.id();
                VoiceDone.rafID[a] && (window.cancelAnimationFrame(VoiceDone.rafID[a]), delete VoiceDone.rafID[a], VoiceDone.meter[a].shutdown()), Speaker.remove_streams.push(t.id());
                for (var s = 0; s < Speaker.streams.length; s++) Speaker.streams[s].id() === t.id() && Speaker.streams.splice(s, 1);
                for (var c = 0; c < Speaker.allow_streams.length; c++) Speaker.allow_streams[c].id() === t.id() && Speaker.allow_streams.splice(c, 1);
                for (var d = 0; d < Speaker.has_sub_streams.length; d++) Speaker.has_sub_streams[d].id() === t.id() && e.emit("unSub", t);
                e.emit("stream_removed", t)
            }
        },
        leave: function () {
            this.conference.leave()
        },
        isHasLocalStream: function (e, t) {
            return "main" !== e.streamName && "assist" !== e.streamName && "picture" !== e.streamName ? (e && "function" == typeof e.fail && e.fail("streamName为不合法的值"), console.log(t, "streamName为不合法的值"), !1) : "doing" === this.localStreams[e.streamName] ? (e && "function" == typeof e.fail && e.fail("streamName为" + e.streamName + "的本地流创建没完成"), !1) : !(!this.localStreams[e.streamName] || !this.localStreams[e.streamName].attributes() || this.localStreams[e.streamName].attr("streamName") !== e.streamName) || (e && "function" == typeof e.fail && e.fail("streamName为" + e.streamName + "的本地流不存在"), console.log(t, "streamName为" + e.streamName + "的本地流不存在"), !1)
        },
        createLocalStream: function (r, i) {
            var o = this;
            if ("main" === i.streamName || "assist" === i.streamName || "picture" === i.streamName) if ("doing" !== o.localStreams[i.streamName]) if (o.localStreams[i.streamName] && o.localStreams[i.streamName].attr("streamName") === i.streamName) "function" == typeof i.fail && i.fail({
                status: 1002,
                err: "streamName为" + i.streamName + "的本地流已存在"
            }); else {
                o.localStreams[i.streamName] = "doing";
                var e = new Owt.Base.AudioTrackConstraints("mic"), t = new Owt.Base.VideoTrackConstraints("camera");
                t.frameRate = 15, t.resolution = new Owt.Base.Resolution(640, 480);
                var a = null;
                if (i.createData) {
                    var n = i.createData;
                    "boolean" == typeof n.audio && !1 === n.audio ? e = n.audio : n.audio && n.audio.deviceId && (e.deviceId = n.audio.deviceId), "boolean" == typeof n.video && !1 === n.video ? t = n.video : (n.video && n.video.deviceId && (t.deviceId = n.video.deviceId), n.video && "sif" === n.video.resolution ? t.resolution = new Owt.Base.Resolution(320, 240) : n.video && "720P" === n.video.resolution ? t.resolution = new Owt.Base.Resolution(1280, 720) : n.video && "1080P" === n.video.resolution && (t.resolution = new Owt.Base.Resolution(1920, 1080), t.frameRate = 30)), a = new Owt.Base.StreamConstraints(e, t)
                } else a = new Owt.Base.StreamConstraints(e, t);
                console.log(a, "sdk创建本地流音视频对象"), new Owt.Base.MediaStreamFactory.createMediaStream(a).then(function (e) {
                    var t = new Owt.Base.StreamSourceInfo("mic", "camera"),
                        n = {streamName: i.streamName, userid: r.viewerid, role: r.userRole, name: r.name};
                    "picture" === i.streamName && (n.improve = "true"), e.getVideoTracks().length ? n.video = "true" : n.video = "false", e.getAudioTracks().length ? n.audio = "true" : n.audio = "false", 8 == r.template && "presenter" === r.userRole && (n.template = 8), console.log(t), e = new CCstream(new Owt.Base.LocalStream(e, t, n)), o.localStreams[i.streamName] = e, i.success && "function" == typeof i.success && i.success(e), "function" == typeof i.showVoice && VoiceDone.gotStream({
                        stream: e,
                        success: i.showVoice,
                        type: 0
                    }), a.video ? 1920 === a.video.resolution.width ? o.streamResolution[i.streamName] = "1080P" : 1280 === a.video.resolution.width ? o.streamResolution[i.streamName] = "720P" : 640 === a.video.resolution.width ? o.streamResolution[i.streamName] = "vga" : 320 === a.video.resolution.width ? o.streamResolution[i.streamName] = "sif" : o.streamResolution[i.streamName] = "vga" : o.streamResolution[i.streamName] = "vga"
                }, function (e) {
                    delete o.localStreams[i.streamName], console.log("create local stream err:" + e), i.fail && "function" == typeof i.fail && i.fail({
                        status: 1003,
                        err: e
                    })
                })
            } else "function" == typeof i.fail && i.fail({
                status: 1002,
                err: "streamName为" + i.streamName + "的本地流正在创建中，不要重复创建"
            }); else i && "function" == typeof i.fail && i.fail({status: 1001, err: "streamName为不合法的值"})
        },
        publishLocalStream: function (r, i) {
            var o = this;
            if (o.isHasLocalStream(i, "推流失败")) if (ATLAS.publishStreams[i.streamName]) i && "function" == typeof i.fail && i.fail("不能重复推流"); else if (!1 !== ATLAS.publishStreams[i.streamName]) {
                switch (ATLAS.publishStreams[i.streamName] = !1, i.audioRate || (i.audioRate = 50), ATLAS.streamResolution[i.streamName]) {
                    case"1080P":
                        i.videoRate = 3e3;
                        break;
                    case"720P":
                        i.videoRate = 750;
                        break;
                    case"vga":
                        i.videoRate = 500;
                        break;
                    case"sif":
                        i.videoRate = 200;
                        break;
                    default:
                        i.videoRate = 300
                }
                var e = this.localStreams[i.streamName];
                ATLAS.publish_timer[i.streamName] = setTimeout(function () {
                    console.log("推送本地流无回调"), delete ATLAS.publishStreams[i.streamName], r.emit("local_stream_publish_failed", "推流无回调"), i && "function" == typeof i.fail && i.fail("推流无回调")
                }, 1e4);
                var t = [new Owt.Base.AudioEncodingParameters(new Owt.Base.AudioCodecParameters("opus"), i.audioRate)],
                    n = [new Owt.Base.VideoEncodingParameters(new Owt.Base.VideoCodecParameters("h264"), i.videoRate)];
                e.stream.mediaStream.getVideoTracks().length || (n = !1), e.stream.mediaStream.getAudioTracks().length || (t = !1);
                var a = new Owt.Base.PublishOptions(t, n);
                console.log(a), this.conference.publish(e.stream, a).then(function (n) {
                    clearTimeout(ATLAS.publish_timer[i.streamName]), n = new CCstream(n), o.publishStreams[i.streamName] = n, i && "function" == typeof i.success && i.success(n), API_request.publishStreamAdd(r, n, i.videoRate, i.audioRate), e.hasVideo() && reportData.reportStream(r, n, 1), n.stream.addEventListener("ended", function (e) {
                        console.log("Publication ended: ", e);
                        var t = n.id();
                        -1 === o.normalBreakStream.indexOf(t) && r.emit("publishStreamErr", {streamName: i.streamName})
                    }), !0 === i.mix && r.mixInStream({
                        streamId: n.id(), fail: function (e) {
                        }, success: function () {
                            console.log("合流成功")
                        }
                    })
                }, function (e) {
                    delete ATLAS.publishStreams[i.streamName], clearTimeout(ATLAS.publish_timer[i.streamName]), i && "function" == typeof i.fail && i.fail(e), console.log("推流失败", e), r.emit("local_stream_publish_failed", e)
                })
            } else i && "function" == typeof i.fail && i.fail("不能重复推流")
        },
        unPublish: function (e, t) {
            if (this.isHasLocalStream(t, "停止推流失败")) if (ATLAS.publishStreams[t.streamName]) {
                var n = this.publishStreams[t.streamName], r = (e.viewerid, n.id());
                n && (this.normalBreakStream.push(n.id()), n.stop()), delete this.publishStreams[t.streamName], reportData.streamLIST[r] && (clearInterval(reportData.streamLIST[r]), delete reportData.streamLIST[r])
            } else t && "function" == typeof t.fail && t.fail("需要停止的流不存在")
        },
        pauseVideo: function (e) {
            if (this.isHasLocalStream(e, "关闭视频画面失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getVideoTracks().length && (t.mediaStream().getVideoTracks()[0].enabled = !1), e && "function" == typeof e.success && e.success()
            }
        },
        playVideo: function (e) {
            if (this.isHasLocalStream(e, "开启视频画面失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getVideoTracks().length && (t.mediaStream().getVideoTracks()[0].enabled = !0), e && "function" == typeof e.success && e.success()
            }
        },
        pauseAudio: function (e) {
            if (this.isHasLocalStream(e, "关闭音频失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getAudioTracks().length && (t.mediaStream().getAudioTracks()[0].enabled = !1), e && "function" == typeof e.success && e.success()
            }
        },
        playAudio: function (e) {
            if (this.isHasLocalStream(e, "开启音频失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getAudioTracks().length && (t.mediaStream().getAudioTracks()[0].enabled = !0), e && "function" == typeof e.success && e.success()
            }
        },
        hasSubStream: function (e) {
            var t = e.id();
            for (var n in this.subscriptions) if (n == t) return this.subscriptions[n];
            return !1
        },
        unSubVideo: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? "function" == typeof n.stream.mute && (n.stream.mute("video"), e && "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        reSubVideo: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? "function" == typeof n.stream.unmute && (n.stream.unmute("video"), e && "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        unSubAudio: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? "function" == typeof n.stream.mute && (n.stream.mute("audio"), e && "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        reSubAudio: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? "function" == typeof n.stream.unmute && (n.stream.unmute("audio"), e && "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        trySubscribeStream: function (n, r) {
            for (var i = this, o = r.tryStream, e = 0; e < Speaker.remove_streams.length; e++) if (Speaker.remove_streams[e] === o.id()) return void (r && "function" == typeof r.fail && r.fail("该流已被移除"));
            for (var t = 0; t < Speaker.has_sub_streams.length; t++) if (Speaker.has_sub_streams[t].id() === o.id()) return void (r && "function" == typeof r.fail && r.fail("该流在已订阅列表存在"));
            r.tryData ? this.conference.subscribe(o.stream, r.tryData).then(function (e) {
                e = new CCstream(e), i.subscriptions[o.id()] = e, r && "function" == typeof r.success && r.success(o), "function" == typeof r.showVoice && VoiceDone.gotStream({
                    stream: o,
                    success: r.showVoice,
                    type: 1
                }), Speaker.has_sub_streams.push(o);
                for (var t = 0; t < Speaker.streams.length; t++) if (Speaker.streams[t].id() === o.id()) {
                    Speaker.streams.splice(t, 1);
                    break
                }
                API_request.streamSubscribe(n, o), o.hasVideo() && reportData.reportStream(n, o, 0)
            }, function (e) {
                console.log("stream_subscribed_failed", e, o.id()), n.emit("stream_subscribed_failed", e, o.id()), r && "function" == typeof r.fail && r.fail(e)
            }) : this.conference.subscribe(o.stream).then(function (e) {
                e = new CCstream(e), i.subscriptions[o.id()] = e, r && "function" == typeof r.success && r.success(o), "function" == typeof r.showVoice && VoiceDone.gotStream({
                    stream: o,
                    success: r.showVoice,
                    type: 1
                }), Speaker.has_sub_streams.push(o);
                for (var t = 0; t < Speaker.streams.length; t++) if (Speaker.streams[t].id() === o.id()) {
                    Speaker.streams.splice(t, 1);
                    break
                }
                API_request.streamSubscribe(n, o), o.hasVideo() && reportData.reportStream(n, o, 0)
            }, function (e) {
                console.log("stream_subscribed_failed", e, o.id()), n.emit("stream_subscribed_failed", e, o.id()), r && "function" == typeof r.fail && r.fail(e)
            })
        },
        trySubscribeOtherStream: function (t, n, e, r) {
            ATLAS.otherConference.subscribe(n.stream).then(function (e) {
                e = new CCstream(e), ATLAS.otherSubscriptions[n.id()] = e, "function" == typeof r && r(!0, n), API_request.streamSubscribe(t, n)
            }, function (e) {
                "function" == typeof r && r(!1, e)
            })
        },
        unSubscribeStream: function (e, t) {
            for (var n = t.unSubStream, r = !1, i = 0; i < Speaker.has_sub_streams.length; i++) if (Speaker.has_sub_streams[i].id() === n.id()) {
                r = !0;
                break
            }
            if (r) {
                this.subscriptions[n.id()] && this.subscriptions[n.id()].stop(), delete this.subscriptions[n.id()];
                var o = n.id();
                VoiceDone.rafID[o] && (window.cancelAnimationFrame(VoiceDone.rafID[o]), delete VoiceDone.rafID[o], VoiceDone.meter[o].shutdown());
                for (var a = 0; a < Speaker.has_sub_streams.length; a++) Speaker.has_sub_streams[a].id() === n.id() && Speaker.has_sub_streams.splice(a, 1);
                for (var s = !1, c = 0; c < Speaker.remove_streams.length; c++) if (Speaker.remove_streams[c] === n.id()) {
                    s = !0;
                    break
                }
                s || Speaker.streams.push(n);
                for (var d = 0; d < Speaker.allow_streams.length; d++) Speaker.allow_streams[d].id() === n.id() && Speaker.allow_streams.splice(d, 1);
                e.emit("unsub_success", n.id()), t && "function" == typeof t.success && t.success(n.id()), API_request.unStreamSubscribe(e, n), reportData.streamLIST[n.id()] && (clearInterval(reportData.streamLIST[n.id()]), delete reportData.streamLIST[n.id()])
            } else t && "function" == typeof t.fail && t.fail("已订阅列表不存在")
        },
        unSubscribeOtherStream: function (e, t, n) {
            this.otherSubscriptions[t.id()] && (this.otherSubscriptions[t.id()].stop(), delete this.otherSubscriptions[t.id()])
        },
        closeVideo: function (e) {
            if (this.isHasLocalStream(e, "关闭本地流失败")) {
                this.publishStreams[e.streamName] && (this.normalBreakStream.push(this.publishStreams[e.streamName].id()), this.publishStreams[e.streamName].stop(), delete this.publishStreams[e.streamName]);
                var t = this.localStreams[e.streamName], n = t.mediaStream();
                if (n) {
                    var r = t.mediaStream().id;
                    VoiceDone.rafID[r] && (window.cancelAnimationFrame(VoiceDone.rafID[r]), delete VoiceDone.rafID[r], VoiceDone.meter[r].shutdown()), n && n.getTracks().map(function (e) {
                        "function" == typeof e.stop && e.stop(), t.stream.mediaStream = null
                    });
                    var i = "streamId_" + t.id(), o = document.getElementById(i);
                    o && o.parentNode.parentNode.removeChild(o.parentNode)
                }
                delete this.localStreams[e.streamName], e && "function" == typeof e.success && e.success()
            }
        },
        closeRemoteStreams: function () {
            for (var e in ATLAS.publishStreams) ATLAS.publishStreams[e] && (ATLAS.normalBreakStream.push(ATLAS.publishStreams[e].id()), ATLAS.publishStreams[e].stop(), delete ATLAS.publishStreams[e]);
            for (var t in ATLAS.subscriptions) ATLAS.subscriptions[t] && (ATLAS.subscriptions[t].stop(), delete ATLAS.subscriptions[t])
        },
        detectExtension: function (e) {
            var t, n;
            t = new Image, n = ATLAS.extend_id, t.src = "chrome-extension://" + n + "/woogeen_icon_128.png", t.onload = function () {
                e && "function" == typeof e.success && e.success()
            }, t.onerror = function () {
                e && "function" == typeof e.fail && e.fail()
            }
        },
        publishShareStream: function (i, o) {
            var a = this;
            o.audioRate || (o.audioRate = 50), o.videoRate || (o.videoRate = 200);
            var e = {audio: !1, video: {resolution: {width: 1920, height: 1080}, frameRate: 15, source: "screen-cast"}, extensionId: ATLAS.extend_id};
            console.log(e), new Owt.Base.MediaStreamFactory.createMediaStream(e).then(function (e) {
                var t = {name: i.name, userid: i.viewerid, role: i.userRole};
                8 == i.template && "presenter" === i.userRole && (t.template = 8);
                var n = new Owt.Base.LocalStream(e, new Owt.Base.StreamSourceInfo("screen-cast", "screen-cast"), t);
                n = new CCstream(n);
                var r = new Owt.Base.PublishOptions(!1, [new Owt.Base.VideoEncodingParameters(new Owt.Base.VideoCodecParameters("h264"), o.videoRate)]);
                a.conference.publish(n.stream, r).then(function (t) {
                    t = new CCstream(t), a.share_localStream = n, a.share_stream_pub = t, o && "function" == typeof o.success && o.success(n), n.stream.mediaStream.getTracks().map(function (e) {
                        e.onended = function () {
                            a.share_localStream = null, t.stop(), a.share_stream_pub = null
                        }
                    }), API_request.publishStreamAdd(i, t, o.videoRate, o.audioRate, 1), !0 === o.mix && i.mixInStream({
                        streamId: t.id(),
                        fail: function (e) {
                        },
                        success: function () {
                            console.log("合流成功")
                        }
                    })
                }, function (e) {
                    o && "function" == typeof o.fail && o.fail(e)
                })
            }, function (e) {
                console.log("create local stream err:" + e), o.fail && "function" == typeof o.fail && o.fail(e)
            })
        },
        unPubShareStream: function (e) {
            var t = this;
            t.share_localStream && t.share_localStream.stream.mediaStream.getTracks().map(function (e) {
                "function" == typeof e.stop && (e.stop(), t.share_localStream = null)
            }), t.share_stream_pub && t.share_stream_pub.stop(), t.share_stream_pub = null
        },
        getConnectionStats: function (t) {
            var e = t.stream, n = null;
            for (var r in this.publishStreams) if (this.publishStreams[r] && this.publishStreams[r].id() == e.id()) {
                n = this.publishStreams[r];
                break
            }
            for (var i in this.subscriptions) if (this.subscriptions[i] && i == e.id()) {
                n = this.subscriptions[i];
                break
            }
            n ? n.stream.getStats().then(function (e) {
                t && "function" == typeof t.success && t.success(e)
            }, function (e) {
                t && "function" == typeof t.fail && t.fail(e)
            }) : t && "function" == typeof t.fail && t.fail("不存在该流")
        }
    }, WEBRTC = {
        netStatus: 0,
        clients: {},
        localStreams: {},
        publishStreams: {},
        subscriptions: {},
        subSuccess: {},
        pubSuccsss: {},
        transcodingUsers: [],
        uids: [],
        teacher: {height: 720, width: 1280, x: 0, y: 0, zOrder: 0},
        screener: null,
        students: new Map,
        videoWidth: 1280,
        videoHeight: 720,
        maxNum: 5,
        LiveTranscoding: {
            width: 1280,
            height: 720,
            videoBitrate: 400,
            videoFramerate: 15,
            lowLatency: !1,
            audioSampleRate: 48e3,
            audioBitrate: 48,
            audioChannels: 1,
            videoGop: 30,
            videoCodecProfile: 100,
            userCount: 1,
            userConfigExtraInfo: {},
            backgroundColor: 0,
            transcodingUsers: []
        },
        updateTranscoding: function (e) {
            var s = this, t = s.clients.main;
            1 === e.role ? (s.teacher.uid = e.uid, s.screener && s.students.set(e.uid, e.uid)) : 1 === e.action ? 10 === String(e.uid).length ? s.students.set(e.uid, e.uid) : (s.screener = {
                height: 720,
                width: 1280,
                x: 0,
                y: 0,
                zOrder: 0,
                uid: e.uid
            }, s.students.set(s.teacher.uid, s.teacher.uid)) : 0 === e.action && (10 === String(e.uid).length ? s.students.delete(e.uid) : (s.screener = null, s.students.delete(s.teacher.uid)));
            var c = [];
            s.screener ? c.push(s.screener) : c.push(s.teacher);
            var d = parseInt(s.videoWidth / s.maxNum), u = parseInt(s.videoHeight / s.maxNum), l = 0;
            s.students.forEach(function (e) {
                var t = l % s.maxNum * d, n = s.videoHeight - (parseInt(l / s.maxNum) + 1) * u, r = {};
                r.uid = e;
                for (var i = !1, o = 0; o < Speaker.onlineUsers.length; o++) if (parseInt(Speaker.onlineUsers[o].uid) === e) {
                    var a = Speaker.onlineUsers[o].platform;
                    if ("2" !== a && "3" !== a) break;
                    i = !0;
                    break
                }
                i ? (r.width = parseInt(d / 3), r.x = t + r.width) : (r.width = d, r.x = t), r.height = u, r.y = n, r.zOrder = 1, isUpdateRtmpLayout && (r.width = 1, r.height = 1), l++, c.push(r)
            }), s.LiveTranscoding.transcodingUsers = c, s.LiveTranscoding.userCount = c.length, console.log(s.LiveTranscoding), t.setLiveTranscoding(s.LiveTranscoding)
        },
        pubCdnStream: function (e) {
            this.clients.main.startLiveStreaming(e.cdnUrl, !0)
        },
        stopLiveStreaming: function (e) {
            this.clients.main.stopLiveStreaming(e.cdnUrl)
        },
        getToken: function (n, r, i) {
            var o = this, e = {roomid: n.roomid, userid: n.userid, uid: n.uid};
            r && (e.uid = n.screen_uid), n.ajax({
                url: "https://" + main_url + "/api/v1/serve/room/ago/token",
                type: "POST",
                async: !0,
                dataType: "json",
                data: JSON.stringify(e),
                success: function (e) {
                    if ("OK" === (e = JSON.parse(e)).result) {
                        var t = e.token;
                        r ? o.ShareClientInit(n, t, r.streamObj) : o.init(n, t, i)
                    } else console.error("获取token失败"), i && n.emit("publish_stream", i)
                },
                fail: function (e) {
                    console.error("获取token失败", e), i && n.emit("publish_stream", i)
                }
            })
        },
        init: function (r, e, t) {
            var i = this, n = i.clients.main = AgoraRTC.createClient({mode: "live"});
            i.clients.main = n;
            var o = r.appId;
            n.init(o, function () {
                console.log(r.roomid), n.join(e, r.roomid, parseInt(r.uid), function (e) {
                    console.log("User " + e + " join channel successfully"), e, i.uids.push(e), r.hasJoin || (r.emit("login_success", r.startData), r.emit("conference_join"), r.hasJoin = 1, SOCKET.user || (r.socket_init(), SOCKET.user = !0)), t && (r.emit("publish_stream", t), API_request.useLive && (r.emit("live_start", API_request.useLive), API_request.useLive = null))
                }, function (e) {
                    console.error("Join channel failed", e), r.hasJoin || (r.emit("login_success", r.startData), r.emit("conference_join_failed", e), r.hasJoin = 1, SOCKET.user || (r.socket_init(), SOCKET.user = !0)), t && r.emit("publish_stream", t)
                })
            }, function (e) {
                console.error(e, "初始化client失败"), r.hasJoin || (r.emit("login_success", r.startData), r.emit("conference_join_failed", e), r.hasJoin = 1, SOCKET.user || (r.socket_init(), SOCKET.user = !0)), t && r.emit("publish_stream", t)
            }), n.on("stream-added", function (e) {
                var t = e.stream, n = (t = new CCstream(t)).id();
                "presenter" === r.role && i.updateTranscoding({uid: n, role: 0, action: 1}), t.isScreen() ? setTimeout(function () {
                    Speaker.allow_streams.push(t), r.emit("allow_sub", t)
                }, 1e3) : t.isCamera() && -1 < i.uids.indexOf(n) || (Speaker.streams.push(t), "function" == typeof r.ChoicePhoneInit ? r.emit("stream_added", t) : (r.emit("allow_sub", t), Speaker.allow_streams.push(t)))
            }), n.on("stream-published", function (e) {
                console.log("Publish local stream successfully");
                var t = e.stream;
                t = new CCstream(t), i.publishStreams.main = t, "function" == typeof i.pubSuccsss.main && i.pubSuccsss.main(t), t.hasVideo() && reportData.reportStream(r, t, 1), "presenter" === r.role && (i.updateTranscoding({
                    uid: t.id(),
                    role: 1,
                    action: 1
                }), i.pubCdnStream(r))
            }), n.on("stream-subscribed", function (e) {
                var t = e.stream;
                t = new CCstream(t), i.subscriptions[t.id()] = t, "function" == typeof i.subSuccess[t.id()] && i.subSuccess[t.id()](t), Speaker.has_sub_streams.push(t), API_request.streamSubscribe(r, t), t.hasVideo() && reportData.reportStream(r, t, 0)
            }), n.on("stream-removed", function (e) {
                var t, n = (t = new CCstream(t = e.stream)).id();
                "presenter" === r.role && i.updateTranscoding({uid: n, role: 0, action: 0}), console.log(t.id(), "有流remove"), i.removeStream(r, t)
            }), n.on("peer-leave", function (e) {
                var t = e.stream;
                if (t) {
                    var n = (t = new CCstream(t)).id();
                    "presenter" === r.role && i.updateTranscoding({
                        uid: n,
                        role: 0,
                        action: 0
                    }), console.log(t.id(), "有人离开，有流remove"), i.removeStream(r, t)
                }
            }), n.on("network-quality", function (e) {
                if (r.startTime) {
                    var t = 0;
                    switch (Math.max(e.downlinkNetworkQuality, e.uplinkNetworkQuality)) {
                        case 0:
                            t = 700;
                            break;
                        case 1:
                            t = 100;
                            break;
                        case 2:
                            t = 350;
                            break;
                        case 3:
                            t = 700;
                            break;
                        case 4:
                            t = 900;
                            break;
                        case 5:
                            t = 1200;
                            break;
                        case 6:
                            t = 2e3
                    }
                    WEBRTC.netStatus = t
                }
            }), n.on("liveStreamingStarted", function (e) {
                console.log(e, "+++++++++liveStreamingStarted")
            }), n.on("liveStreamingFailed", function (e) {
                console.log(e, "+++++++++liveStreamingFailed")
            }), n.on("error", function (e) {
                console.error("Got error msg:", e.reason)
            }), n.on("exception", function (e) {
                console.log(e.code, e.msg, e.uid, "+++++异常或者恢复++++++")
            }), n.on("connection-state-change", function (e) {
                if ("CONNECTING" === e.prevState && "CONNECTED" === e.curState) {
                    if (r.startTime) {
                        var t = {status: 1, type: "connectionStatus"};
                        InitRtc.emit("connectionStatus", t)
                    }
                } else if ("CONNECTED" === e.prevState && "DISCONNECTED" === e.curState && r.startTime) {
                    t = {status: 0, type: "connectionStatus"};
                    InitRtc.emit("connectionStatus", t)
                }
            })
        },
        removeStream: function (e, t) {
            for (var n = 0; n < Speaker.streams.length; n++) Speaker.streams[n].id() === t.id() && Speaker.streams.splice(n, 1);
            for (var r = 0; r < Speaker.allow_streams.length; r++) Speaker.allow_streams[r].id() === t.id() && Speaker.allow_streams.splice(r, 1);
            for (var i = 0; i < Speaker.has_sub_streams.length; i++) Speaker.has_sub_streams[i].id() === t.id() && Speaker.has_sub_streams.splice(i, 1);
            var o = t.id(), a = t.attr("userid");
            t.isScreen() ? e.unPublishStreamRemoved(a, o, 1) : e.unPublishStreamRemoved(a, o), e.emit("stream_removed", t), reportData.streamLIST[t.id()] && (clearInterval(reportData.streamLIST[t.id()]), delete reportData.streamLIST[t.id()])
        },
        createLocalStream: function (e, t) {
            var n = this;
            if ("main" === t.streamName) if ("doing" !== n.localStreams[t.streamName]) if (n.localStreams[t.streamName]) "function" == typeof t.fail && t.fail({
                status: 1002,
                err: "streamName为" + t.streamName + "的本地流已存在"
            }); else {
                n.localStreams[t.streamName] = "doing";
                var r = {streamID: e.viewerid, audio: !0, video: !0, screen: !1};
                if (t.createData) {
                    var i = t.createData;
                    "boolean" == typeof i.audio && !1 === i.audio ? r.audio = i.audio : i.audio && i.audio.deviceId && (r.microphoneId = i.audio.deviceId), "boolean" == typeof i.video && !1 === i.video ? r.video = i.video : i.video && i.video.deviceId && (r.cameraId = i.video.deviceId)
                }
                var o = AgoraRTC.createStream(r);
                t.createData && t.createData.video && t.createData.video.resolution ? "sif" === t.createData.video.resolution ? o.setVideoProfile("240p") : "vga" === t.createData.video.resolution ? o.setVideoProfile("480p") : "720P" === t.createData.video.resolution ? o.setVideoProfile("720p") : "1080P" === t.createData.video.resolution ? o.setVideoProfile("1080p_2") : o.setVideoProfile("480p") : o.setVideoProfile("480p"), o.on("accessAllowed", function () {
                    console.log("accessAllowed")
                }), o.on("accessDenied", function () {
                    console.log("accessDenied")
                }), o.init(function () {
                    console.log("getUserMedia successfully");
                    var e = new CCstream(o);
                    n.localStreams[t.streamName] = e, t.success && "function" == typeof t.success && t.success(e)
                }, function (e) {
                    console.error("getUserMedia failed", e), delete n.localStreams[t.streamName], console.log("create local stream err:" + e), t.fail && "function" == typeof t.fail && t.fail({
                        status: 1003,
                        err: e
                    })
                })
            } else "function" == typeof t.fail && t.fail({
                status: 1002,
                err: "streamName为" + t.streamName + "的本地流正在创建中，不要重复创建"
            }); else t && "function" == typeof t.fail && t.fail({status: 1001, err: "streamName为不合法的值"})
        },
        isHasLocalStream: function (e, t) {
            return "main" !== e.streamName ? (e && "function" == typeof e.fail && e.fail("streamName为不合法的值"), console.log(t, "streamName为不合法的值"), !1) : "doing" === this.localStreams[e.streamName] ? (e && "function" == typeof e.fail && e.fail("streamName为" + e.streamName + "的本地流创建没完成"), !1) : !!this.localStreams[e.streamName] || (e && "function" == typeof e.fail && e.fail("streamName为" + e.streamName + "的本地流不存在"), console.log(t, "streamName为" + e.streamName + "的本地流不存在"), !1)
        },
        publishLocalStream: function (t, n) {
            if (this.isHasLocalStream(n, "推流失败")) if (this.publishStreams[n.streamName]) n && "function" == typeof n.fail && n.fail("不能重复推流"); else if (!1 !== this.publishStreams[n.streamName]) {
                this.publishStreams[n.streamName] = !1, "function" == typeof n.success && (this.pubSuccsss.main = n.success);
                var e = this.localStreams[n.streamName];
                this.clients.main.publish(e.stream, function (e) {
                    console.error("Publish local stream error: " + e), n && "function" == typeof n.fail && n.fail(e), t.emit("local_stream_publish_failed", e)
                }), API_request.publishStreamAdd(t, e, n.videoRate, n.audioRate)
            } else n && "function" == typeof n.fail && n.fail("不能重复推流")
        },
        unPublish: function (e, t) {
            if (this.isHasLocalStream(t, "停止推流失败")) if (this.publishStreams[t.streamName]) {
                this.publishStreams[t.streamName] && delete this.publishStreams[t.streamName];
                var n = this.clients.main, r = this.localStreams.main;
                n.unpublish(r.stream, function (e) {
                    console.log(e, "unpublish fail"), t && "function" == typeof t.fail && t.fail(e)
                }), e.unPublishStreamRemoved(e.viewerid, e.viewerid), reportData.streamLIST[r.id()] && (clearInterval(reportData.streamLIST[r.id()]), delete reportData.streamLIST[r.id()])
            } else t && "function" == typeof t.fail && t.fail("需要停止的流不存在")
        },
        trySubscribeStream: function (t, n) {
            for (var r = n.tryStream, e = 0; e < Speaker.has_sub_streams.length; e++) if (Speaker.has_sub_streams[e].id() === r.id()) return void (n && "function" == typeof n.fail && n.fail("该流在已订阅列表存在"));
            var i = this.clients.main;
            if ("function" == typeof n.success) {
                var o = r.id();
                this.subSuccess[o] = n.success
            }
            n.tryData ? i.subscribe(r.stream, n.tryData, function (e) {
                console.error("Subscribe stream failed", e), t.emit("stream_subscribed_failed", e, r.id()), n && "function" == typeof n.fail && n.fail(e)
            }) : i.subscribe(r.stream, function (e) {
                console.error("Subscribe stream failed", e), t.emit("stream_subscribed_failed", e, r.id()), n && "function" == typeof n.fail && n.fail(e)
            })
        },
        unSubscribeStream: function (e, t) {
            for (var n = t.unSubStream, r = !1, i = 0; i < Speaker.has_sub_streams.length; i++) if (Speaker.has_sub_streams[i].id() === n.id()) {
                r = !0;
                break
            }
            if (r) {
                this.subscriptions[n.id()] && delete this.subscriptions[n.id()], this.clients.main.unsubscribe(n.stream, function (e) {
                    console.log("unSubscribe stream failed", e)
                });
                for (var o = 0; o < Speaker.has_sub_streams.length; o++) Speaker.has_sub_streams[o].id() === n.id() && Speaker.has_sub_streams.splice(o, 1);
                for (var a = 0; a < Speaker.allow_streams.length; a++) Speaker.allow_streams[a].id() === n.id() && Speaker.allow_streams.splice(a, 1);
                t && "function" == typeof t.success && t.success(n.id()), API_request.unStreamSubscribe(e, n), reportData.streamLIST[n.id()] && (clearInterval(reportData.streamLIST[n.id()]), delete reportData.streamLIST[n.id()])
            } else t && "function" == typeof t.fail && t.fail("已订阅列表不存在")
        },
        closeVideo: function (e, t) {
            if (this.isHasLocalStream(t, "关闭本地流失败")) {
                var n = this.localStreams[t.streamName], r = n.stream;
                if (r) {
                    r.close(), this.unPublish(e, {streamName: t.streamName});
                    var i = "streamId_" + n.id(), o = document.getElementById(i);
                    o && o.parentNode.parentNode.removeChild(o.parentNode)
                }
                delete this.localStreams[t.streamName], this.publishStreams[t.streamName] && delete this.publishStreams[t.streamName], t && "function" == typeof t.success && t.success()
            }
        },
        pauseVideo: function (e) {
            if (this.isHasLocalStream(e, "关闭视频画面失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getVideoTracks().length && t.stream.muteVideo(), e && "function" == typeof e.success && e.success()
            }
        },
        playVideo: function (e) {
            if (this.isHasLocalStream(e, "开启视频画面失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getVideoTracks().length && t.stream.unmuteVideo(), e && "function" == typeof e.success && e.success()
            }
        },
        pauseAudio: function (e) {
            if (this.isHasLocalStream(e, "关闭音频失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getAudioTracks().length && t.stream.muteAudio(), e && "function" == typeof e.success && e.success()
            }
        },
        playAudio: function (e) {
            if (this.isHasLocalStream(e, "开启音频失败")) {
                var t = this.localStreams[e.streamName];
                0 < t.mediaStream().getAudioTracks().length && t.stream.unmuteAudio(), e && "function" == typeof e.success && e.success()
            }
        },
        hasSubStream: function (e) {
            var t = e.id();
            for (var n in this.subscriptions) if (n == t) return this.subscriptions[n];
            return !1
        },
        unSubVideo: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? (this.clients.main.subscribe(n.stream, {video: !1, audio: !0}, function (e) {
                console.log("Subscribe stream failed", e)
            }), "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        reSubVideo: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? (this.clients.main.subscribe(n.stream, {video: !0, audio: !0}, function (e) {
                console.log("Subscribe stream failed", e)
            }), "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        unSubAudio: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? (this.clients.main.subscribe(n.stream, {video: !0, audio: !1}, function (e) {
                console.log("Subscribe stream failed", e)
            }), "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        reSubAudio: function (e) {
            var t = e.stream, n = this.hasSubStream(t);
            n ? (this.clients.main.subscribe(n.stream, {video: !0, audio: !0}, function (e) {
                console.log("Subscribe stream failed", e)
            }), "function" == typeof e.success && e.success()) : e && "function" == typeof e.fail && e.fail("不存在该流")
        },
        ShareClientInit: function (n, e, t) {
            var r = this, i = AgoraRTC.createClient({mode: "live"}), o = n.appId;
            i.init(o, function () {
                console.log(n.roomid), i.join(e, n.roomid, parseInt(n.screen_uid), function (e) {
                    r.shareClient = i, console.log("User " + e + " join channel successfully"), r.uids.push(e), r.createShareStream(n, t)
                }, function (e) {
                    console.error("Join channel failed", e), "function" == typeof t.fail && t.fail(e)
                })
            }, function (e) {
                console.error(e, "初始化失败"), "function" == typeof t.fail && t.fail(e)
            }), i.on("stream-published", function (e) {
                console.log("Publish local stream successfully");
                var t = e.stream;
                t = new CCstream(t), r.share_stream_pub = t, r.pubShareSuccess && r.pubShareSuccess(r.share_localStream)
            }), i.on("connection-state-change", function (e) {
                if ("CONNECTING" === e.prevState && "CONNECTED" === e.curState) {
                    if (n.startTime) {
                        var t = {status: 1, type: "screenConnectionStatus"};
                        InitRtc.emit("screenConnectionStatus", t)
                    }
                } else if ("CONNECTED" === e.prevState && "DISCONNECTED" === e.curState && n.startTime) {
                    t = {status: 0, type: "screenConnectionStatus"};
                    InitRtc.emit("screenConnectionStatus", t)
                }
            })
        },
        publishShareStream: function (e, t) {
            this.shareClient ? this.share_localStream ? (console.log("不能重复创建桌面流"), t.fail && "function" == typeof t.fail && t.fail({
                status: 1001,
                err: "不能重复创建桌面流"
            })) : this.createShareStream(e, t) : this.getToken(e, {streamObj: t})
        },
        createShareStream: function (t, n) {
            var r = this, e = {streamID: t.viewerid, audio: !1, video: !1, screen: !0}, i = AgoraRTC.createStream(e);
            i.setVideoProfile("1080p"), i.on("accessAllowed", function () {
                console.log("accessAllowed")
            }), i.on("accessDenied", function () {
                console.error("accessDenied")
            }), i.init(function () {
                console.log("getUserMedia successfully");
                var e = new CCstream(i);
                r.share_localStream = e, "function" == typeof n.success && (r.pubShareSuccess = n.success), r.shareClient.publish(e.stream, function (e) {
                    console.log("publish share stream err", e), n.fail && "function" == typeof n.fail && n.fail({status: 1003, err: e})
                }), API_request.publishStreamAdd(t, e, n.videoRate, 50, 1), i.on("stopScreenSharing", function (e) {
                    console.log("桌面已被停止", e), r.share_localStream && (r.share_stream_pub && r.shareClient.unpublish(r.share_localStream.stream, function (e) {
                        console.log(e)
                    }), r.share_stream_pub = null, r.share_localStream.stream.close(), r.share_localStream = null)
                })
            }, function (e) {
                console.error("getUserMedia failed", e), delete r.localStreams[n.streamName], console.log("create local stream err:" + e), n.fail && "function" == typeof n.fail && n.fail({
                    status: 1003,
                    err: e
                })
            })
        },
        unPubShareStream: function (e) {
            this.share_localStream && (this.share_stream_pub && this.shareClient.unpublish(this.share_localStream.stream, function (e) {
                console.log(e)
            }), this.share_stream_pub = null, this.share_localStream.stream.close(), this.share_localStream = null, e.unPublishStreamRemoved(e.viewerid, e.screen_uid))
        },
        getConnectionStats: function (t) {
            var e = t.stream, n = null;
            for (var r in this.publishStreams) if (this.publishStreams[r] && this.publishStreams[r].id() == e.id()) {
                n = this.publishStreams[r];
                break
            }
            for (var i in this.subscriptions) if (this.subscriptions[i] && i == e.id()) {
                n = this.subscriptions[i];
                break
            }
            n ? n.stream.getStats(function (e) {
                t && "function" == typeof t.success && t.success(e)
            }) : t && "function" == typeof t.fail && t.fail("不存在该流")
        }
    }, API_request = {
        useLive: null, publishStreamAdd: function (e, t, n, r, i) {
            var o = {roomid: e.roomid, userid: e.viewerid, streamid: t.id(), video_bitrate: n, audio_bitrate: r, time: (new Date).getTime()};
            i && (o.source_type = 1);
            var a = 0;
            !function t() {
                a < 3 && e.ajax({
                    url: "https://" + main_url + "/api/atlas/stream/added", type: "GET", data: o, success: function (e) {
                        var e = JSON.parse(e);
                        "OK" === e.result ? console.log("ccapi/stream/added", "ok") : (console.log("ccapi/stream/added", e.errorMsg), a++, t())
                    }, fail: function (e) {
                        a++, t()
                    }
                })
            }()
        }, unPublishStreamRemoved: function (e, t, n, r) {
            var i = {roomid: e.roomid, userid: t, streamid: n, time: (new Date).getTime()};
            r && (i.source_type = 1), e.ajax({
                url: "https://" + main_url + "/api/atlas/stream/remove", type: "GET", data: i, success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? console.log("ccapi/stream/remove", "ok") : console.log("ccapi/stream/remove", e.errorMsg)
                }
            })
        }, streamSubscribe: function (e, t) {
            e.ajax({
                url: "https://" + main_url + "/api/atlas/stream/subscribe",
                type: "GET",
                data: {roomid: e.roomid, userid: e.viewerid, streamid: t.id(), time: (new Date).getTime()},
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? console.log("ccapi/stream/subscribe", "ok") : console.log("ccapi/stream/subscribe", e.errorMsg)
                }
            })
        }, unStreamSubscribe: function (e, t) {
            e.ajax({
                url: "https://" + main_url + "/api/atlas/stream/unsubscribe",
                type: "GET",
                data: {roomid: e.roomid, userid: e.viewerid, streamid: t.id(), time: (new Date).getTime()},
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? console.log("ccapi/stream/unsubscribe", "ok") : console.log("ccapi/stream/unsubscribe", e.errorMsg)
                }
            })
        }, getLiveStat: function (e, t) {
            e.ajax({
                url: "https://" + main_url + "/api/live/stat", type: "GET", data: {roomid: e.roomid}, success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? !0 === e.started ? (t && "function" == typeof t.success && t.success(e), console.log("直播开始状态", e)) : (t && "function" == typeof t.fail && t.fail("直播关闭状态"), console.log("直播关闭状态", e)) : (t && "function" == typeof t.fail && t.fail(e.errorMsg), console.log("查询直播出错", e.errorMsg))
                }, fail: function (e) {
                    t && "function" == typeof t.fail && t.fail(e), console.log("查询直播出错", e)
                }
            })
        }, startLive: function (t, n) {
            var e = {roomid: t.roomid, userid: t.userid};
            n && 1 === n.status ? e.isrecord = 1 : n && 0 === n.status && (e.isrecord = 0), t.ajax({
                url: "https://" + main_url + "/api/live/start",
                type: "GET",
                data: e,
                beforeSend: function () {
                    t.emit("live_before_send")
                },
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? (t.platForm ? API_request.useLive = e : t.emit("live_start", e), n && "function" == typeof n.success && n.success(e), console.log("成功开始直播"), t.liveId = e.liveId) : (t.emit("live_start_err"), n && "function" == typeof n.fail && n.fail("开始直播调用失败"), console.log("发送开始直播事件失败"), reportData.reportError(t, 9012)), reportData.reportBasic(t, e)
                },
                fail: function (e) {
                    t.emit("live_start_err"), n && "function" == typeof n.fail && n.fail(e), console.log("开启直播出错", e)
                }
            })
        }, stopLive: function (t, n) {
            t.ajax({
                url: "https://" + main_url + "/api/live/stop",
                type: "GET",
                data: {roomid: t.roomid, userid: t.userid, loginid: t.viewerid},
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? (t.emit("end_live"), n && "function" == typeof n.success && n.success("结束直播调用成功"), console.log("成功发送结束直播事件")) : (t.emit("end_live_err"), n && "function" == typeof n.fail && n.fail(e), console.log("发送结束直播事件失败"))
                },
                fail: function (e) {
                    n && "function" == typeof n.fail && n.fail(e), console.log("结束直播出错", e)
                }
            })
        }, liveRecord: function (e, t) {
            if (t && t.liveId && t.status) {
                var n = t.status;
                if (-1 < ["start", "end", "pause", "resume"].indexOf(n)) {
                    var r = "https://" + main_url + "/api/record/" + n;
                    e.ajax({
                        type: "GET", url: r, async: !0, data: {liveid: t.liveId}, dataType: "json", success: function (e) {
                            "OK" === (e = JSON.parse(e)).result ? t && "function" == typeof t.success && t.success(e) : "FAIL" === e.result && t && "function" == typeof t.fail && t.fail(e)
                        }, fail: function (e) {
                            console.log(e), t && "function" == typeof t.fail && t.fail(e)
                        }
                    })
                } else t && "function" == typeof t.fail && t.fail("参数错误")
            } else t && "function" == typeof t.fail && t.fail("参数错误")
        }, streamBreak: function (e) {
            e.ajax({
                url: "https://" + main_url + "/api/atlas/stream/break",
                type: "GET",
                data: {roomid: e.roomid, userid: e.viewerid},
                success: function (e) {
                    (e = JSON.parse(e)).result
                }
            })
        }, ping: function (r) {
            var i;
            r.url && InitRtc.ajax({
                type: "GET", url: r.url, async: !0, data: {}, noClientId: 1, dataType: "json", beforeSend: function () {
                    i = (new Date).getTime()
                }, success: function (e) {
                    var t = (new Date).getTime(), n = Math.abs(i - t);
                    "function" == typeof r.result && r.result(n, r.index)
                }, fail: function (e) {
                    console.log(e, "获取节点时间失败")
                }
            })
        }, getNetPoint: function (e, i) {
            var o = this, a = 3e3;
            i.timeOut && (a = i.timeOut), e.ajax({
                url: "https://" + main_url + "/api/dispatch", type: "GET", data: {}, success: function (e) {
                    if ("OK" === (e = JSON.parse(e)).result) {
                        for (var n = e.data, t = 0; t < n.length; t++) {
                            var r = n[t].detect_url;
                            o.ping({
                                index: t, url: r, result: function (e, t) {
                                    n[t].delay = e
                                }
                            })
                        }
                        setTimeout(function () {
                            if (i && "function" == typeof i.success) {
                                var e = JSON.stringify(n);
                                i.success(JSON.parse(e))
                            }
                        }, a)
                    } else i && "function" == typeof i.fail && i.fail(e)
                }, fail: function (e) {
                    console.log(e), i && "function" == typeof i.fail && i.fail(e)
                }
            })
        }, getHistory: function (t, n) {
            t.jsonp({
                url: "https://view.csslcloud.net/api/view/info",
                callbackName: "callback",
                time: "30000",
                data: {roomid: t.roomid, userid: t.userid},
                success: function (e) {
                    e.startLiveTime = t.startTime, e.success ? (n && "function" == typeof n.success && n.success(e), t.emit("get_history", e)) : (n && "function" == typeof n.fail && n.fail("初始化文档失败:" + e.msg), console.log("初始化文档失败:" + e.msg))
                },
                error: function () {
                    n && "function" == typeof n.fail && n.fail("time out")
                }
            })
        }, logOutRoom: function (e, t) {
            e.ajax({
                type: "GET", url: "https://" + main_url + "/api/user/logout", data: {sessionid: e.sessionid}, success: function (e) {
                    "OK" === (e = JSON.parse(e)).result && t && "function" == typeof t.success && t.success()
                }, fail: function (e) {
                }
            })
        }, reportBasicinfo: function (e, t) {
            e.ajax({
                type: "POST", url: reportData.reportDomain + "/api/basicinfo/", data: t, dataType: "json", async: !0, success: function (e) {
                    "OK" === (e = JSON.parse(e)).result || console.log("基本信息上报失败", e)
                }, fail: function (e) {
                    console.log("基本信息上报失败", e)
                }
            })
        }, reportStreaminfo: function (e, t) {
            e.ajax({
                type: "POST", url: reportData.reportDomain + "/api/streaminfo/", data: t, async: !0, success: function (e) {
                    (e = JSON.parse(e)).result
                }, fail: function (e) {
                }
            })
        }, reportErrorinfo: function (e, t) {
            e.ajax({
                type: "POST", url: reportData.reportDomain + "/api/errorinfo/", data: t, async: !0, success: function (e) {
                    (e = JSON.parse(e)).result
                }, fail: function (e) {
                    console.log("错误信息上报失败", e)
                }
            })
        }, reportConfig: function (e) {
            e.ajax({
                type: "GET", url: "https://" + main_url + "/api/v1/serve/metric/get", success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? (console.log("获取时间成功", e), reportData.reportTime = 1e3 * e.data.interval, e.data.domain && (reportData.reportDomain = "https://" + e.data.domain)) : console.log("获取时间失败", e)
                }, fail: function (e) {
                    console.log("获取时间失败", e)
                }
            })
        }, streamRecordDoneApi: function (e, n) {
            var r = 0;
            !function t() {
                r < 3 ? setTimeout(function () {
                    e.ajax({
                        type: "GET", url: "https://" + main_url + "/api/record/stream/start", data: n, success: function (e) {
                            "OK" !== (e = JSON.parse(e)).result && (r++, t())
                        }, fail: function () {
                            r++, t()
                        }
                    })
                }, 1e3 * r) : (e.emit("StartRecorderError", "录制上报信息失败"), reportData.reportError(e, 9017))
            }()
        }, mixInStream: function (e, t) {
            var n = t.streamId;
            n || (console.log("流ID不存在"), "function" == typeof t.fail && t.fail("流ID不存在"));
            var r = {streamid: n, userid: e.userid, roomid: e.roomid};
            "talker" === e.userRole ? r.role = 0 : r.role = 1, e.ajax({
                type: "GET",
                data: r,
                url: "https://" + main_url + "/api/atlas/stream/mix",
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? "function" == typeof t.success && t.success() : "function" == typeof t.fail && t.fail(e)
                },
                fail: function (e) {
                    "function" == typeof t.fail && t.fail(e)
                }
            })
        }, setRegion: function (e, t) {
            var n = t.streamId;
            n || (console.log("流ID不存在"), "function" == typeof t.fail && t.fail("流ID不存在"));
            var r = {streamid: n, userid: e.userid, roomid: e.roomid};
            "talker" === e.userRole ? r.role = 0 : r.role = 1, e.ajax({
                type: "GET",
                data: r,
                url: "https://" + main_url + "/api/atlas/stream/replace",
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? "function" == typeof t.success && t.success() : "function" == typeof t.fail && t.fail("setRegion fail")
                },
                fail: function (e) {
                    "function" == typeof t.fail && t.fail(e)
                }
            })
        }, updateCustomStatus: function (e, t) {
            "number" == typeof t.status && 0 <= t.status && t.status <= 999 ? e.ajax({
                type: "GET",
                data: {roomid: e.roomid, userid: e.viewerid, status: t.status},
                url: "https://" + main_url + "/api/user/speak/device",
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? "function" == typeof t.success && t.success() : "function" == typeof t.fail && t.fail(e)
                },
                fail: function (e) {
                    "function" == typeof t.fail && t.fail(e)
                }
            }) : "function" == typeof t.fail && t.fail("参数错误")
        }, getRoomAllUsers: function (n) {
            n.ajax({
                type: "GET",
                url: "https://" + main_url + "/api/v1/serve/room/user/list",
                async: !0,
                data: {roomid: n.roomid},
                dataType: "json",
                success: function (e) {
                    var t = JSON.parse(e);
                    "OK" === t.result && n.emit("presenter_room_users", t.data)
                },
                fail: function (e) {
                    console.log(e)
                }
            })
        }, switchRoom: function (t, n) {
            t.ajax({
                url: "https://" + main_url + "/api/user/speak/double_tech/switch",
                type: "GET",
                data: {roomid: t.roomid, userid: t.viewerid, switch: n},
                success: function (e) {
                    "OK" === (e = JSON.parse(e)).result ? (console.log("切换成功"), t.emit("switch_room_success", n)) : t.emit("switch_room_fail", n)
                }
            })
        }
    }, reportData = {
        errStreamIds: {},
        publishStreamStatus: {},
        sendErrMessage: function (e, t) {
            SOCKET.mediaPlayer({type: "publishStreamEvent", action: "publishStreamEvent", data: {streamid: e, userid: t}})
        },
        PreStreamobj: {},
        checkStreamStatus: function (that) {
            function arrAverageNum(arr) {
                var sum = eval(arr.join("+"));
                return ~~(sum / arr.length * 100) / 100
            }

            setInterval(function () {
                var e = {delay: "", packetLost: "", netStatus: "", action: "netStatus"}, t = [], n = [];
                for (var r in reportData.PreStreamobj) reportData.PreStreamobj[r] && reportData.streamLIST[r] && (t.push(reportData.PreStreamobj[r].delay), n.push(reportData.PreStreamobj[r].lost));
                0 < t.length && (e.delay = arrAverageNum(t), 3e3 < e.delay && (e.delay = 3e3), e.packetLost = arrAverageNum(n), that.platForm ? e.netStatus = WEBRTC.netStatus : e.netStatus = e.delay + 100 * e.packetLost * 150, that.emit("netStatus", e))
            }, 2e3)
        },
        reportBasicinfo: {
            userid: "",
            liveid: "",
            roomid: "",
            nodeip: "",
            device: 2,
            resolution: "",
            bitrate: "200",
            system_info: "",
            socketurl: "",
            speakers_permission: !0,
            microphone_permission: !0,
            atlas_token: "",
            sdkversion: "4.0.0",
            role: ""
        },
        reportStreaminfo: {userid: "", liveid: "", roomid: "", role: "", system_info: ""},
        reportTime: 6e4,
        reportDomain: "https://dean.csslcloud.net",
        streamLIST: {},
        reportErrorinfo: {
            userid: "",
            liveid: "",
            roomid: "",
            role: "",
            error_code: "",
            publisher_bitrate: "200",
            talker_bitrate: "200",
            system_info: ""
        },
        init: function (e, t) {
            this.getreportTime(e), new Owt.Base.MediaStreamFactory.createMediaStream({audio: !0}).then(function (e) {
                reportData.reportBasicinfo.microphone_permission = !0, e.getTracks().map(function (e) {
                    "function" == typeof e.stop && e.stop()
                })
            }, function (e) {
                reportData.reportBasicinfo.microphone_permission = !1
            }), new Owt.Base.MediaStreamFactory.createMediaStream({video: !0}).then(function (e) {
                reportData.reportBasicinfo.speakers_permission = !0, e.getTracks().map(function (e) {
                    "function" == typeof e.stop && e.stop()
                })
            }, function (e) {
                reportData.reportBasicinfo.speakers_permission = !1
            }), this.reportBasicinfo.userid = t.user.id, this.reportBasicinfo.roomid = t.user.roomid, this.reportBasicinfo.system_info = this.system_info(), this.reportBasicinfo.socketurl = t.chart_server[0], this.reportBasicinfo.nodeip = t.live.isp, this.reportBasicinfo.resolution = window.localStorage.getItem("video_device_resolution") || "default", this.reportBasicinfo.atlas_token = t.live.atlas_token, this.reportBasicinfo.role = t.user.role, t.live.id && (this.reportBasicinfo.liveid = t.live.id, this.reportStreaminfo.liveid = t.live.id, this.reportErrorinfo.liveid = t.live.id), setTimeout(function () {
                "presenter" !== t.user.role ? (reportData.reportBasicinfo.bitrate = t.talker_bitrate, API_request.reportBasicinfo(e, JSON.stringify(reportData.reportBasicinfo))) : reportData.reportBasicinfo.bitrate = t.publisher_bitrate
            }, 2e3), this.reportStreaminfo.userid = t.user.id, this.reportStreaminfo.roomid = t.user.roomid, this.reportStreaminfo.role = t.user.role, this.reportStreaminfo.system_info = this.system_info(), this.reportErrorinfo.userid = t.user.id, this.reportErrorinfo.roomid = t.user.roomid, this.reportErrorinfo.role = t.user.role, this.reportErrorinfo.system_info = this.system_info(), this.checkStreamStatus(e)
        },
        reportBasic: function (e, t) {
            this.reportBasicinfo.resolution = window.localStorage.getItem("video_device_resolution") || "", t.liveId && (this.reportBasicinfo.liveid = t.liveId, this.reportStreaminfo.liveid = t.liveId, this.reportErrorinfo.liveid = t.liveId), API_request.reportBasicinfo(e, JSON.stringify(this.reportBasicinfo))
        },
        reportStream: function (m, t, h) {
            var v = 0, g = t.id();
            if (!reportData.streamLIST[g]) {
                reportData.reportStreaminfo.liveid || m.getLiveStat({
                    success: function (e) {
                        reportData.reportBasicinfo.liveid = e.liveid, reportData.reportStreaminfo.liveid = e.liveid, reportData.reportErrorinfo.liveid = e.liveid
                    }
                });
                var y = 0, S = {
                    userid: this.reportStreaminfo.userid,
                    liveid: this.reportStreaminfo.liveid,
                    roomid: this.reportStreaminfo.roomid,
                    role: m.userRole,
                    system_info: this.reportStreaminfo.system_info,
                    data: []
                }, b = null;
                reportData.PreStreamobj[g] = null, setTimeout(function () {
                    m.getConnectionStats({
                        stream: t, success: function (e) {
                            m.platForm ? r(e, t) : n(e, t)
                        }, fail: function () {
                            clearInterval(reportData.streamLIST[t.id()]), delete reportData.streamLIST[t.id()]
                        }
                    })
                }, 1e3), reportData.streamLIST[g] = setInterval(function () {
                    m.getConnectionStats({
                        stream: t, success: function (e) {
                            m.platForm ? r(e, t) : n(e, t)
                        }, fail: function () {
                            clearInterval(reportData.streamLIST[t.id()]), delete reportData.streamLIST[t.id()]
                        }
                    }), v % 60 == 0 && (S.liveid || (S.liveid = reportData.reportStreaminfo.liveid), m.platForm || API_request.reportStreaminfo(m, JSON.stringify(S)), S.data.length = 0)
                }, 2e3)
            }

            function n(e, t) {
                v += 2;
                var r = [];
                if (r[0] = null, e.forEach(function (e, t, n) {
                    "audio" === e.mediaType ? r[1] = e : "video" === e.mediaType && (r[2] = e)
                }), !r[1] || !r[2]) return clearInterval(reportData.streamLIST[t.id()]), void delete reportData.streamLIST[t.id()];
                var n = 0, i = 0, o = "", a = 0, s = 0;
                1 === h ? (o = n = 0, i = b ? (a = 8 * parseInt(r[2].bytesSent - b[2].bytesSent) / 2e3, parseInt(r[2].packetsLost - b[2].packetsLost) / parseInt(r[2].packetsSent - b[2].packetsSent + parseInt(r[2].packetsLost - b[2].packetsLost))) : (a = 8 * parseInt(r[2].bytesSent) / 2e3, parseInt(r[2].packetsLost) / parseInt(r[2].packetsSent + parseInt(r[2].packetsLost)))) : (s = b ? (n = parseInt(r[1].packetsLost - b[1].packetsLost) / (parseInt(r[1].packetsLost - b[1].packetsLost) + parseInt(r[1].packetsReceived - b[1].packetsReceived)), i = parseInt(r[2].packetsLost - b[2].packetsLost) / (parseInt(r[2].packetsLost - b[2].packetsLost) + parseInt(r[2].packetsReceived - b[2].packetsReceived)), 8 * parseInt(r[2].bytesReceived - b[2].bytesReceived) / 2e3) : (n = parseInt(r[1].packetsLost) / (parseInt(r[1].packetsLost) + parseInt(r[1].packetsReceived)), i = parseInt(r[2].packetsLost) / (parseInt(r[2].packetsReceived) + parseInt(r[2].packetsLost)), 8 * parseInt(r[2].bytesReceived) / 2e3), o = Math.max.apply(null, [r[1].googCurrentDelayMs, r[2].googCurrentDelayMs])), o = parseInt(o), isNaN(n) && (n = 0), isNaN(i) && (i = 0);
                var c = "", d = "";
                r[2] && (c = r[2].packetsSent || "", d = r[2].packetsReceived || "");
                var u = "", l = "";
                r[1] && (u = r[1].packetsSent || "", l = r[1].packetsReceived || "");
                var p = {
                    streamid: g,
                    role: h,
                    time: Math.floor((new Date).getTime() / 1e3),
                    retransmit_bitrate: 0,
                    transmit_bitrate: 0,
                    send_bitrate: a,
                    receive_bitrate: s,
                    video_send: c,
                    video_resv: d,
                    audio_send: u,
                    audio_resv: l,
                    delay: o,
                    audio_lost: n,
                    video_lost: i,
                    video_bytesReceived: r[2].bytesReceived || "",
                    video_WidthReceived: r[2].googFrameWidthReceived || "",
                    video_HeightReceived: r[2].googFrameHeightReceived || "",
                    video_bytesSent: r[2].bytesSent || "",
                    video_WidthSent: r[2].googFrameWidthSent || "",
                    video_HeightSent: r[2].googFrameHeightSent || "",
                    status: 1001
                };
                S.data.push(p);
                var f = {
                    stream: t,
                    type: 1 === h ? 0 : 1,
                    status: 1001,
                    delay: p.delay,
                    bandWidth: 1 === h ? p.send_bitrate : p.receive_bitrate,
                    action: "streamStatus"
                };
                0 === h ? reportData.PreStreamobj[g] ? parseInt(p.video_resv) - parseInt(reportData.PreStreamobj[g].video_resv) == 0 && parseInt(p.video_bytesReceived) - parseInt(reportData.PreStreamobj[g].video_bytesReceived) == 0 ? ++y < 5 ? f.status = 1002 : (f.status = 1003, reportData.errStreamIds[g] ? f.streamException = 1 : f.streamException = 2) : (y = 0, f.status = 1001, reportData.errStreamIds[g] && delete reportData.errStreamIds[g]) : 0 === parseInt(p.video_resv) && 0 === parseInt(p.video_bytesReceived) ? (y++, f.status = 1002) : (y = 0, f.status = 1001, reportData.errStreamIds[g] && delete reportData.errStreamIds[g]) : reportData.PreStreamobj[g] ? parseInt(p.video_send) - parseInt(reportData.PreStreamobj[g].video_send) == 0 && parseInt(p.video_bytesSent) - parseInt(reportData.PreStreamobj[g].video_bytesSent) == 0 ? (y++, f.status = y < 5 ? 1002 : 1003, 3 <= y && reportData.sendErrMessage(g, m.viewerid)) : (y = 0, f.status = 1001) : 0 === parseInt(p.video_send) && 0 === parseInt(p.video_bytesSent) ? (y++, f.status = 1002) : (y = 0, f.status = 1001), p.status = f.status, m.emit("streamStatus", f), reportData.PreStreamobj[g] = p, reportData.PreStreamobj[g].lost = Math.max.apply(null, [p.audio_lost, p.video_lost]), b = r, f.status, 1001 != p.status ? S.data.push(p) : v % 30 == 0 && S.data.push(p)
            }

            function r(e, t) {
                if (!e) return clearInterval(reportData.streamLIST[t.id()]), void delete reportData.streamLIST[t.id()];
                var n = 0, r = 0, i = 0;
                1 === h ? (i = parseInt(e.accessDelay), r = b ? (n = parseInt(e.audioSendPacketsLost - b.audioSendPacketsLost) / (parseInt(e.audioSendPacketsLost - b.audioSendPacketsLost) + parseInt(e.audioSendPackets - b.audioSendPackets)), parseInt(e.videoSendPacketsLost - b.videoSendPacketsLost) / parseInt(e.videoSendPackets - b.videoSendPackets + parseInt(e.videoSendPacketsLost - b.videoSendPacketsLost))) : (n = parseInt(e.audioSendPacketsLost) / (parseInt(e.audioSendPacketsLost) + parseInt(e.audioSendPackets)), parseInt(e.videoSendPacketsLost) / parseInt(e.videoSendPacketsLost + parseInt(e.videoSendPackets)))) : (r = b ? (n = parseInt(e.audioReceivePacketsLost - b.audioReceivePacketsLost) / (parseInt(e.audioReceivePacketsLost - b.audioReceivePacketsLost) + parseInt(e.audioReceivePackets - b.audioReceivePackets)), parseInt(e.videoReceivePacketsLost - b.videoReceivePacketsLost) / (parseInt(e.videoReceivePacketsLost - b.videoReceivePacketsLost) + parseInt(e.videoReceivePackets - b.videoReceivePackets))) : (n = parseInt(e.audioReceivePacketsLost) / (parseInt(e.audioReceivePacketsLost) + parseInt(e.audioReceivePackets)), parseInt(e.videoReceivePacketsLost) / (parseInt(e.videoReceivePackets) + parseInt(e.videoReceivePacketsLost))), i = Math.max.apply(null, [e.audioReceiveDelay, e.videoReceiveDelay])), i = parseInt(i), isNaN(n) && (n = 0), isNaN(r) && (r = 0);
                var o = {streamid: g, role: h, delay: i, audio_lost: n, video_lost: r};
                reportData.PreStreamobj[g] = o, reportData.PreStreamobj[g].lost = Math.max.apply(null, [o.audio_lost, o.video_lost]), b = e
            }
        },
        reportError: function (e, t) {
            this.reportErrorinfo.error_code = t, reportData.reportErrorinfo.liveid || e.getLiveStat({
                success: function (e) {
                    reportData.reportErrorinfo.liveid = e.liveid
                }
            }), API_request.reportErrorinfo(e, JSON.stringify(this.reportErrorinfo))
        },
        system_info: function () {
            var e = navigator.userAgent.toLowerCase();
            if (0 < e.indexOf("chrome")) {
                var t = e.match(/chrome\/[\d.]+/gi);
                return t = t.join().split("/").join("_")
            }
        },
        getreportTime: function (e) {
            API_request.reportConfig(e)
        },
        setRoomID: function (e) {
            this.reportErrorinfo.userid = e.userid, void 0 !== e.roomid && (this.reportErrorinfo.roomid = e.roomid)
        }
    }, SOCKET = {
        status: 1,
        things_arr: ["chat_message", "media_chat", "page_change", "draw", "room_user_count", "room_user_list", "switch_settings", "silence_user_chat_message", "recover_user_chat_message", "switch_user_settings", "start_rollcall", "answer_rollcall", "rollcall_list", "room_timer", "start_vote", "stop_vote", "reply_vote", "vote_result", "speak_lock", "speak_rotate", "device_fail", "animation_change"],
        user: !1,
        init: function (s) {
            var e = this;

            function t(t) {
                e.socket.on(t, function (e) {
                    s.emit(t, e)
                })
            }

            this.socket = io.connect(s.socket_address + "/" + s.roomid, {
                query: "sessionid=" + s.sessionid,
                secure: !0
            }), new SocketSentinel(this.socket, s.socket_spare_address + "/" + s.roomid), this.socket.on("reconnect", function (e) {
                console.log("成功重连"), s.emit("reconnect_user", e)
            }), this.socket.on("reconnecting", function (e) {
                console.log("正在重连"), s.emit("reconnecting_user", e)
            }), this.socket.on("disconnect", function (e) {
                console.log("断开连接"), reportData.reportError(s, 9003), s.emit("disconnect_user", e)
            }), this.socket.on("connect", function (e) {
                console.log("连接成功"), s.emit("connect_user", e)
            }), this.socket.on("warn_teacher_selfdown", function (e) {
                s.emit("warn_down", e)
            }), this.socket.on("kick_out", function (e) {
                ATLAS.leave(), s.socket_disconnect(), SOCKET.status = 0, s.emit("kick_out", e)
            }), this.socket.on("router", function (e) {
                var t = JSON.parse(e), n = t.operate;
                if (t.action = n || t.action, "avMedia" === t.action ? "audioMedia" === t.type ? s.emit("audio_player", t) : "videoMedia" === t.type && s.emit("video_player", t) : "video_scale" === t.action && s.emit("video_scale", t), "lock_screen" === t.type) "lock_screen_open" === t.action ? s.emit("lock_screen_open", t) : "lock_screen_close" === t.action && s.emit("lock_screen_close", t); else if ("republish" === t.type) s.emit("republish", t); else if ("brainstom" === t.type) "send_brainstom" === t.action ? s.emit("presenter_brainstom", t) : "reply_brainstom" === t.action ? s.emit("talker_brainstom", t) : "end_brainstom" === t.action && s.emit("end_brainstom", t); else if ("vote" === t.type) "send_vote" === t.action ? s.emit("presenter_vote", t) : "reply_vote" === t.action ? s.emit("talker_vote", t) : "end_vote" === t.action && s.emit("end_vote", t); else if ("publish_message" === t.type) "publish_message" === t.action && s.emit("publish_message", t.data); else if ("media_sync" === t.type) s.emit("media_sync", t); else if ("update_time" === t.type) "update_time_talker" === t.action && s.emit("update_time_talker", t); else if ("media" === t.type) "warm_close" === t.action ? s.emit("warm_close", t) : "warm_open" === t.action && s.emit("warm_open", t); else if ("reward" === t.type) "flower" === t.action ? s.emit("send_flower", t) : "cup" === t.action && s.emit("send_cup", t); else if ("double_tech" === t.type) "switch_on" === t.action ? s.emit("double_switch_on", t) : "switch_off" === t.action ? s.emit("double_switch_off", t) : "tech_eval" === t.action && s.emit("tech_eval", t); else if ("exam" === t.type) "start_exam" === t.action ? s.emit("start_exam", t) : "submit_exam_record" === t.action ? s.emit("talkSubmitAnswer", t) : "end_exam" === t.action ? s.emit("end_exam", t) : "hide_exam" === t.action && s.emit("hide_exam", t); else if ("class_assess" === t.type) "send_assess" === t.action && s.emit("send_assess", t); else if ("information" === t.type) {
                    if ("updateStatus" === t.action) {
                        var r = t.data.userid, i = t.data.custom;
                        for (var o in Speaker.onlineUsers) if (Speaker.onlineUsers[o].id === r) {
                            Speaker.onlineUsers[o].custom = i, s.emit("custom_status_updated", {userid: r, custom: i});
                            break
                        }
                    }
                } else if ("publishStreamEvent" === t.type && t.data.userid !== s.viewerid) {
                    var a = t.data.streamid;
                    reportData.errStreamIds[a] || (reportData.errStreamIds[a] = a)
                }
            }), this.socket.on("room_context", function (e) {
                Speaker.roomContext(e, s), s.emit("room_context", e)
            }), this.socket.on("speak_context", function (e) {
                Speaker.speakContext(e, s), s.emit("speak_context", e)
            }), this.socket.on("publish_stream", function (e) {
                s.startTime = (new Date).getTime(), setTimeout(function () {
                    platForm || s.emit("publish_stream", e)
                }, 500), platForm && (Speaker.streams = [], Speaker.has_sub_streams = [], Speaker.allow_streams = [], Speaker.remove_streams = [], WEBRTC.getToken(s, null, e))
            }), this.socket.on("end_stream", function (e) {
                for (var t in s.startTime = 0, s.emit("end_stream", e), s.unPublish({streamName: "main"}), s.unPubShareStream(), platForm ? (setTimeout(function () {
                    WEBRTC.clients.main && (WEBRTC.clients.main.leave(), WEBRTC.clients.main = null), WEBRTC.shareClient && (WEBRTC.shareClient.leave(), WEBRTC.shareClient = null), Speaker.streams = [], Speaker.has_sub_streams = [], Speaker.allow_streams = [], Speaker.remove_streams = []
                }, 1e3), "presenter" === s.role && (WEBRTC.stopLiveStreaming(s), WEBRTC.students.clear())) : (s.unPublish({streamName: "assist"}), s.unPublish({streamName: "picture"})), reportData.streamLIST) clearInterval(reportData.streamLIST[t]), delete reportData.streamLIST[t];
                API_request.useLive && (API_request.useLive = null)
            });
            for (var n = 0; n < this.things_arr.length; n++) {
                t(this.things_arr[n])
            }
            setTimeout(function () {
                try {
                    SOCKET.socket.emit("room_user_count")
                } catch (e) {
                }
            }, 1500), setInterval(function () {
                try {
                    SOCKET.socket.emit("room_user_count")
                } catch (e) {
                }
            }, 3e3)
        },
        socket_disconnect: function () {
            this.socket.disconnect()
        },
        send: function (e) {
            return "" !== e ? 400 < e.length ? void console.log("聊天字数超出限制") : (this.socket.emit("chat_message", e), !0) : (console.log("msg is null"), !1)
        },
        media: function (e) {
            return "" !== e ? 400 < e.length ? void console.log("聊天字数超出限制") : (this.socket.emit("media_chat", e), !0) : (console.log("msg is null"), !1)
        },
        flip: function (e, t) {
            var n = t.startTime, r = Math.floor(((new Date).getTime() - n) / 1e3), i = !0 === e.useSDK || !1 === e.useSDK,
                o = void 0 === e.t || null === e.t, a = 0 === parseInt(e.mode) || 1 === parseInt(e.mode) || 2 === parseInt(e.mode);
            if (e.id && !o && e.u && i && a) {
                var s = {
                    action: "page_change",
                    value: {
                        fileName: e.n,
                        docid: e.id,
                        totalPage: e.t,
                        url: e.u,
                        page: e.p,
                        useSDK: e.useSDK,
                        mode: e.mode,
                        width: e.w,
                        height: e.h,
                        pageTitle: "" + e.r,
                        userid: t.viewerid
                    },
                    time: r,
                    message_from: "class"
                };
                "presenter" === t.userRole && (s.value.currentTime = (new Date).getTime()), this.socket.emit("page_change", JSON.stringify(s))
            } else console.log("翻页数据不合法", e)
        },
        do_animation: function (e, t) {
            var n = t.startTime, r = Math.floor(((new Date).getTime() - n) / 1e3),
                i = {action: "animation_change", value: {docid: e.id, step: e.s, page: e.n}, time: r, message_from: "class"};
            this.socket.emit("animation_change", JSON.stringify(i))
        },
        draw: function (e, t, n, r) {
            var i = r.startTime, o = {
                message_from: "class",
                action: "draw",
                value: {fileName: e, page: t, data: n},
                time: Math.floor(((new Date).getTime() - i) / 1e3)
            };
            this.socket.emit("draw", JSON.stringify(o))
        },
        videoDraw: function (e, t, n) {
            var r = n.startTime, i = {
                message_from: "class",
                action: "draw",
                value: {value_type: "video_draw", fileName: e, page: -1, data: t},
                time: Math.floor(((new Date).getTime() - r) / 1e3)
            };
            this.socket.emit("draw", JSON.stringify(i))
        },
        startRollcall: function (e, t, n) {
            var r = {message_from: "class", rollcallId: t, publisherId: n.viewerid, duration: e};
            this.socket.emit("start_rollcall", JSON.stringify(r))
        },
        answerRollcall: function (e, t, n) {
            var r = {message_from: "class", rollcallId: e, userId: n.viewerid, userName: n.name, publisherId: t};
            this.socket.emit("answer_rollcall", JSON.stringify(r))
        },
        moveInBlacklist: function (e, t) {
            var n = void 0;
            try {
                if (!e) throw"输入操作用户的ID";
                var r = {userId: e};
                this.socket.emit("blacklist_user", JSON.stringify(r))
            } catch (e) {
                n = e
            } finally {
                "function" == typeof t && t(n)
            }
        },
        moveOutFromAllList: function (e, t) {
            var n = void 0;
            try {
                if (!e) throw"输入操作用户的ID";
                var r = {userId: e};
                this.socket.emit("remove_list", JSON.stringify(r))
            } catch (e) {
                n = e
            } finally {
                "function" == typeof t && t(n)
            }
        },
        silenceChat: function (e) {
            var t = void 0;
            try {
                this.socket.emit("silence_room_chat")
            } catch (e) {
                t = e
            } finally {
                "function" == typeof e && e(t)
            }
        },
        unSilenceChat: function (e) {
            var t = void 0;
            try {
                this.socket.emit("recover_silence_room_chat")
            } catch (e) {
                t = e
            } finally {
                "function" == typeof e && e(t)
            }
        },
        switchUserSetting: function (e, t, n, r) {
            var i = {changed: e, userId: t, value: n, role: r};
            this.socket.emit("switch_user_settings", JSON.stringify(i))
        },
        kickOut: function (e, t) {
            var n = void 0;
            try {
                if (!e) throw"参数错误";
                var r = {userId: e};
                this.socket.emit("kick_out", JSON.stringify(r))
            } catch (e) {
                n = e
            } finally {
                "function" == typeof t && t(n)
            }
        },
        warnDown: function (e) {
            var t = {teacherId: e};
            this.socket.emit("warn_teacher_selfdown", JSON.stringify(t))
        },
        mediaPlayer: function (e) {
            this.socket.emit("router", JSON.stringify(e))
        },
        sendPublishMessage: function (e) {
            if (400 < JSON.stringify(e).length) console.log("聊天字数超出限制"); else {
                var t = {type: "publish_message", action: "publish_message", data: e};
                this.socket.emit("router", JSON.stringify(t))
            }
        },
        sendCard: function (e, t, n, r) {
            var i = {message_from: "class", publisherId: e, voteCount: t, voteId: n, voteType: r};
            this.socket.emit("start_vote", JSON.stringify(i))
        },
        stopAnswer: function (e) {
            var t = {voteId: e, message_from: "class"};
            this.socket.emit("stop_vote", JSON.stringify(t))
        },
        sendAnswer: function (e, t, n, r) {
            var i = {message_from: "class", voteId: e, voteOption: t, publisherId: n, userName: r};
            this.socket.emit("reply_vote", JSON.stringify(i))
        },
        send_card_result: function (e) {
            e.message_from = "class", this.socket.emit("vote_result", JSON.stringify(e))
        }
    }, Device = {
        getDevice: function (i) {
            navigator.mediaDevices.enumerateDevices().then(function (e) {
                if (0 < e.length) {
                    for (var t = {video: [], audio: []}, n = 0; n < e.length; n++) {
                        var r = e[n];
                        "videoinput" === r.kind && t.video.push(r), "audioinput" === r.kind && t.audio.push(r)
                    }
                    i && "function" == typeof i.success && i.success(t)
                } else i && "function" == typeof i.fail && i.fail("没有获取到设备")
            })
        }
    }, Speaker = {
        streams: [],
        allow_streams: [],
        has_sub_streams: [],
        remove_streams: [],
        onlineUsers: [],
        userSettings: [],
        roomOptions: {},
        oldList: null,
        time: 0,
        getOtherUsersTimer: null,
        sendTime: function (e, t) {
            var n = {time: (new Date).valueOf(), type: "list_sync", data: {userid: e.userid, timestamp: t}};
            e.mqSend(JSON.stringify(n))
        },
        comPareArr: function (e, t) {
            for (var n = [], r = 0; r < e.length; r++) {
                for (var i = !1, o = 0; o < t.length; o++) if (e[r].id === t[o].id) {
                    i = !0;
                    break
                }
                i || n.push(e[r])
            }
            return n
        },
        updateStatus: function (e, t) {
            var n = {userid: InitRtc.viewerid, roomid: InitRtc.roomid, status: e};
            3 == e && (n.streamid = t), InitRtc.ajax({
                type: "GET",
                data: n,
                url: "https://" + main_url + "/api/user/speak/patch",
                success: function (e) {
                    (e = JSON.parse(e)).result
                }
            })
        },
        roomContext: function (e, t) {
            var n = JSON.parse(e), r = n.onlineUsers, i = n.time;
            if (this.userSettings = n.userSettings, t.startTime && !Speaker.firstJoin && (t.startTime = t.startTime + ((new Date).getTime() - i)), Speaker.firstJoin = !0, console.log("room_context", n), !(this.time > i)) {
                if (this.time = i, MQTT.connect && this.sendTime(t, i), Speaker.oldList) {
                    "string" == typeof Speaker.oldList && (Speaker.oldList = JSON.parse(Speaker.oldList));
                    for (var o = Speaker.oldList.length, a = 0; a < o; a++) {
                        for (var s = !1, c = 0; c < r.length; c++) if (Speaker.oldList[a].id === r[c].id && Speaker.oldList[a].id === t.viewerid) {
                            s = !0;
                            var d = Speaker.oldList[a].status, u = Speaker.oldList[a].streamId, l = r[c].status,
                                p = parseInt(Speaker.oldList[a].custom);
                            p && t.updateCustomStatus({status: p}), d != l && (1 == d || 2 == d || 4 == d ? Speaker.updateStatus(d) : 3 == d && Speaker.updateStatus(d, u));
                            break
                        }
                        if (s) {
                            Speaker.oldList = null;
                            break
                        }
                    }
                }
                var f = r, m = Speaker.onlineUsers, h = 0;
                for (a = 0; a < r.length; a++) r[a].id === t.viewerid && (h = 1);
                if (!h && SOCKET.status && "inspector" !== t.userRole && (Speaker.oldList = JSON.stringify(m), t.socket_disconnect(), console.log("人员被删除，主动断开恢复状态-------------------"), setTimeout(function () {
                    t.socket_init()
                }, 1e3)), 0 !== f.length && 0 !== m.length) {
                    for (var v = Speaker.comPareArr(f, m), g = Speaker.comPareArr(m, f), y = 0; y < v.length; y++) {
                        (S = {}).id = v[y].id, S.name = v[y].name, t.emit("join_room_user", S)
                    }
                    for (y = 0; y < g.length; y++) {
                        var S;
                        if ((S = {}).id = g[y].id, S.name = g[y].name, 3 == g[y].status && !t.platForm) for (var b = 0; b < Speaker.has_sub_streams.length; b++) "function" == typeof Speaker.has_sub_streams[b].attr && Speaker.has_sub_streams[b].attr("userid") == S.id && (t.emit("stream_removed", Speaker.has_sub_streams[b]), t.emit("unSub", Speaker.has_sub_streams[b]));
                        t.emit("exit_room_user", S)
                    }
                }
                this.onlineUsers = r, "presenter" === t.userRole && 8 == t.template || t.emit("online_users", r)
            }
        },
        speakContext: function (e, t, n) {
            var r = JSON.parse(e), i = r.down_by, o = r.onlineUsers;
            this.time = r.time, MQTT.connect && (n || this.sendTime(t, r.time)), console.log("speak_context", r), i && t.emit("teacher_down_by", i), this.onlineUsers = o, "presenter" === t.userRole && 8 == t.template || t.emit("online_users", o)
        },
        getSpeakerOnline: function (r) {
            r.ajax({
                type: "GET",
                url: "https://" + main_url + "/api/room/speakcontext",
                async: !0,
                data: {roomid: r.roomid, userid: r.userid},
                dataType: "json",
                success: function (e) {
                    var t = JSON.parse(e);
                    if ("OK" === t.result) {
                        var n = JSON.stringify(t.data);
                        Speaker.speakContext(n, r, 1)
                    }
                },
                fail: function (e) {
                    console.log(e)
                }
            })
        }
    }, MQTT = {
        connect: 0, mqtt: null, topic: null, init: function (n, e, t, r) {
            var i = e, o = 443, a = MQTT.topic = "yunclass/" + t, s = !0, c = "GID_yunclass@@@" + mqttClientId, d = 2e3, u = "LTAI93BDpFFme1TH";

            function l() {
                MQTT.mqtt = new Paho.MQTT.Client(i, o, c);
                var e = {
                    timeout: 3, onSuccess: p, mqttVersion: 4, onFailure: function (e) {
                        setTimeout(l, d)
                    }
                };
                MQTT.mqtt.onConnectionLost = f, MQTT.mqtt.onMessageArrived = m, null != u && (e.useSSL = s), MQTT.mqtt.connect(e)
            }

            function p() {
                console.log("链接mqtt返回成功", "==========");
                var e = new Paho.MQTT.Message(JSON.stringify({token: r, type: "RW"}));
                e.destinationName = "$SYS/uploadToken", MQTT.mqtt.send(e), MQTT.connect = 1, MQTT.mqtt.subscribe(a, {qos: 2})
            }

            function f(e) {
                MQTT.connect = 0, setTimeout(l, d)
            }

            function m(e) {
                var t = e.payloadString;
                MQTT.dataProcessing(n, t)
            }

            l()
        }, mqSend: function (e) {
            if (MQTT.connect) {
                var t = new Paho.MQTT.Message(e);
                t.destinationName = MQTT.topic, MQTT.mqtt.send(t)
            }
        }, dataProcessing: function (e, t) {
            var n;
            if ("string" == typeof t) try {
                n = JSON.parse(t)
            } catch (e) {
                n = t
            }
            if ("list_sync" === n.type) {
                var r = n.data.timestamp;
                Speaker.getOtherUsersTimer && clearTimeout(Speaker.getOtherUsersTimer), Speaker.getOtherUsersTimer = setTimeout(function () {
                    Speaker.time < r && Speaker.getSpeakerOnline(e)
                }, 3e3)
            } else e.emit("mqttMessage", t)
        }
    }, VoiceDone = {
        audioContext: {}, meter: {}, rafID: {}, mediaStreamTrack: {}, mediaStreamSource: {}, gotStream: function (e) {
            var t = "", n = e.stream.mediaStream();
            0 === e.type ? t = e.stream.mediaStream.id : 1 === e.type && (t = e.stream.id()), window.AudioContext = window.AudioContext || window.webkitAudioContext, VoiceDone.audioContext[t] = new AudioContext, VoiceDone.mediaStreamTrack[t] = n, VoiceDone.mediaStreamSource[t] = VoiceDone.audioContext[t].createMediaStreamSource(n), VoiceDone.meter[t] = VoiceDone.createAudioMeter(VoiceDone.audioContext[t]), VoiceDone.mediaStreamSource[t].connect(VoiceDone.meter[t]), VoiceDone.drawLoop(t, e.success)
        }, createAudioMeter: function (e, t, n, r) {
            var i = e.createScriptProcessor(512);
            return i.onaudioprocess = VoiceDone.volumeAudioProcess, i.clipping = !1, i.lastClip = 0, i.volume = 0, i.clipLevel = t || .98, i.averaging = n || .95, i.clipLag = r || 750, i.connect(e.destination), i.checkClipping = function () {
                return !!this.clipping && (this.lastClip + this.clipLag < window.performance.now() && (this.clipping = !1), this.clipping)
            }, i.shutdown = function () {
                this.disconnect(), this.onaudioprocess = null
            }, i
        }, volumeAudioProcess: function (e) {
            for (var t, n = e.inputBuffer.getChannelData(0), r = n.length, i = 0, o = 0; o < r; o++) t = n[o], Math.abs(t) >= this.clipLevel && (this.clipping = !0, this.lastClip = window.performance.now()), i += t * t;
            var a = Math.sqrt(i / r);
            this.volume = Math.max(a, this.volume * this.averaging)
        }, drawLoop: function (n, r) {
            !function e() {
                var t = parseInt(2 * VoiceDone.meter[n].volume * 100);
                100 < t && (t = 100);
                "function" == typeof r && r(t);
                VoiceDone.rafID[n] = window.requestAnimationFrame(e)
            }()
        }
    };
    window.addEventListener("beforeunload", function (e) {
        for (var t in ATLAS.publishStreams) ATLAS.publishStreams[t] && (ATLAS.normalBreakStream.push(ATLAS.publishStreams[t].id()), ATLAS.publishStreams[t].stop());
        ATLAS.share_stream_pub && (ATLAS.share_stream_pub.stop(), "function" == typeof ATLAS.share_stream_pub.id && API_request.unPublishStreamRemoved(InitRtc, InitRtc.viewerid, ATLAS.share_stream_pub.id(), 1)), WEBRTC.clients.main && WEBRTC.clients.main.leave(), WEBRTC.shareClient && WEBRTC.shareClient.leave()
    }, !1), window.Rtc = Rtc, window.ATLAS = ATLAS, window.Speaker = Speaker, window.reportData = reportData, window.MQTT = MQTT, window.VoiceDone = VoiceDone, window.WEBRTC = WEBRTC
}(window);
