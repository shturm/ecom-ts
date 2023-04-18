<?php 

$json = file_get_contents('php://input');
$data = json_decode($json, TRUE);

$emailUser = $data['email'];
$emailAdmin = "alex@smetko.bg";
$emailOffice = "alex@smetko.bg";

$body = $json;
$subject = "Нова поръчка от Safetyshoes.bg";
$headers =  "From:" . $data['email'];

$sentToAdmin = mail($emailAdmin, $subject, $body, $headers);
$sentToUser = mail($emailUser, $subject, $body, $headers);
$sentToOffice = mail($emailOffice, $subject, $body, $headers);

$result = [];
if ($sentToAdmin) array_push($result, "sent to admin");
if ($sentToUser) array_push($result, "sent to user");
if ($sentToOffice) array_push($result, "sent to office");

echo json_encode($result);

?>