---
title: "HyphenAssistant: Connect back to the DeepSeek Harness with your phone, complete tutorial on three connection methods"
slug: deepseek-harness-mobile-remote-en
status: published
lang: en
translation_of: deepseek-harness-mobile-remote
translation_source: machine
source_sha256: 9f33c32e547ce8fc
date: 2026-10-23
updated: 2026-11-21
summary: "Three phone connection methods, three platforms to analyze configurations, and import key files—get started in one step."
categories:
  - Tech
tags:
  - AI
  - Remote access
  - Self-made software
cover: "/obsidian-assets/deepseek-harness-mobile-remote/cover-018-direct-fusion-858b6c023b.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/deepseek-harness-mobile-remote/) is authoritative.

The AI on the computer is still processing tasks, but the person has already left the desktop. The phone reopens a chat window, but can't retrieve the original files or execution records. What HyphenAssistant does is add a phone entry point to the DeepSeek Harness running on the computer: use the phone browser to view the original session, continue sending requests, and the task is still executed by the original computer.

This article starts with downloading and installing, and when you get a real reply on your phone. First, use a temporary link to get it through, then choose an open port or dynamic domain as needed. For Alibaba Cloud, Tencent Cloud, DNSPod, and Cloudflare, you only need to choose the one you are currently using; you don't need to register for all of them.

The download link in this article has been verified to **HyphenAssistant 1.0.1 for the official version on all three platforms, with the verification date being October 24, 2026**. The cloud console images use real interface examples from the official help documents of the three platforms; the Alibaba Cloud section is the official older version; The specific entry points are based on the current path in the article.

The HyphenAssistant interface image retains the 0.1.8 isolation demonstration as step-by-step demonstration; The form uses a fictitious domain name and test credentials, so it cannot be used to determine whether a real cloud account has been successfully configured. The cloud platform image is only used to identify the entrance; the actual button location depends on the console you open.

**First time using it, take the shortest route:** Harness on your computer can answer → Connect the same configuration in the assistant → Select temporary link and start → Pair with a new QR code on your phone → Send a test message in the original session. The following port mapping and three-party dynamic domain name resolution are advanced parts to look at when you have your own network entry.

## 🎯 1. What to prepare first: The computer can answer, then let the phone connect

**HyphenAssistant is an independent assistant tool developed by HyphenTech. ** It connects to the official DeepSeek Harness, does not provide its own models, and does not include model credits. The models, working directories, and sessions you configured in the original Harness will continue to be used. The fees and data flow for model requests will continue to be determined by the original configuration.

HyphenAssistant's own runtime environment, temporary channels, and QR code components have already been included in the installation package, so there is no need to install Node.js or channel tools for it. **The official Harness still needs to be installed, configured, and properly restored on the computer**; The original Harness requires a runtime environment prepared separately according to the official documentation.

If you haven't installed Harness yet, first open [DeepSeek Harness official Chinese documentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.zh.md), install according to the current official portal, and complete the model setup. It's still in developer preview, and upstream updates may change connector compatibility; If mounting fails, first check both versions and release notes; don't force upgrades directly on the environment where the task is running.

Select an unimportant test session on the computer and send "Reply only: computer connection is normal, no tool called." After seeing the real reply, proceed with the subsequent remote connection. The webpage can open, the software can start, and the model can answer—these are three different things.

### Download the installation package suitable for your system

1.0.1 has been officially released on all three platforms: open [HyphenAssistant 1.0.1 release page](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases/tag/v1.0.1), select the appropriate installation package from the attachments, and do not treat the Source code compressed package as an installer. Existing versions can also be checked for updates within the app; The automatic update list now points to the complete 1.0.1 for all three platforms.

| Computer system | Selected file | Installation method |
| --- | --- | --- |
| macOS 13 or later, Apple Silicon chip | macos-arm64.dmg | Open the disk image and drag HyphenAssistant into the "Applications" |
| Windows, x64 architecture | windows-x64-setup.exe | Install according to the installation wizard; the package includes an offline WebView2 installer |
| Linux, x64 architecture | AppImage, deb, or rpm | Choose a format suitable for the distribution; AppImage requires execution permissions and a compatible desktop environment |

Intel chips on Mac, Windows ARM, and Linux ARM are not covered by this batch of installation packages. The installer has not yet been notarized by Apple or signed by Windows commercial code; When first blocked by the system, first verify the download source and the SHA-256 verification file with the same name, then decide whether to allow it in the system-provided security settings.

## 🔍 2. How to choose among the three methods: First, figure out who will lead the way

Treat the computers at home as a household in the community. **Domain name resolution** is like looking up the address book, telling your phone which public address to go to; **Port mapping** is like diversion at the community entrance, sending access to a certain address to the computer inside the house; **HTTPS certificate** helps browsers verify identities and encrypt the content on the road. Each of these three functions serves a purpose.

Dynamic domain updates are often written as DDNS: When your public address changes, the program updates the address book for you. It does not open the router door, nor does it automatically install certificates for the webpage. Where to buy a domain name does not determine which platform to choose; **what matters is who currently handles the authoritative DNS resolution for that domain**. If you buy a domain on Alibaba Cloud and transfer resolution to Cloudflare, you should choose Cloudflare.

