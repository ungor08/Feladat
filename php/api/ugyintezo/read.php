<?php 
    
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Ugyintezo.php';

    
    $database = new Database();
    $db = $database->connect();

    
    $ugyintezo = new Ugyintezo($db);

    
    $result = $ugyintezo->read();
    
    $num = $result->rowCount();

    
    if ($num > 0) {
        
        $ugyintezok_arr = array();
        $ugyintezok_arr['data'] = array();

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $ugyintezo_item = array(
                'ugyintezo_azonosito' => $ugyintezo_azonosito,
                'ugyintezo_nev' => $ugyintezo_nev,
                'ugyintezo_email' => $ugyintezo_email,
            );

            
            array_push($ugyintezok_arr['data'], $ugyintezo_item);
        }

        
        echo json_encode($ugyintezok_arr);
    } else {
        echo json_encode(
            array('message' => 'Nincsenek ügyintézők')
        );
    }

?>