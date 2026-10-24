---
title: "Heifen Assistant: Connect back to DeepSeek Harness with your phone, three complete tutorials on three connection methods"
slug: deepseek-harness-mobile-remote-en
status: published
lang: en
translation_of: deepseek-harness-mobile-remote
article_type: "article"
translation_source: machine
source_sha256: f87df91ded1cf9b3
date: 2026-10-23
updated: 2026-10-24
summary: "Three phone connection methods, three parsing platforms, configuration and key file import—get started in one article."
categories:
  - Tech
tags:
  - AI
  - Remote access
  - Self-made software
cover: "/obsidian-assets/deepseek-harness-mobile-remote/cover-959d9a32e5.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/deepseek-harness-mobile-remote/) is authoritative.

The AI on the computer is still processing tasks, but the person has already left the desktop. The phone opens a new chat window, but can't reconnect the original files or execution logs. What the anti-fan assistant does is add a mobile entry point to the DeepSeek Harness running on the computer: use the phone browser to view the original session, continue sending requests, and the task is still executed by the original computer.

This article starts with downloading and installing, and when you get a real reply on your phone. First, use a temporary link to run the game, then choose an open port or dynamic domain name as needed. Alibaba Cloud, Tencent Cloud DNSPod, and Cloudflare—all three resolution platforms—just choose the one you're currently using—you don't need to register for all of them.

This article corresponds to **Heifen Assistant 0.1.7 preview, with a verification date of October 24, 2026**. The cloud console images use real interface examples from the official help documents of three companies; the Alibaba Cloud section is based on the official older interface; The specific entry point is based on the current path mentioned in the article.

The software form image comes from the 0.1.7 isolation demo, using a fictitious domain name and test credentials, so it cannot be used to determine that a real cloud account has been successfully configured.

![Anti-Fan Assistant Connection Center | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-home-97d364a688.jpg)

## 🎯 1. What to prepare first: The computer can answer, then let the phone connect

** The BlackSeek Assistant is an independent auxiliary tool developed by HyphenTech. ** It connects to the official DeepSeek Harness, does not provide models itself, and does not include model quotas. The models, work directories, and sessions you configured in the original Harness will continue to be used. The fees for model requests and data flow will continue to be determined by the original configuration.

The Black Fan Assistant's own operating environment, temporary channel, and QR code components have already been included in the installation package, so there is no need to install Node.js or channel tools for them. **The official Harness still needs to be installed, configured, and restored normally on your computer**; The required operating environment for the original Harness must be prepared separately according to the official documentation.

If you haven't installed the Harness yet, first open [DeepSeek Harness official Chinese documentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.zh.md), install according to the current official entry, and complete the model setup. It's still in the developer preview phase; upstream updates may change connector compatibility; If mounting fails, first check both versions and release notes; don't force upgrades directly to the environment where the task is being executed.

On the computer, select an unimportant test session and send "Reply only: computer connection is normal, no tool called." After seeing a real reply, proceed with the subsequent remote connection. The webpage can open, the software can start, and the model can answer—these are three different things.

### Download the installation package suitable for your system

Open [Download & Update: Heifen Assistant Distribution Page](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases/latest), select the installation package from the attachments, and do not treat the Source Code compressed package as an installer.

| Computer system | Selected files | Installation method |
| --- | --- | --- |
| macOS 13 and above, Apple Silicon chip | macos-arm64.dmg | Open the disk image and drag the Hefen Assistant into "Applications" |
| Windows, x64 architecture | windows-x64-setup.exe | Install according to the installation wizard; the package includes an offline WebView2 installer |
| Linux, x64 architecture | AppImage, deb, or rpm | Choose a format suitable for distribution; AppImage requires execution permissions and a compatible desktop environment |

Mac Intel chips, Windows ARM, and Linux ARM are not covered by this batch of installation packages. The installer has not yet been notarized by Apple or signed by Windows commercial code; When blocked by the system for the first time, first verify the download source and the SHA-256 verification file with the same name, then decide whether to allow it in the system-provided security settings.

## 🔍 2. How to choose among the three methods: First, think carefully about who will lead the way

Treat the computers at home as a household in the neighborhood. **Domain name resolution** is like checking the address book and telling your phone which public network address to go to; **Port mapping** Like a branching at the community entrance, it sends access to a certain address to the computer inside the house; **HTTPS certificate** helps browsers verify identities and encrypt content on the road. Each of the three things serves a purpose.

