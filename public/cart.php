<?php 

$json = file_get_contents('php://input');
$data = json_decode($json, TRUE);

$emailUser = $data['email'];
$emailAdmin = "alex@smetko.bg";
$emailOffice = "office@safetyshoes.bg";
$emailOffice2 = "accuoil@gmail.com";
// accuoil@gmail.com

// $body = json_encode($data, JSON_PRETTY_PRINT);
// $body = utf8_decode(json_encode($data, JSON_PRETTY_PRINT));
$body = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
// $body = html_entity_decode(json_encode(array_map('htmlentities', $data), JSON_PRETTY_PRINT));
$subject = "Нова поръчка от Safetyshoes.bg";

$headersAdmin =  "From:" . $data['email'] . "\r\n";
$headersAdmin .= "Content-Type: text/plain; charset=UTF-8" . "\r\n";
$headersAdmin .= "Reply-To: " . $data['email'] . "\r\n";

$headersUser =  "From:" . $emailOffice . "\r\n";
$headersUser .= "Content-Type: text/plain; charset=UTF-8" . "\r\n";
$headersUser .= "Reply-To: " . $emailOffice . "\r\n";

$sentToAdmin = mail($emailAdmin, $subject, $body, $headersAdmin);
$sentToUser = mail($emailUser, $subject, $body, $headersUser);
$sentToOffice = mail($emailOffice, $subject, $body, $headersAdmin);
$sentToOffice2 = mail($emailOffice2, $subject, $body, $headersAdmin);

$result = [];
if ($sentToAdmin) array_push($result, "sent to admin");
if ($sentToUser) array_push($result, "sent to user");
if ($sentToOffice) array_push($result, "sent to office");
if ($sentToOffice2) array_push($result, "sent to office2");
array_push($result, $data);

header('Content-type: application/json; charset=UTF-8');
echo json_encode($result);

?>