<?php

// $data = json_decode('{
//     "items": [
//         {
//             "index": "02-0010860",
//             "internalName": "FOOD TRAX 2.1 UNISEX обувки черни S3",
//             "count": 2,
//             "size": 36,
//             "additionalDetails": "",
//             "subTotal": "352.40",
//             "priceSingle": "176.20"
//         },
//         {
//             "index": "01-110831",
//             "internalName": "831 Боти BLAST 110-831 черни F2A",
//             "count": 1,
//             "size": 38,
//             "additionalDetails": "",
//             "subTotal": "391.80",
//             "priceSingle": "391.80"
//         },
//         {
//             "index": "02-0010860",
//             "internalName": "FOOD TRAX 2.1 UNISEX обувки черни S3",
//             "count": 1,
//             "size": 36,
//             "additionalDetails": "допълнителни инстртукции",
//             "subTotal": "176.20",
//             "priceSingle": "176.20"
//         }
//     ],
//     "total": "920.40",
//     "name": "aa",
//     "phone": "bb",
//     "email": "alex@urghh.net",
//     "address": "dd",
//     "additionalDetails": "eee",
//     "paymentMethod": "cashOnDelivery"
// }', true);

// var_dump($data);

function buildEmailHtml($data)
{
    $tpl = file_get_contents('new_order.template');
    
    $tpl = str_replace("%CUSTOMER_NAME%", $data['name'], $tpl);
    $tpl = str_replace("%CUSTOMER_PHONE%", $data['phone'], $tpl);
    $tpl = str_replace("%CUSTOMER_EMAIL%", $data['email'], $tpl);
    $tpl = str_replace("%CUSTOMER_ADDRESS%", $data['address'], $tpl);
    $tpl = str_replace("%ADDITIONAL_DETAILS%", $data['additionalDetails'], $tpl);
    
    switch ($data['paymentMethod']) {
        case 'cashOnDelivery':
            $tpl = str_replace("%CUSTOMER_PAYMENT_METHOD%", "Наложен платеж", $tpl); break;
        case 'iban':
            $tpl = str_replace("%CUSTOMER_PAYMENT_METHOD%", "Банково плащане", $tpl); break;
        default:
            $tpl = str_replace("%CUSTOMER_PAYMENT_METHOD%", $data['paymentMethod'], $tpl); break;
            break;
    }

    
    $tpl_articles = '<ul>';
    foreach ($data['items'] as $item) {
        $tpl_articles .= '<li>#[' . $item['index'] . '] ' . $item['internalName'] . ' (размер ' . $item['size'] . ') ' .  $item['count'] . 'x ' . $item['priceSingle'] . ' лв. = ' . $item['subTotal'] . ' лв.';
        if ($item['additionalDetails'])
        {
            $tpl_articles .= ' Допълнителни инструкции  - ' . $item['additionalDetails'];
        }
        $tpl_articles .= '</li>';
    }
    $tpl_articles .= '</ul>';
    $tpl = str_replace("%ARTICLE_LIST%", $tpl_articles, $tpl);
    
    $tpl = str_replace("%TOTAL_COST%", $data['total'], $tpl);
    return $tpl;
}

?>