Dynamic domain name updates are often written as DDNS: When your home public address changes, the program updates your address book for you. It won't open the router's door or automatically install certificates for web pages. Where to buy a domain doesn't decide which platform to choose; **it depends on who currently handles the authoritative DNS resolution for the domain**. If you buy a domain on Alibaba Cloud and transfer resolution to Cloudflare, you should choose Cloudflare.

| Connection method | What does the anti-fan assistant do? | What do you need to prepare? | Whoever it suits you |
| --- | --- | --- | --- |
| Temporary link | Generate temporary HTTPS entry points using built-in channels | Networks that can access channel services | First trial and short connection |
| Open ports | Monitor the HTTP port on the computer and keep pairing authentication | Prepare external addresses and port mappings yourself; For public networks, configure HTTPS yourself | Existing domain names, proxies, or ready-made network portals |
| Dynamic domain name + open port | Open the port and regularly update a record of A on the selected platform | Domain name, platform credentials, available public access points, port mapping, and external HTTPS | The home public network address will change, so I hope the computer updates and parses it on its own |

The third method can replace the dynamic domain name update program on Raspberry Pi or another machine, provided the original device only handles this task. If the original device still performs reverse proxy, certificate renewal, or other services, these functions must be retained or migrated by you. **Do not shut down the entire old device just because the domain update succeeds. **

## ⚡ 3. First, connect the Harness currently in use on the computer

Open the "Connection Center" of the Black Fan Assistant. "Built-in Runtime Environment" is ready, indicating the assistant's own components are available; "Original Harness Session" is connected, indicating it has connected to the original workspace.

1. First, keep the official Harness running normally.

2. If the page says "Access existing Harness," click it and refresh the status. This applies to environments where an existing connector already exists.

3. When using it for the first time, select the current Harness configuration under "Select Configuration in Use," then click "Mount Connector." Users with multiple configurations should select the one they actually use for their work.

4. Wait for Harness to load the connector, then refresh. If it doesn't load automatically, wait for the original task to be free and reopen Harness.

5. After seeing "Original Harness session: Connected," start the remote entry again.

Here, only the original workspace is added as an entry. When a task is running, wait until it reaches the appropriate pause point; don't forcibly end the original process just to refresh the state. If no configuration is available, return to the official Harness for the first startup, then come back to refresh.

## 💰 4. Method One: Temporary link, first use this one

On the left, enter "Remote Entry" and select "Temporary Link · Automatic Generation" as the connection method, then click "Save Connection Method". Return to "Connection Center" and click "Start Remote Connection". Once the entry is ready, click "Generate Pairing QR Code".

![Temporary Link Settings | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-temporary-28d1609c7c.jpg)

Open the complete link you get by scanning the QR code with your phone's system browser. The link contains one-time matching information, valid within ten minutes, and can only be redeemed once. Don't treat it as a regular website address you can share publicly; If you switch to another browser, you must also pair separately.

Go to the phone page, find the test session you just mentioned, and send "Reply only: Phone connection is normal, do not call the tool." ** Only when the phone receives a real reply from this new message does the connection complete. ** Keep the computer online, and the model and original Harness should remain usable.

![Webpage Message Sending and Receiving | Tested on October 23, 2026 with the old version](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-web-message-history-74a6376fd4.jpg)

This preserved web acceptance diagram shows the result that should be checked: a new message is sent, and the model does return the corresponding response. It comes from the old independent web acceptance on October 23 and cannot replace your current version or current network testing; Model response speed does not represent execution speed for complex tasks.

Temporary links do not require a custom domain name or router mapping. Traffic is forwarded through Cloudflare's temporary channel, and the network must be able to access the service; Addresses may change after recreation, and there is no guarantee of continued availability. If connection fails, first check the "Check & Help" entry results; do not disable pairing or certificate verification to make up for success.

## 🧩 5. Method 2: Open the port and continue using your existing network entry

If you can already access your home computer from an external network, this method is the most straightforward. Go to "Remote Entry" and select "Open Port · Configure and Interface by Yourself", mainly fill in three items.

![Open Port Settings | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-open-port-a520a93fca.jpg)

