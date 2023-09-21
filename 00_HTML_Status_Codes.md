# HTTP Status Code Guide

> The status-code element is a 3-digit integer code giving the result of the attempt to understand and satisfy the request.

## Classes

> The first digit of the status-code defines the class of response. The last two digits do not have any categorization role. There are 5 values for the first digit:

## The important codes have their description highlighted.
### 1xx

Code | Reason | Description
---: | :----- | :---------- 
`1xx` | **Informational** | This indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response.
`100` | Continue | This iindicates that the initial part of a request has been received and has not yet been rejected by the server.
`101` | Switching Protocols | This indicates that the server understands and is willing to comply with the client's request, via the Upgrade header field, for a change in the application protocol being used on this connection.

### 2xx

Code | Reason | Description 
---: | :----- | :---------- 
`2xx` | **Successful** | This indicates that the client's request was successfully received, understood, and accepted. ***Happy Happy Happy***
`200` | **OK** | This indicates that the request has succeeded.
`201` | **Created** | This indicates that the request has been fulfilled and has resulted in one or more new resources being created.
`202` | **Accepted** | This indicates that the request has been accepted for processing, but the processing has not been completed.
`203` | Non-Authoritative Information | This indicates that the request was successful but the enclosed payload has been modified from that of the origin server's 200 (OK) response by a transforming proxy.
`204` | No Content | This indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.
`205` | Reset Content | This indicates that the server has fulfilled the request and desires that the user agent reset the "document view", which caused the request to be sent, to its original state as received from the origin server.
`206` | Partial Content | This indicates that the server is successfully fulfilling a range request for the target resource by transferring one or more parts of the selected representation that correspond to the satisfiable ranges found in the requests's Range header field.

### 3xx

Code | Reason | Description 
---: | :----- | :---------- 
`3xx` | **Redirection** | This indicates that further action needs to be taken by the user agent in order to fulfill the request. ***"Ask that guy over there"***
`300` | Multiple Choices | This indicates that the target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers.
`301` | **Moved Permanently** | This indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs.
`302` | **Found** | This indicates that the target resource resides temporarily under a different URI.
`303` | See Other | This indicates that the server is redirecting the user agent to a different resource, as indicated by a URI in the Location header field, that is intended to provide an indirect response to the original request.
`304` | **Not Modified** | This indicates that a conditional GET request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition has evaluated to false.
`305` | Use Proxy | *Deprecated*  
`306` | | *Unused* 
`307` | Temporary Redirect | This indicates that the target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI.

### 4xx

Code | Reason | Description 
---: | :----- | :---------- 
`4xx` | **Client Error** | This indicates that the client seems to have erred. ***You the user messed up***
`400` | **Bad Request** | This indicates that the server cannot or will not process the request because the received syntax is invalid, nonsensical, or exceeds some limitation on what the server is willing to process.
`401` | Unauthorized | This indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
`402` | Payment Required | *Reserved* 
`403` | **Forbidden** | This indicates that the server understood the request but refuses to authorize it.
`404` | **Not Found** | This indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
`405` | Method Not Allowed | This indicates that the method specified in the request-line is known by the origin server but not supported by the target resource.
`406` | Not Acceptable | This indicates that the target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request, and the server is unwilling to supply a default representation.
`407` | Proxy Authentication Required | This is similar to 401 (Unauthorized), but indicates that the client needs to authenticate itself in order to use a proxy.
`408` | Request Timeout | This indicates that the server did not receive a complete request message within the time that it was prepared to wait.
`409` | Conflict | This indicates that the request could not be completed due to a conflict with the current state of the resource.
`410` | Gone | This indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent.
`411` | Length Required | This indicates that the server refuses to accept the request without a defined Content-Length.
`412` | Precondition Failed | This indicates that one or more preconditions given in the request header fields evaluated to false when tested on the server.
`413` | Payload Too Large | This indicates that the server is refusing to process a request because the request payload is larger than the server is willing or able to process.
`414` | URI Too Long | This indicates that the server is refusing to service the request because the request-target is longer than the server is willing to interpret.
`415` | Unsupported Media Type | This indicates that the origin server is refusing to service the request because the payload is in a format not supported by the target resource for this method.
`416` | Range Not Satisfiable | This indicates that none of the ranges in the request's Range header field overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges.
`417` | Expectation Failed | This indicates that the expectation given in the request's Expect header field could not be met by at least one of the inbound servers.
`418` | **I'm a teapot** | Any attempt to brew coffee with a teapot should result in the error code 418 I'm a teapot. ***:D***
`426` | Upgrade Required | This indicates that the server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.

### 5xx

Code | Reason | Description 
---: | :----- | :---------- 
`5xx` | **Server Error** | This indicates that the server is aware that it has erred or is incapable of performing the requested method. ***Basically the server messed up :D***
`500` | **Internal Server Error** | This iindicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
`501` | **Not Implemented** | Indicates that the server does not support the functionality required to fulfill the request.
`502` | Bad Gateway | This indicates that the server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
`503` | Service Unavailable | This indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.
`504` | Gateway Time-out | This indicates that the server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.
`505` | HTTP Version Not Supported | This indicates that the server does not support, or refuses to support, the protocol version that was used in the request message.

## Extras

Code | Reason | Description 
---: | :----- | :---------- 
`102` | Processing | It is an interim response used to inform the client that the server has accepted the complete request, but has not yet completed it. 
`207` | Multi-Status | Provides status for multiple independent operations.
`226` | IM Used | The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
`308` | Permanent Redirect | The target resource has been assigned a new permanent URI and any future references to this resource outght to use one of the enclosed URIs. This status code is similar to 301 Moved Permanently, except that it does not allow rewriting the request method from POST to GET.
`422` | Unprocessable Entity | "means the server understands the content type of the request entity (hence a 415(Unsupported Media Type) status code is inappropriate), and the syntax of the request entity is correct (thus a 400 (Bad Request) status code is inappropriate) but was unable to process the contained instructions." 
`423` | Locked | "means the source or destination resource of a method is locked." 
`424` | Failed Dependency | "means that the method could not be performed on the resource because the requested action depended on another action and that action failed."
`428` | Precondition Required | This indicates that the origin server requires the request to be conditional."
`429` | Too Many Requests | This indicates that the user has sent too many requests in a given amount of time ("rate limiting")." 
`431` | Request Header Fields Too Large | This indicates that the server is unwilling to process the request because its header fields are too large." 
`451` | Unavailable For Legal Reasons | "This status code indicates that the server is denying access to the resource in response to a legal demand."
`506` | Variant Also Negotiates | This indicates that the server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process."
`507` | Insufficient Storage | "means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request."
`511` | Network Authentication Required | This indicates that the client needs to authenticate to gain network access." 
`7xx` | **Developer Error** |


<br>
<div align = "center">
For a full up-to-date list, continue reading on
<a href="https://www.iana.org/assignments/http-status-codes/http-status-codes.xml">HTTP Status Code Registry</a>, 
<a href="http://en.wikipedia.org/wiki/List_of_HTTP_status_codes">Wikipedia.</a> 
<br>
<br>
<b>
Credits to 
<a href="https://github.com/bluehallu">
bluehullu
</a>
for providing these. I just formatted them to make things even simpler and inlude these as part of this NodeJS guide :D
</b>
</div>