| Connection method | What HyphenAssistant does | What do you need to prepare? | Who is it for? |
| --- | --- | --- | --- |
| Temporary link | Generate temporary HTTPS entry using built-in channels | Networks that can access the channel service | First trial, short-term connection |
| Open port | Monitor HTTP ports on your computer and maintain paired authentication | Prepare external address and port mapping yourself; For public networks, configure HTTPS yourself | Existing domain names, proxies, or existing network portals |
| Dynamic domain name + open port | Open ports and periodically update a single A record for the selected platform | Domain names, platform credentials, available public portals, port mappings, and external HTTPS | The home public network address will change; I hope the computer updates and resolves it by itself |

The third method can replace the dynamic domain update process on the Raspberry Pi or another machine, provided the original device only handles this task. If the original device still performs reverse proxy, certificate renewal, or other services, these functions must be retained or migrated by you. **Do not shut down the entire old device just because the domain update succeeds. **

## ⚡ 3. First, connect to the Harness currently in use on the computer

Open the "Connection Center" for HyphenAssistant. The "Built-in Runtime Environment" is ready, indicating that the Assistant's own components are available; The "Original Harness session" is connected, indicating it has connected to the original workspace.

1. First, get a real response in an official Harness test session, then keep it running. The "Built-in Runtime Environment Ready" in the assistant only means the Node.js components are available, not that Harness is connected.

2. If the page offers "Access existing Harness," click it and refresh the status. This applies to environments where connectors already exist.

3. When using it for the first time, select the one actually used by the current Harness in the "Select Configuration in Use" option, then click "Mount Connector." If there are two configurations in the list, first verify the actual configuration path of the Harness and don't guess by clicking in turn; Mounting will not merge the two configurations.

4. Wait for Harness to load the connector, then refresh. If it doesn't load automatically, wait for the original task to be free and then reopen Harness.

5. Click "Refresh Status", and after seeing "Original Harness Session: Connected", start the remote entry again. If "Pending Access" still appears, check whether the original Harness has loaded connectors; When the original task is free, reopen Harness and refresh.

![0.1.8 Configuration Selection and Startup Steps in Connection Center | Isolated Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-harness.png)

*Figure: First, select the configuration currently in use and mount; "Mount Connector" and "Start Remote Connection" are two steps. The screenshot shows the isolated demo; the button has not yet been executed. *

Here, only the original workspace is added as an entry. While a task is running, wait until it reaches a suitable pause point; do not forcibly terminate the original process just to refresh the state. If no configuration options are available, return to the official Harness for the first startup, then refresh again.

**Windows Fix 0.1.8:** When Harness is installed in a non-default directory such as the D drive, the assistant will look for programs in the installation history. If the configuration has been mounted before, it will show "Connector mounted" without repeatedly selecting it; Another configuration cannot directly overwrite the one currently being managed. If the "original Harness session" is still pending access, open the original Harness first, wait for the connector to load, then refresh the status.

## 💰 4. Method 1: Temporary link; use this one for the first time

1. On the left, enter "Remote Entry", select "Temporary Link · Auto-generated", then click "Save Connection Method". Do not fill in the domain name or change the router port here.

2. Return to the "Connection Center," confirm the original Harness session is connected, then click "Start Remote Connection." Wait for updates on the status of the local gateway and temporary entry.

3. Go to the "Check and Help" section and "Check Actual Connection"; After the entry reload passes, return to the homepage to generate a paired QR code. Scan the latest QR code with your mobile browser; do not reuse the link generated from the previous link.

Starting from 0.1.8, **"Local gateway started" and "Phone entry accessible" are checked separately**. If the homepage shows "Computer connected, mobile gateway to be repaired," first go to "Check and Help" and run the actual connection check. We have seen Cloudflare return HTTP 530 on a Windows worker: Harness is connected, but the TLS handshake from the channel to the edge node failed, and the phone is unusable at this time. After adjusting the local network or TUN, refresh and then verify the entry readback and the actual response received by the phone.

1.0.0 Further handling of the wait state when the temporary channel is just started: a single external network recall failure will not be used long-term by the interface; after the entry point is restored, the connection status and QR code button will be automatically reviewed and updated. Persistent failures will still show no connection; Whether the phone is truly usable depends on the previous entry check and actual response.

![0.1.8 Unique Settings for Temporary Links | Isolation Demo](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-quick-link.png)

*Image: Temporary link page only needs to select the connection method and save; The above image does not start the real channel. *

Open the full link obtained by scanning the QR code in your phone's system browser. The link contains one-time matching information, valid within ten minutes, and can only be redeemed once. Do not treat it as a regular website address that can be publicly shared; If you switch to another browser, you must also pair separately.

Go to the phone page, find the test session you just mentioned, and send the message "Reply only: Phone connection is normal, no tool called." **Only when the phone receives a genuine reply to this new message is the connection complete. ** Keep the computer online, and both the model and the original Harness must remain available.

![Web message sending and receiving | October 23, 2026 old version tested](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-web-message-history-74a6376fd4.jpg)

*Image: Actual test of sending and receiving the old webpage on October 23, 2026, only demonstrating new messages and replies that need to be verified. *

This retained web acceptance image shows the result that should be verified: a new message is sent, and the model indeed returns the corresponding response. It comes from the old standalone web acceptance on October 23 and cannot replace your testing on the current version or network; The model's response speed does not represent the execution speed of complex tasks.

