<?php 

$json = file_get_contents('php://input');
$data = json_decode($json, TRUE);

$emailUser = $data['email'];
$emailAdmin = "alex@smetko.bg";
$emailOffice = "office@safetyshoes.bg";
$emailOffice2 = "accuoil@gmail.com";
// accuoil@gmail.com

// $body = json_encode($data, JSON_PRETTY_PRINT);
$body = utf8_decode(json_encode($data, JSON_PRETTY_PRINT));
// $body = html_entity_decode(json_encode(array_map('htmlentities', $data), JSON_PRETTY_PRINT));
$subject = "Нова поръчка от Safetyshoes.bg";
$headers =  "From:" . $data['email'];
$headers .= "\nContent-Type: text/plain; charset='utf-8'";

$sentToAdmin = mail($emailAdmin, $subject, $body, $headers);
// $sentToUser = mail($emailUser, $subject, $body, $headers);
// $sentToOffice = mail($emailOffice, $subject, $body, $headers);
// $sentToOffice2 = mail($emailOffice2, $subject, $body, $headers);

$result = [];
if ($sentToAdmin) array_push($result, "sent to admin");
if ($sentToUser) array_push($result, "sent to user");
if ($sentToOffice) array_push($result, "sent to office");
if ($sentToOffice2) array_push($result, "sent to office2");

echo json_encode($result);

?>