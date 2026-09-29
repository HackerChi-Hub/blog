// 用系统 Vision 解码二维码，只输出「能否解码」和内容的 SHA-256 前 16 位。
// 不打印内容本身：赞赏码的 payload 没必要出现在日志或对话里，
// 而比对哈希已经足够证明「压缩前后是同一个码」。
import Foundation
import CoreImage
import Vision
import CryptoKit

guard CommandLine.arguments.count > 1,
      let img = CIImage(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1])) else {
    print("READ_FAIL"); exit(1)
}
let req = VNDetectBarcodesRequest()
try? VNImageRequestHandler(ciImage: img).perform([req])
guard let r = req.results?.first, let payload = r.payloadStringValue else {
    print("NO_QR_FOUND"); exit(2)
}
let digest = SHA256.hash(data: Data(payload.utf8))
let hex = digest.map { String(format: "%02x", $0) }.joined().prefix(16)
print("OK symbology=\(r.symbology.rawValue) len=\(payload.count) sha256_16=\(hex)")