Temporary links do not require a self-provided domain or router mapping. Traffic is forwarded through Cloudflare's temporary channel, and the network must be able to access the service; Addresses may change after recreation, and there is no guarantee of continuous availability. If connection fails, first check the "Check and Help" entry results; do not disable pairing or certificate verification to make up for success.

## 🧩 5. Method 2: Open the port and use your existing network entry points

If you can already access your home computer from an external network, this method is the most straightforward. Go to "Remote Entry" and select "Open Port · Configure Integration by Default", mainly filling in three fields.

![0.1.8 Open Port Listening and External Address | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-open-port.png)

*Image: The local HTTP listening address and port must be entered separately from the external address actually accessed by the phone. The 8767 in the screenshot is just the default port for the local device. *

| Project | How to fill it out | Meaning of the example |
| --- | --- | --- |
| Listen address | When routers forward directly to the local machine, 0.0.0.0 is usually used; for same-machine reverse proxies, 127.0.0.1 can be used | The former allows access from the computer's network card, while the latter only receives access from the same computer |
| Listen port | Select an unoccupied local port, default 8767 | This is the port for the HyphenAssistant HTTP service |
| External access address | The full address actually accessed by the phone, including protocols, and non-default ports should be written as ports | HTTPS protocol, ai.example.com domain, 19527 external port |

Example of complete filling (replacing the domain name with your own):

```url
https://ai.example.com:19527
```

**0.0.0.0 is a listening setting and cannot be entered as a phone browser access address. ** 127.0.0.1 is "This device itself": The phone will only find the phone itself to access it. 192.168.1.100 This type of address is a LAN address and usually cannot be used directly outside the home network.

### Scenario A: The router forwards directly to HyphenAssistant

Assuming the computer's LAN address is 192.168.1.100 and the assistant listens at 0.0.0.0:8767, the router can be set to "external TCP port 19527 → 192.168.1.100:8767". Different routers may refer to the entry point as port forwarding, virtual server, or NAT mapping. It is recommended to reserve the computer's DHCP address to avoid changes in internal network address after reboot.

This link goes directly to the HTTP service, so the access address should use the HTTP protocol and the actual external port, formatted as follows:

```url
http://自己的公网地址或域名:19527
```

** Only port forwarding is performed; you cannot change HTTP to HTTPS to get encrypted connections. ** To protect session and pairing information in public access, HTTPS should be deployed externally before using it; This direct HTTP explanation is for understanding port relationships and is not recommended as a long-term public internet entry point.

### Scenario B: HTTPS proxy and certificate already exist

Suppose an HTTPS service on the same computer already listens to 19527 and forwards the request to `http://127.0.0.1:8767`. At this point, the assistant can listen to 127.0.0.1:8767, and the external access address is entered as the following HTTPS example; The router's mapped target is **HTTPS listening port 19527** on the computer.

```url
https://ai.example.com:19527
```

The full sequence is: Phone→ Domain Corresponding Public Address: 19527 → Router → External HTTPS Service: 19527 → HyphenAssistant HTTP: 8767 → Original Harness. If the proxy is on another device, the assistant must listen for the network card address accessible by that proxy; The proxy target cannot continue to enter the 127.0.0.1 of the other device's own number.

The proxy must maintain the webpage and WebSocket connection. The certificate must override the domain accessed by the phone and be properly trusted by the browser; Application, private key storage, proxy configuration, and auto-renewal are all handled by your original external solution. HyphenAssistant neither imports certificates nor takes over renewals.

Save the settings, return to the "Connection Center" to launch it, and generate the QR code. During public network verification, have the phone turn off Wi-Fi and access via mobile networks; This can avoid the false judgment of "only works on home Wi-Fi." If the same Wi-Fi cannot open the public domain name, it may be related to the router's backflow access capability, requiring separate verification of internal and external networks.

**1.0.1 Fixed QR code buttons for ports and dynamic domain name modes:** QR code images and one-time pairing tokens are generated locally on the computer and do not rely on online QR code services. If the computer fails to reload its own public address, it can still generate a QR code; The interface will indicate that the external network entry has not yet been verified. Please scan the QR code with your mobile phone to confirm the webpage is open and you can enter the original session. If scanning does not open, continue to check port mapping, domain name, HTTPS proxy, and firewall. Temporary links still require the actual channel to be connected before generating the QR code.

## 🚀 6. Method 3: Dynamic domain name + open ports to update the computer's address book

The third method is to add automatic DNS updates to the network link mentioned in the previous section. **First, make sure open ports and external HTTPS work properly, then add dynamic domain names. Troubleshooting will be much easier. **

In your own parsing platform, first manually create a record of A for mobile phone access. Here's a unified example: root domain example.com, host record ai, combined to form ai.example.com.

A records the actual public IPv4 at home; It only stores the address, not https, port, or URL path. example.com and the internal network address in the text are examples; replace them with your own values.

If you want to use the example.com directly, enter @ in the host record. Alibaba Cloud and Tencent Cloud use the default line for the record; Cloudflare must ensure there is only one A record under the full host name. The assistant only updates existing unique records and will not automatically create domain names or records; duplicate records or unenabled records need to be organized in the cloud first.