| Project | How to fill it out | The meaning of the example |
| --- | --- | --- |
| Listening address | When forwarding directly from the router to the local machine, it usually uses 0.0.0.0; for same-machine reverse proxy, you can use 127.0.0.1 | The former allows access from the computer's network card, while the latter only receives access from the same computer |
| Listening ports | Select an unoccupied local port, default is 8767 | This is the port for the Black Fan Assistant HTTP service |
| External access address | The full address actually accessed by the phone, including protocols; if not a default port, write the port | HTTPS, domain ai.example.com, external port 19527 |

Full configuration example (replace the domain with your own):

```url
https://ai.example.com:19527
```

**0.0.0.0 is a listening setting and cannot be entered as a access address in the mobile browser. ** 127.0.0.1 is "This device itself": The phone will only find the phone itself to access it. 192.168.1.100 This type of address is a local area network address and usually cannot be used directly from the home network.

### Scenario A: The router forwards directly to the Heifen Assistant

Assuming the computer's LAN address is 192.168.1.100 and the assistant listens at 0.0.0.0:8767, the router can set "External TCP port 19527 → 192.168.1.100:8767". Different routers may call the entry port forwarding, virtual server, or NAT mapping. It is recommended to reserve the DHCP address for the computer to avoid changes in the internal network address after reboot.

This connection goes directly to the HTTP service. Use HTTP and your actual external port:

```url
http://YOUR_PUBLIC_IP_OR_DOMAIN:19527
```

** Only port forwarding is performed; you cannot change HTTP to HTTPS to get an encrypted connection. ** To protect session and pairing information during public network access, HTTPS should be deployed externally before using it; This direct HTTP explanation is for understanding port relationships and is not recommended as a long-term public network entry.

### Case B: HTTPS proxy and certificate already exist

Suppose the same computer already has HTTPS service listening for 19527 and forwarding the request to `http://127.0.0.1:8767`. The assistant can listen on 127.0.0.1:8767. Enter the HTTPS example below as the external access address; the router mapping target is the **HTTPS listening port 19527** on the computer.

```url
https://ai.example.com:19527
```

The complete order is: mobile phone → public address corresponding to the domain: 19527 → router → external HTTPS service: 19527 → Hater Assistant HTTP: 8767 → original Harness. If the proxy is on another device, the assistant must listen for the network card address accessible by that proxy; The proxy target cannot continue to enter the other device's own 127.0.0.1.

The proxy needs to retain the webpage and WebSocket connection. The certificate must cover the domain name accessed by the phone and be properly trusted by the browser; Application, private key storage, proxy configuration, and auto-renewal are all handled by your original external solution. Heifen Assistant does not import certificates or take over renewals.

Save the settings, return to "Connection Center" to launch it, and generate the QR code again. When verifying the public network, turn off Wi-Fi on your phone and access it via mobile network; This can eliminate the misjudgment that "only works on home Wi-Fi." If you can't open a public domain name on the same Wi-Fi connection, it may be related to the router's backflow access capability, so you need to verify both internal and external networks.

## 🚀 6. Method 3: Dynamic domain name + open ports to update the address book on your computer

The third method is to add automatic DNS updates to the network link mentioned in the previous section. **First, make sure the open port and external HTTPS work properly, then add dynamic domain names. Troubleshooting will be much easier. **

On your own resolution platform, first manually create a record A for mobile phone access. Here's a unified example: root domain example.com, host record ai, combined to form ai.example.com.

A records the actual public IPv4 of the home network; It only stores the address, not https, port, or URL path. example.com and the internal network addresses in the text are examples; replace them with your own values.

If you want to use the example.com directly, enter @ in the host record. For Alibaba Cloud and Tencent Cloud, select the default line for this record; Cloudflare must ensure that the complete host name has only one A record. The assistant only updates existing unique records and will not automatically create domain names or records; duplicate records or unenabled records need to be organized in the cloud first.

In the "Remote Entry" section, select "Dynamic Domain Name + Open Port". The listening address, listening port, and external access address should continue the actual link from the previous section; Then select the resolution platform, fill in the root domain name and host records, and import the corresponding credentials.

![Alibaba Cloud Dynamic Domain Domain Form | Isolated Demo](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-ddns-aliyun-53da9bd544.jpg)

For public address detection, you can select "Domestic Source · Dual-source Verification". Updates will only occur if both sources are successful and the results are consistent; If the detection fails or the results differ, the update will stop. When enabling a proxy, especially verify whether the test result matches the public IPv4 of your home router. Do not write the proxy server export into your home domain.