In the "Remote Entry" section, select "Dynamic Domain Name + Open Port". The listening address, listening port, and external access address will continue the actual link from the previous section; Then select the resolution platform, fill in the root domain name and host records, and import the corresponding credentials.

![0.1.8 Key Fields | Isolation Demonstration of Alibaba Cloud Dynamic Domain Form](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-ddns-aliyun.png)

*Image: First select the resolution platform, then enter the root domain name and host record; Keys can be imported from files. Example domain names and fields are all blank demonstrations, not actual accounts. *

For public address detection, select "Domestic Source Detection · Dual-source verification." Updates will only occur if both sources succeed and the results are consistent; If the detection fails or the results differ, the update will stop. When enabling a proxy, especially verify that the detection result matches the public IPv4 of your home router. Do not write the proxy server exit into your home domain.

"Router Public IPv4 (optional)" is usually left blank for the program to detect automatically. After manual input, this value is fixed and is suitable when you clearly know which address to write; If the home public network address changes, it will not correct this manual input for you.

First, click "Save Connection Method," then click "Check Parsing Configuration (Do Not Modify Records)". The check will read cloud records, showing whether the records exist and whether the detected addresses are consistent; The Check button will also verify and save valid local form settings, **not writing parsed records to the cloud**. After passing the check, return to the homepage to start the connection, synchronize once upon startup, then check every five minutes; If the address does not change, it will not be rewritten.

![0.1.8 Public Address Detection and Read-Only Check Button | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-ddns-check.png)

*Image: First confirm the source of detection, then perform the "Check and resolve configuration." The screenshot only shows the button location and does not call the real DNS interface. *

DDNS can update domain names but cannot penetrate the operator's internal network. If the router's WAN address belongs to the operator's internal network, has multi-level NAT, or the inbound port is restricted by the operator, adding only the domain name and mapping may still prevent access from the public network. In this case, temporary links can be used first, or you can arrange a network plan that supports inbound access yourself. Current dynamic updates target IPv4 A records and are not responsible for AAAA records.

## 🧠 7. Alibaba Cloud: Create a dedicated RAM user and download the AccessKey file

First, confirm that domain resolution is indeed managed by Alibaba Cloud. Open [Alibaba Cloud RAM Console](https://ram.console.aliyun.com/) and operate with an authorized administrator. RAM users are like a separate work pass issued to the app: only let it search and modify the specified domain, avoiding handing over the entire cloud account key to the software.

1. Create a dedicated user in 'Identity Management → Users', such as hyphen-ddns.

2. Select the permanent AccessKey access method for the program; Accounts used only for assistants usually do not require console login.

3. Create a custom policy in "Permission Management → Permission Policies," switch to script editing, restrict operations to DescribeDomainRecords and UpdateDomainRecord, and restrict resources to your target domain.

4. Return to the RAM user's "New Authorization," select the newly created custom policy, and confirm the binding. A policy was created but not bound; the program still has no permissions.

5. Enter the user's "Credential Management" to create an AccessKey and complete verification on the page. The Secret will only appear once upon creation; download the CSV file immediately and save it properly.

![Alibaba Yunzi User Portal | Official Old Version Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-aliyun-subuser-choice-6271b13528.jpg)

*Image: Alibaba Cloud official old interface, used to identify sub-users and main account entries; Please operate according to the actual path of the current RAM console. *

The image above shows Alibaba Cloud's official old security tips, helping to identify sub-user entries. Current path press [Create RAM user](https://help.aliyun.com/zh/ram/user-guide/create-a-ram-user) And [Create an AccessKey](https://help.aliyun.com/zh/ram/user-guide/create-an-accesskey-pair) Verification.

Do not bind AdministratorAccess or AliyunRAMFullAccess to assistants; These are permissions for managing cloud accounts or identities, not required for updating parsing.

You can start from the minimum set of operations below, **replacing ACCOUNT_ID and example.com with the Alibaba Cloud account ID and actual root domain of the resource**.

> Domain-level permissions do not restrict the AI record; the assistant itself filters the host records filled in.

```json
{
  "Version": "1",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "alidns:DescribeDomainRecords",
      "alidns:UpdateDomainRecord"
    ],
    "Resource": ["acs:alidns:*:ACCOUNT_ID:domain/example.com"]
  }]
}
```

The generation of resource ARNs and specific interface authorization are based on the [Alibaba Cloud DNS custom permission examples](https://help.aliyun.com/zh/dns/alibaba-cloud-dns-custom-permission-policy-reference-dns) and [interface authorization information](https://help.aliyun.com/zh/dns/api-alidns-2015-01-09-ram).

If the console validation requires adjusting the resource syntax, use the target domain name ARN generated by the resource selector; Do not add administrator privileges to cover up incorrect resource scopes. This working user does not need to manage additional RAM users or certificate permissions.

![Alibaba Cloud Download CSV | Official Old Version Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-aliyun-download-csv-d39682ba98.jpg)

*Image: Official old version download link. After downloading, first check that only the current AccessKey is in the file. *

The official "Download CSV file" can eliminate manual copying. The two columns for software import are AccessKey ID and AccessKey Secret. If the downloaded content does not meet the following single set format, organize it into corresponding CSV or JSON files before importing; Do not upload the entire multi-account credential list.

```csv
AccessKey ID,AccessKey Secret
替换为自己的AccessKeyID,替换为自己的AccessKeySecret
```

You can also save the following JSON. Here is the **credential file**, which serves a different purpose than the **permission policy file** above; The permission policy is placed in the RAM console, and only after the credential file is HyphenAssistant imported.

```json
{"provider":"aliyun","AccessKeyId":"自己的AccessKeyID","AccessKeySecret":"自己的AccessKeySecret"}
```

In the assistant, select "Alibaba Cloud → Import Key File," choose CSV or JSON, and after seeing the import succeed, click save. File import only requires filling in text and does not create users or authorizations for you on Alibaba Cloud.

For instructions on downloading and displaying at once, see the official tutorial [for Creation and Saving](https://help.aliyun.com/zh/ram/product-overview/quick-start-create-and-use-accesskey-pairs-for-programmatic-calls). Currently, the assistant does not support STS temporary credentials.

## 📉 8. Tencent Cloud DNSPod: Uses Tencent Cloud API keys, no legacy tokens

Open [Tencent Cloud Access Management CAM](https://console.cloud.tencent.com/cam), create a subuser dedicated to dynamic domains, and select Program Access. Do not hand over the main account key to the assistant, nor look for the ID/Token on the old DNSPod token page; The current implementation calls Tencent Cloud API 3.0, which requires a pair of SecretId and SecretKey.

### First, assign domain permissions to the sub-user

Create a custom policy in CAM "Policies" using the policy builder or by syntax. Select the DNSPod service, keep only DescribeRecordList (query records) and ModifyDynamicDNS (update dynamic records), select the target domain for resources, and associate the policy with the subuser you just mentioned.

| Values that need to be prepared | Where to find it | Uses |
| --- | --- | --- |
| Main account UIN | Tencent Cloud account information page | The account to which the resource belongs in the permission policy |
| DomainId | DNSPod domain details, or queries by an administrator via DescribeDomain | Domain resource with limited authorization; RecordId not of record A |
| Root domain name | The domain name actually managed in DNSPod | Enter the assistant root domain name field |

Below is an example of narrowing operations using [Tencent Cloud authorization syntax](https://cloud.tencent.com/document/product/302/105718) and [Resource type description](https://cloud.tencent.com/document/product/302/105719). **Replace OWNER_UIN and DOMAIN_ID**; do not keep placeholders as is.

```json
{
  "version": "2.0",
  "statement": [{
    "effect": "allow",
    "action": [
      "name/dnspod:DescribeRecordList",
      "name/dnspod:ModifyDynamicDNS"
    ],
    "resource": ["qcs::dnspod::uin/OWNER_UIN:domain/DOMAIN_ID"]
  }]
}
```

QcloudDNSPodFullAccess is a broader DNSPod full read/write system policy, including more resources and operations, and is not the minimum authorization for these two interfaces. Read-only policies cannot complete address updates. Whether permissions are valid in the real account requires verification by the assistant and subsequent actual updates; success cannot be judged solely by the policy.

### Then create and save the API key

Go to "User List → Target Subuser → API Key", click "New Key", and complete verification on the page. Save SecretId and SecretKey immediately; SecretKey cannot be queried again.

For specific steps, see [Tencent Cloud Sub-Account Key Management](https://cloud.tencent.com/document/product/598/37140).

![Tencent Cloud Sub-User API Key Page | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-tencent-subuser-api-bcc0ea6229.jpg)

*Image: First, enter the target subuser's own API key page and confirm that it is not the main account key. *

![Tencent Cloud New Key Button | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-tencent-create-key-e1f5537f3a.jpg)

*Image: Click 'New Key' again; This is not the old DNSPod ID/Token page. *

If the creation page is available for download, after saving, first check the header; You can also save this pair of values as a set of CSV files below. This is not about entering the Tencent Cloud login password into a file, nor about importing CAM permission policies.

```csv
SecretId,SecretKey
替换为自己的SecretId,替换为自己的SecretKey
```

JSON format is also available:

```json
{"provider":"tencent","SecretId":"自己的SecretId","SecretKey":"自己的SecretKey"}
```

Back to HyphenAssistant, select "Tencent Cloud DNSPod" for the platform, enter the root domain example.com, host record enter ai, then import, save, and check. In DNSPod, you need to have the default line A record.

The assistant calls [dynamic update interface](https://cloud.tencent.com/document/api/1427/56158) without requiring you to fill in the region, nor do you need to select Guangzhou or Shanghai separately.

![0.1.8 Key Fields | Isolation Demonstration of Tencent Cloud DNSPod Form](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-ddns-tencent.png)

*Image: Enter SecretId and SecretKey here, or import the same set of files; Domain names and host records retain the previous actual values. *

## 🎯 9. Cloudflare: Create API Tokens for Restricted Regions

First, it was present [Cloudflare console](https://dash.cloudflare.com/) Confirm that the domain domain is active and that authoritative resolution is indeed handled by Cloudflare. On its DNS record page, first create a unique A record corresponding to the AI.

Go to "My Profile → API Token," click "Create Token," and use the "Edit zone DNS" template or custom token. The English interface allows you to perform operations according to the fields below.

| Console project | How should one choose? | Why? |
| --- | --- | --- |
| Permissions | Zone → DNS → Edit | Read, list, and update DNS records; Edit permissions include the corresponding read capabilities |
| Zone Resources | Include → Specific zone → your own example.com | Only the token operates on this domain domain |
| Zone → Zone → Read | Added when automatically searching for zones; Optional for manual Zone ID input | Allow the assistant to find the region by root domain |
| Client IP Address Filtering | Set only after confirming the outlet is stable | The home exit will change, and binding the old address will cause subsequent calls to fail |
| TTL/Validity period | Set according to your own rotation schedule | This is the token expiration date, which is not the same as DNS record cache time |

![Cloudflare Token Permission Page | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-cloudflare-token-permissions-81053f21e8.jpg)

*Image: Example of the official Cloudflare page, verifying names, DNS permissions, and region ranges by number; The 'All zones' in the example image cannot be directly copied. *

**The official sample image shows All zones in the resource section, used only to identify page locations. The actual configuration should be changed to Specific zone, selecting your own domain name. ** The Zone Read in the image corresponds to automatic search zones; If you want to reduce this permission, enter the Zone ID yourself.

Click "Continue to Summary," check the authorized domain and scope of operations, then create the token. Copy and securely save the token value, which will only be displayed once upon completion. Do not copy the entire curl test command, nor use the Global API Key.

[Official token creation instructions](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) provides the current fields and the complete process.

![Cloudflare Permission Confirmation Summary | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-cloudflare-token-summary-ea99672621.jpg)

*Image: Before creation, verify token permissions and the selected domain zone to avoid opening writes to all zones. *

Zone ID is the number of this domain domain's area, usually a 32-bit hexadecimal string.

Search in the API area on the domain's overview page; You can also follow [Official Account and Zone ID Guide](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/) on the current interface. **Do not enter Account ID in the Zone ID. **

The easiest file is TXT: only put the token itself on one line, without quotes or the "Token=" prefix. Choose UTF-8 plain text for saving and avoid saving as a Word document or rich text file. If you also import the Zone ID, you can use JSON:

```json
{
  "provider": "cloudflare",
  "apiToken": "自己的APIToken",
  "zoneId": "替换为自己的32位ZoneID"
}
```

The zoneId above is a placeholder that must be replaced with a real 32-bit value; If the assistant automatically searches, delete the entire zoneId field and ensure the token has Zone Read permissions**. Also supports two columns of CSV:

```csv
APIToken,ZoneId
替换为自己的APIToken,替换为自己的32位ZoneID
```

![0.1.8 Cloudflare Form Token and Zone ID | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-ddns-cloudflare.png)

*Image: Required for token; Zone ID can be left blank, but in this case, the token needs sufficient zone read permission to automatically look. *

After importing, save and check. When using custom public ports like 19527, note that Cloudflare's Orange Cloud proxy does not support arbitrary ports. When resolving only the domain name, you can set the record to "DNS only"; To use a proxy, select the officially supported port and solution [](https://developers.cloudflare.com/fundamentals/reference/network-ports/).

**DNS alone will not automatically provide HTTPS to your computer**; certificates are still managed by the external solution. When updating records, the assistant retains existing proxy switches and TTLs, and does not switch between orange or gray clouds for you.

## 🔍 10. What are the differences between importing, saving, replaceing, and deleting files?

Follow this sequence for all three platforms: Select platform → Fill in domain name and host records → Import corresponding credential files → Save connection method → Check and resolve configuration → Start connection → Phone verification. **

After importing, the field content will be hidden, and the interface will prompt "Credentials have been imported." At this point, only the current form will be filled; Click Save before writing to the local machine. If the page does not display plaintext echo, it does not mean the file was not read. After saving, it shows "Saved, no need to fill in again," indicating that the old credentials on the same platform still exist; Leaving the input box blank will continue to use it.

| Things I want to do | Correct operation |
| --- | --- |
| Add credentials for the first time | Import or fill in the data, then click Save to check afterward |
| Replace the Alibaba Cloud/Tencent Cloud paired key | Replace both items together, or import a new file and save it |
| Modify parameters during connection run | First, click "Stop Connection and Modify Configuration"; the phone will disconnect and the original Harness task will resume |
| Forget old credentials saved locally | Click "Clear saved keys" and confirm before importing the new credentials |
| Switching from Alibaba Cloud to Cloudflare | After switching platforms, re-import the platform credentials without mixing the old platform key |
| Completely disable the compromised credentials | Besides local device clearing, you also need to disable or revoke that key on the cloud platform |

Clearing the local key will keep the domain name and listening parameters, do not delete cloud records, do not modify certificates, and do not revoke the cloud platform key. The original CSV/JSON/TXT files remain in your saved location; Import operations do not upload the original files, nor copy the original files into the application directory, but the saved credentials will remain in the local private configuration. Please protect your computer account and backups; do not place key files in public cloud drives or code repositories.

Only one set of credentials is imported at a time, and the file must not exceed 64KB. Multi-account files, duplicate fields, or platform mismatches will be rejected. The Chinese placeholders in the example files in this article cannot be used to connect to real platforms; The certificate's fullchain.pem and privkey.pem are also not credential files here.

## ⚡ 11. From "Show started" to Truly Available

When using temporary links, just pair after checking that the channel is ready; When using your own domain, verify in the following order, and if any step fails, address the layer first.

![0.1.8 Four-Level Status in Check and Help | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/tutorial-018-connection-check.png)

*Image: Check "Local Gateway," "Original Harness Authentication," and "Access Entry Readback" separately; Isolated demonstrations deliberately showing as not started do not necessarily mean the network acceptance has passed. *

1. The original Harness on the computer can receive model replies from it.

2. The assistant shows the original session is connected and the gateway has started.

3. The dynamic domain name mode can find unique A records and detect that public addresses match routers. Cloud platform confirms record values are correct; Old DNS caches may still need to wait for TTL.

4. Phones using mobile networks can open external HTTPS addresses, and browsers have no certificate errors.

5. Use the newly generated complete matching link to complete the match within the validity period.

6. On your phone, enter the original test session and send "Reply only: phone connection is normal, no tool called," and wait for a new reply.

7. Refresh the phone page, send another simple message, and confirm that it's not just a static page open.

If migrating DDNS from other devices, first record the old configuration, confirm that the assistant has found the correct records, completed the startup synchronization, and then completed the next five-minute check, then disable the program that updated the same record on the old device. Both programs maintain the same record simultaneously, especially when different outlets are detected, which may overwrite back and forth. Other services such as certificate renewal continue to run as originally planned.

The current version has passed the checks for the three system builds and installations; Alibaba Cloud already has records of parsing, updating, recovery, and message sending and receiving in real environments.

** Tencent Cloud and Cloudflare completed official interface and signature comparison, isolated simulated interface, and import interface acceptance, without using real cloud accounts for DNS writes. ** Account permissions, plans, networks, and final resolution results should still be verified in your own environment in the above order.

### Windows test: Port mapping is done, so why can't the external network still connect?

This time, on the Windows worker, the original Harness was connected, and the local gateway returned to normal status, but the phone portal still wouldn't open. Actual troubleshooting revealed three overlapping issues: the built-in node was blocked by the firewall, domain access added to an extra layer of `www`, and the HTTP port was filled with HTTPS. The troubleshooting method is retained below, with domain names and paths replaced with examples.

** Step one: Allow the assistant's built-in Node, and only allow the actual port. ** The gateway is provided by the `runtime\node.exe` in the installation directory, allowing only the desktop program itself or another Node in the system, which may not be enough. Even if Windows is connected to home Wi-Fi, it may be using the "Public Network" profile; Checking only "Dedicated" may not cover the current network.

Open "Advanced Security Windows Defender Firewall" in Windows Search, go to "Inbound Rules," and check the rule named "Node.js JavaScript Runtime." In "Programs and Services," verify the full path and confirm it points to `runtime\node.exe` in the HyphenAssistant installation directory.

If this program already has an enabled TCP "Block Connection" rule, first note the rule name and its original state, and disable only this one. Then create a new "custom" inbound rule that restricts the same program, TCP, and actual listening port, such as `18767`, and makes the rule applicable to the current network profile. If UDP is not used, there is no need to grant additional UDP; later, when disabling port entries, this dedicated rule can also be disabled.

**Do not directly close the entire firewall, nor release all ports of all Node programs. ** Simply adding "Allow" may still be ineffective, because existing explicit blocking rules override conflicting allow rules; Microsoft's [Windows Firewall Rule Instructions](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/rules) list this priority and any blocking rules that may remain after the first prompt is rejected or canceled.

**Step two: DDNS updates the hostname, which must correspond verbatim to external access addresses. ** Select host record `@`, maintaining `example.com`; Select `www`, maintaining `www.example.com`. If the root domain is successfully updated, not all subdomains will be updated incidentally.

You can query two records separately to verify whether they point to the current router's public IPv4:

```powershell
nslookup example.com
nslookup www.example.com
```

If DDNS maintains `@`, use `example.com` for external addresses; If `www` is needed, let DDNS maintain the corresponding `www` records, and first confirm that the existing website will not be altered. Don't update only the root domain while letting the QR code point to the old IP's `www`.

**Step three: The protocol must match the service that actually receives the connection. ** Suppose the router directly redirects the external TCP `18767` to the computer's HyphenAssistant HTTP `18767`, and the troubleshooting address is [View page: example.com](<http://example.com:18767>). If there is no HTTPS proxy before this port, rewriting it to `https://` will only cause TLS/SSL connection failures and cannot generate certificates or encryption services for you.

If HTTPS is already configured, the router should first go to the port where the HTTPS service is actually listening, then it will forward to the HyphenAssistant HTTP port. Check "Direct Forwarding" and "Existing HTTPS Proxy" in Section 5 separately to avoid mixing the two links together. Direct HTTP can be used to locate link issues; long-term public access should be configured with HTTPS.

**After repairing, refresh the status and regenerate the QR code. ** If external addresses, protocols, or ports have been changed, the old QR code may still retain the old address; Do not continue using previously copied links. Turn off Wi-Fi on the phone, access the new entry point via mobile data, and verify whether the original session works properly. After this fix, the independent external network check returned HTTP 200, and the Harness status was normal; Unpaired access still returned 401, and the phone side later confirmed it was usable.

### When encountering problems, first check which floor it is

| Phenomenon | Priority checks |
| --- | --- |
| The start button cannot be clicked | Whether the original Harness is accessed; Whether dynamic domain credentials have been saved |
| After selecting a configuration, return to the selection box | Update to the current version; Mounted configuration should display "Connector Mounted" and check whether the original Harness has loaded the connector |
| The original session is connected but the temporary entry is not connected | Run "Check Actual Connection"; If HTTP 530 or other external network errors are returned, check the local network or TUN, then refresh the status |
| Open ports or dynamic domain names can be resolved, but QR code buttons cannot be clicked | Updated to 1.0.1; the new version allows local devices to generate QR codes and then verify the public access via mobile networks |
| Parsing check indicates unauthorized authorization | Whether to select the correct account, whether the policy is bound, whether the domain resource scope is correct, and whether the key is valid |
| Record not found or record not unique | A Record is pre-created, hostname correct, default line duplicate |
| Domain can be resolved, but phone won't open | Public inbound conditions, router target addresses, external listening ports, firewalls, and proxy targets |
| This device can be accessed, but the external network times out | Check whether the built-in `runtime\node.exe` of the assistant is blocked by the current network profile's TCP inbound rules; Only allow actual ports |
| The root domain resolution is correct, but it contains www but does not connect | `@` and `www` are different records; Check whether the hostname updated by DDNS matches the domain name in the QR code |
| HTTP can be enabled, but switching to HTTPS will show TLS/SSL errors | Direct port mapping does not add HTTPS; Confirm that external HTTPS services, certificates, and forwarding destinations are real |
| Changing the domain name or port, scanning still fails | Refresh the status and regenerate the QR code; do not continue scanning or copying the old entry |
| HTTPS certificate error | Domain name, validity, certificate chain, and renewal of external certificates; No certificate repair entry within the app |
| Only the same Wi-Fi works | Check if the LAN address was misused; Then verify the public access with the mobile network |
| The phone is turned on but no session | Whether the original configuration was selected correctly, whether the connector was loaded, and whether the original session authentication was normal |
| Paired link is invalid | Regenerate and redeem within ten minutes; Paired separately with different browsers, re-paired after the gateway reboots |
| The parsed value becomes a proxy exit | Stop the connection, verify the outlet detection, change to the appropriate detection method, and restart after confirming |
| Cloudflare does not connect after enabling Orange Cloud | Check whether the external port is within the standard proxy support range, and whether the backbound HTTPS matches the proxy mode |

## 💰 12. How to use it daily: Keep computer tasks and manage your phone's access points

Closing the HyphenAssistant window preserves the background connection; Stopping the Assistant connection disconnects the phone and does not stop the original tasks on the computer. To restore the connection, restart the entry and pair as needed. When the computer is sleeping, shutting down, Harness exiting, or the model service is unavailable, the phone will also fail to function properly.

After pairing, the phone can continue to operate the original session, prioritizing your own device and trusted browser. When taking screenshots, live streaming, or sharing demonstrations, the full QR code, pairing link, cloud platform key, and private session are hidden. When someone obtains pairing information or a key, they must revoke both the phone login and cloud platform credentials; you cannot delete just one screenshot.

Under "Check and Help," you can disable anonymous statistics under "Enhance User Experience." The scope of statistics includes device identification, version, system, and architecture after product isolation, without collecting sessions, instructions, files, or keys; For specific scope, please refer to the privacy statement. If you need to troubleshoot version issues based on this information, first check the instructions here.

The easiest to replicate the starting order is: ** First, let the computer reply, then use a temporary link to send a reply on your phone; If you already have a public portal, switch to open the port, and follow the changes in your home public address before opening a dynamic domain. ** You can choose any route based on your network, without having to configure all three cloud platforms just to use the phone portal.

HyphenAssistant can be downloaded and updated on the [public release page](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases/latest). If it saves you time sitting in front of your computer, you can support development through the "Sponsored Support" section on the homepage; For more self-made software, visit [HyphenTech official website](https://hyphentech.top).


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenAssistant
> **Status:** Official releases
>
> Continue your computer's DeepSeek Harness session from a phone browser. Personal pairing and an online computer and service are required; model costs follow your existing setup
>
> [Downloads & updates：HyphenAssistant](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases)

> [!info] HyphenBox
> **Status:** Official releases
>
> A radar for free LLM APIs: availability is re-tested continuously, one local interface for all of them, and keys stay on your machine
>
> [Downloads & updates：HyphenBox](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

> [!info] LocalBrain
> **Status:** Official releases
>
> A multimodal MCP toolbox for local models: TTS, Whisper and video generation in one place
>
> [Downloads & updates：LocalBrain](https://github.com/HackerChi-Hub/localbrain-releases/releases)

> [!info] ScreenLex
> **Status:** Official releases
>
> Learn new words while you watch shows. Free, for Mac and Windows
>
> [Downloads & updates：ScreenLex](https://github.com/HackerChi-Hub/screenlex-download/releases)

> [!info] HyphenScreen
> **Status:** Official releases
>
> Screen recording and smart editing in one: a DaVinci-style timeline, automatic redaction and a check of the finished video before export. Free
>
> [Downloads & updates：HyphenScreen](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)

---

> [!quote] HyphenTech
> **Make AI your superpower**
> Local deployment · Free resources · Self-made software
> [HyphenTech](https://hyphentech.top)