"Router Public Network IPv4 (optional)" is usually left blank for the program to detect automatically. After manual entry, this value is used consistently, suitable for situations where you clearly know which address to write; If the home public network address changes, it will not correct this manual input value for you.

First, click "Save Connection Method," then click "Check parsing configuration (do not modify records)". The check will read cloud records, display whether the records exist, and check if the address matches; The check button will also verify and save valid local form settings, **not writing parsing records to the cloud**. After checking, return to the home page to start the connection, synchronize once at startup, then check every five minutes; If the address does not change, do not write again.

DDNS can update domain names but cannot penetrate the operator's internal network. If the router's WAN address belongs to the operator's internal network, has multi-level NAT, or the inbound port is restricted by the carrier, simply adding the domain name and mapping may still prevent access from the public network. In this case, temporary links can be used first, or you can arrange a network plan that supports inbound access yourself. Current dynamic updates target IPv4 A records and are not responsible for AAAA records.

## 🧠 7. Alibaba Cloud: Create a dedicated RAM user and download the AccessKey file

First, confirm that the domain name resolution is indeed managed by Alibaba Cloud. Open [Alibaba Cloud RAM Console](https://ram.console.aliyun.com/) and operate it with an administrator with permissions. RAM users are like a separate work pass issued to the app: only let it search for and modify the specified domain, avoiding handing over the entire cloud account key to the software.

1. Create dedicated users in "Identity Management → Users," such as hyphen-ddns.

2. Choose the permanent AccessKey access method for the program; Accounts used only for assistants usually do not require console login.

3. Create a custom policy under "Permission Management → Permission Policy," switch to script editing, restrict operations to DescribeDomainRecords and UpdateDomainRecord, and restrict resources to your target domain.

4. Go back to the RAM user's "Add authorization," select the custom policy you just created, and confirm the binding. A policy was created but not bound, and the program still has no permissions.

5. Enter the user's "Credential Management" to create an AccessKey and complete the verification on the page. Secret will only appear once when created; download the CSV file immediately and save it properly.

![Alibaba Cloud User Entry | Official Old Version Examples](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-aliyun-subuser-choice-6271b13528.jpg)

The above image shows Alibaba Cloud's official old security prompt, helping to identify subuser entrances. The current path is checked by [to create RAM users](https://help.aliyun.com/zh/ram/user-guide/create-a-ram-user) and [to create AccessKey](https://help.aliyun.com/zh/ram/user-guide/create-an-accesskey-pair).

Do not bind AdministratorAccess or AliyunRAMFullAccess to the assistant; These are permissions for managing cloud accounts or identities, not required for resolving or updating the data.

You can start from the following minimal operation set, **replace ACCOUNT_ID and example.com with the Alibaba Cloud account ID and actual root domain name of the resource**.

> Domain-level permissions do not restrict the AI record alone; only the assistant itself filters the recorded hosts.

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

If console validation requires adjusting resource syntax, use the target domain ARN generated by the resource selector; Do not use administrator privileges to cover up the resource range error. This working user does not need to manage other RAM users separately, nor does it require certificate permissions.

![Alibaba Cloud Download CSV | Official Old Version Examples](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-aliyun-download-csv-d39682ba98.jpg)

The official "Download CSV file" allows you to skip manual copying. The two columns used for software import are AccessKey ID and AccessKey Secret. If the downloaded content does not meet the format requirements below, organize it into corresponding CSV or JSON files before importing; Do not upload a full multi-account credential list.

```csv
AccessKey ID,AccessKey Secret
替换为自己的AccessKeyID,替换为自己的AccessKeySecret
```

You can also save the following JSON. This is the **credential file**, which serves a different purpose than the **permission policy file** above; The permission policy is placed in the RAM console before the credential file is imported into the BlackFan Assistant.

```json
{"provider":"aliyun","AccessKeyId":"自己的AccessKeyID","AccessKeySecret":"自己的AccessKeySecret"}
```

In the assistant, select "Alibaba Cloud → import key file," choose CSV or JSON, and after the import is successful, click save. File import only skips filling out text and does not create users or authorizations for you on Alibaba Cloud.

For instructions on downloading and displaying one-time content, see [official creation and save tutorial](https://help.aliyun.com/zh/ram/product-overview/quick-start-create-and-use-accesskey-pairs-for-programmatic-calls). Currently, the assistant does not support STS temporary credentials.

## 📉 8. Tencent Cloud DNSPod: Use Tencent Cloud API keys, not legacy tokens

Open [Tencent Cloud Access Management CAM](https://console.cloud.tencent.com/cam), create a subuser dedicated to dynamic domain names, and select program access. Do not hand over the main account key to the assistant, nor look for the ID/Token on the old DNSPod token page; Currently, the implementation calls Tencent Cloud API 3.0, which requires a pair of SecretId and SecretKey.

### First, bind domain name permissions to the sub-user

Create a custom policy in CAM under "Policies" using the policy generator or following syntax. Select the DNSPod service, keep only DescribeRecordList (query records) and ModifyDynamicDNS (update dynamic records), select the target domain for resources, and then associate the policy with the previous subuser.

| Values that need to be prepared | Where to look | Purpose |
| --- | --- | --- |
| Main account UIN | Tencent Cloud account information page | The account belonging to the resource in the permission policy |
| DomainId | DNSPod domain details, or the administrator can call DescribeDomain to query | domain name resources with limited authorization; RecordId, not a record of A |
| Root domain name | The domain name actually hosted in DNSPod | Enter the assistant root domain in the field of domain name |

Below is an example of narrowing operations using [Tencent Cloud authorization syntax,](https://cloud.tencent.com/document/product/302/105718) and [resource type descriptions,](https://cloud.tencent.com/document/product/302/105719) narrowing operations. **Replace OWNER_UIN and DOMAIN_ID**, do not save placeholders as they are.

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

QcloudDNSPodFullAccess is a broader DNSPod read/write system policy, including more resources and operations, and is not the minimum authorization for these two interfaces. Read-only policies cannot update addresses. Whether permissions are effective in real accounts requires assistant verification and subsequent updates; policy savings cannot be judged as successful.

### Then create and save the API key

Go to "User List → Target Subuser → API Key", click "New Key", and complete verification on the page. Immediately save SecretId and SecretKey; SecretKey cannot be queried again.

For specific steps, see [Tencent Cloud Sub-Account Key Management](https://cloud.tencent.com/document/product/598/37140).

![Tencent Cloud Subuser API Key Page | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-tencent-subuser-api-bcc0ea6229.jpg)

![Tencent Cloud New Key Button | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-tencent-create-key-e1f5537f3a.jpg)

If the creation page is available for download, after saving, first check the table header; You can also save this pair of values as a set of CSV below. You don't need to enter your Tencent Cloud login password into the file, nor import CAM permission policies.

```csv
SecretId,SecretKey
替换为自己的SecretId,替换为自己的SecretKey
```

The JSON format is also usable:

```json
{"provider":"tencent","SecretId":"自己的SecretId","SecretKey":"自己的SecretKey"}
```

Reply to the Heifen Assistant: select "Tencent Cloud DNSPod" on the platform, enter the root domain example.com, host records enter ai, import, save, and check. DNSPod must have the default line A record.

Assistant calls [Dynamically update interfaces](https://cloud.tencent.com/document/api/1427/56158) No need to enter a region, and the interface does not need to select Guangzhou or Shanghai.

![Tencent Cloud Solution Form | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-ddns-tencent-d60f79a9c0.jpg)

## 🎯 9. Cloudflare: Create API Tokens for a limited area

First [Cloudflare console](https://dash.cloudflare.com/) Confirm that the domain domain area is active and that authoritative resolution is indeed handed over to Cloudflare. On its DNS record page, first create a unique A record corresponding to the AI.

Go to "My Profile → API Tokens", click "Create Token", and use the "Edit zone DNS" template or custom tokens. In the English interface, you can follow the corresponding fields below.

| Console project | How should you choose? | Why? |
| --- | --- | --- |
| Permissions | Zone → DNS → Edit | Read, list, and update DNS records; Edit permissions include the corresponding read capabilities |
| Zone Resources | Include → Specific zone → your own example.com | Only the token operates on this domain domain |
| Zone → Zone → Read | Added when automatically searching for zones; Optionally omitted when manually filling in Zone ID | Allows assistants to find regions by root domain |
| Client IP Address Filtering | Only set it once the exit is stable | The home exit will change, and binding the old address will cause subsequent calls to fail |
| TTL / Validity Period | Set it according to your own rotation plan | This is the token validity period, which is different from the DNS record cache time |

![Cloudflare Token Permission Page | Official Example](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-cloudflare-token-permissions-81053f21e8.jpg)

** In the official sample image, the resource section shows 'All zones', which is used only to identify page locations. In practice, change the configuration to Specific zone and select your own domain name. ** The Zone Read in the image corresponds to an automatic search area; If you want to reduce this permission, enter your own Zone ID.

Click "Continue to summary," check the authorized domain and scope of operations, then create the token. Copy and securely save the token value, which is only displayed once when creation is complete. Do not copy the entire curl test command, nor use the Global API Key.

[Official token creation instructions](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) provides the current field and the complete process.

![Cloudflare Permission Confirmation Summary | Official Examples](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-cloudflare-token-summary-ea99672621.jpg)

The Zone ID is the number of this domain name range, usually a 32-bit hexadecimal string.

Search in the API area of the domain overview page; You can also follow the [Official Account and Region ID Guide](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/) on the current interface. **Do not enter the Account ID into the Zone ID. **

The easiest file is TXT: just put the token itself in one row, without quotes or the "Token=" prefix. Choose UTF-8 plaintext for save; don't save as a Word document or rich text file. If you import the Zone ID at the same time, you can use JSON:

```json
{
  "provider": "cloudflare",
  "apiToken": "自己的APIToken",
  "zoneId": "替换为自己的32位ZoneID"
}
```

The zoneId above is a placeholder and must be replaced with a true 32-bit value; If the assistant searches automatically, the entire zoneId field is deleted, and the token must have Zone Read permissions. Also supports two-column CSV:

```csv
APIToken,ZoneId
替换为自己的APIToken,替换为自己的32位ZoneID
```

![Cloudflare Forms Parsed | Isolation Demo](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-ddns-cloudflare-e265b68acb.jpg)

After importing, save and check. When using custom public ports like 19527, note that Cloudflare's Orange Cloud proxy does not support arbitrary ports. When only domain name resolution is needed, you can set the record to "DNS only"; If you want to use a proxy, choose it yourself [Officially supported ports and solutions](https://developers.cloudflare.com/fundamentals/reference/network-ports/).

**Only DNS will not automatically provide HTTPS to your computer**; certificates are still managed by external solutions. When the assistant updates records, it retains the existing proxy switch and TTL, and does not switch between orange cloud or graycloud for you.

## 🔍 10. What are the differences between importing, saving, rechanging, and clearing files?

All three platforms follow this order: **Select platform → Enter domain name and host records → Import the corresponding credential file → Save connection method → Check resolution configuration → Start connection → Phone verification. **

After importing, the field content will be hidden, and the interface will prompt "Credentials have been imported." At this point, you are only filling in the current form; Only after clicking Save will it be written to the local machine. If the page does not display plaintext echo, it does not mean the file was not loaded. After saving, it shows "Saved, no need to fill in again," indicating that the old credentials from the same platform are still present; Leaving the input box blank will continue to use it.

![File Import Success Prompt | Isolation Demonstration](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-app-import-result-334cf64005.jpg)

| Things I want to do | Operate correctly |
| --- | --- |
| Add credentials for the first time | After importing or filling in the information, click Save and then check |
| Replace the Alibaba Cloud/Tencent Cloud paired key | Replace both items together, or import new files and save them |
| Modify parameters during connection runtime | Click "Stop Connection and Modify Configuration" first; the phone will disconnect, and the original Harness task will continue |
| Forget the old credentials saved by the machine | Click "Clear Saved Key" and confirm, then import the new credential |
| Switching from Alibaba Cloud to Cloudflare | After switching platforms, re-import the platform credentials and will not mix the old platform keys |
| Completely disable the leaked credentials | Besides local device clearance, you also need to disable or revoke that key on the cloud platform |

Clearing the local key will retain the domain name and listening parameters, do not delete cloud records, do not modify certificates, and do not revoke the cloud platform key. The original CSV/JSON/TXT files remain in the location you saved; During import operations, do not upload the original file, nor copy the original file into the application directory, but the saved credentials will remain in the private local configuration. Please protect your computer account and backups; do not place key files in public cloud drives or code repositories.

Only one set of credentials is imported at a time, and the file must not exceed 64KB. Multi-account files, duplicate fields, or platform mismatches will be rejected. The Chinese placeholders in the sample files in this article cannot be used to connect to real platforms; The certificates fullchain.pem and privkey.pem are also not credential files here.

## ⚡ 11. From "Showing Started" to Truly Usable

When using temporary links, just pair after checking that the channel is ready; When using your own domain name, check in the order below, and if you fail any step, process the layer first.

1. The native Harness on the computer can receive model responses.

2. The assistant shows that the original session is connected and the gateway is activated.

3. Dynamic domain name mode can find unique A records and verify that public network addresses match routers. Cloud platforms confirm record values are correct; Old DNS caches may still need to wait for TTL.

4. Using mobile networks on mobile phones can open external HTTPS addresses, and browsers have no certificate errors.

5. Use the newly generated complete matching link to complete the match within the validity period.

6. On the phone, enter the original test session and send "Only reply: Phone connection is normal, no tool called," waiting for a new reply.

7. Refresh the phone page and send another simple message to confirm that the static page is not just open.

If migrating DDNS from another device, first record the old configuration, confirm that the assistant has found the correct record, completed startup synchronization, and completed the next five-minute check, then disable the program that updated the same record on the old device. Both programs maintain the same record simultaneously, especially when different exits are detected, which may overwrite back and forth. Other services such as certificate renewal continue to operate as planned.

The current version has passed the build and installation startup checks for the three systems; Alibaba Cloud already has records of real-world environment resolution, updates, recovery, and message sending and receiving records.

** Tencent Cloud and Cloudflare completed official interface and signature verification, isolated simulated interface, and import interface acceptance, without using real cloud accounts for DNS writes. ** Account permissions, plans, networks, and final resolution results should still be verified in the above order in your own environment.

### When encountering problems, first look at which layer it is

| Phenomenon | Priority checks |
| --- | --- |
| The start button cannot be pressed | Whether the original Harness is accessed; Whether dynamic domain credentials have been saved |
| Parsing check prompts 'unauthorized not authorized.' | Whether the account is selected, whether the policy is bound, whether the domain resource scope is correct, and whether the key is valid |
| Records cannot be found or records are not unique | A Whether records are pre-created, whether hostnames are correct, and whether default lines are duplicated |
| Domain name resolution works, but phone won't open the phone | Public network inbound conditions, router target address, external listening port, firewall, and proxy target |
| HTTPS certificate error | Domain name, validity period, certificate chain, and renewal of external certificates; No certificate repair entry within the app |
| Only the same Wi-Fi is available | Check if the LAN address has been misused; Then verify the public network entry point with the mobile network |
| The phone was open, but there was no conversation | Check whether the original configuration was correctly selected, whether connectors are loaded, and whether the original session authentication is normal |
| Pairing link is invalid | Regenerate and redeem within ten minutes; Pair with different browsers separately, then re-pair after the gateway restarts |
| The parsed value becomes a proxy export | Stop connecting, verify the outlet inspection, switch to the appropriate testing method, and only start after confirming |
| Cloudflare stopped working after opening Orange Cloud | Check whether the external port is within the standard proxy support range, and whether the backbound HTTPS matches the proxy mode |

## 💰 12. How to use it daily: Keep computer tasks and manage phone access well

Closing the Hefen Assistant window will keep the background connection; Stopping the assistant connection will disconnect the phone and will not stop the original tasks on the computer. To restore the connection, restart the entry and pair as needed. When the computer is dormant, shuts down, Harness exits, or the model service is unavailable, the phone will not continue to function normally.

After pairing, the phone can continue to operate the original session, prioritizing your own device and trusted browser. When taking screenshots, live streaming, or sharing demonstrations, hide the full QR code, pairing link, cloud platform key, and private session. When someone receives matching information or keys, they must revoke both the phone login and cloud platform credentials, not just one screenshot.

Under "Check & Help," you can disable anonymous statistics under "Enhance User Experience." The scope of statistics includes device identifiers, versions, systems, and architectures after product isolation, without collecting sessions, commands, files, or keys; For specific scopes, please refer to the privacy documentation. If you need to troubleshoot version issues based on this information, first check the instructions here.

The easiest to replicate the starting sequence is: **First, let the computer reply, then use a temporary link to get the phone to receive the reply; If you already have a public network entry, switch to open the port, and follow the changes in your home public network address before opening a dynamic domain. ** You can stop on any route according to your network, without having to configure all three cloud platforms just to use the mobile entry point.

The Heifen Assistant can be downloaded and updated from the [public release page](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases/latest). If it saves you time sitting in front of your computer, feel free to support development through the "Sponsored Support" section on the homepage; For more self-made software, visit [HyphenTech official website](https://hyphentech.top).


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenAssistant
> **Status:** Early build · Preview
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
