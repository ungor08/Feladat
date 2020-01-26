<?php 


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');


include_once 'config/Database.php';
include_once 'models/Feladat.php';


$database = new Database();
$db = $database->connect();



$feladat = new Feladat($db);

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {

        if (isset($_GET['id'])) {
            $feladat->azonosito = isset($_GET['id']) ? $_GET['id'] : die();
            $feladat->read_single();            
            $feladat_arr = array(
                'feladat_azonosito' => $feladat->feladat_azonosito,
                'letrehozas_datuma' => $feladat->letrehozas_datuma,
                'ugyintezo_azonosito' => $feladat->ugyintezo_azonosito,
                'ugyintezo_nev' => $feladat->ugyintezo_nev,
                'ugyintezo_email' => $feladat->ugyintezo_email,
                'feladat_leiras' => $feladat->feladat_leiras
            );            
            print_r(json_encode($feladat_arr));
        } else {
            $result = $feladat->read();
            $num = $result->rowCount();
            if ($num > 0) {
                $feladatok_arr = array();
                $feladatok_arr['data'] = array();
                while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $feladat_item = array(
                        'feladat_azonosito' => $feladat_azonosito,
                        'letrehozas_datuma' => $letrehozas_datuma,
                        'ugyintezo_azonosito' => $ugyintezo_azonosito,
                        'ugyintezo_nev' => $ugyintezo_nev,
                        'ugyintezo_email' => $ugyintezo_email,
                        'feladat_leiras' => $feladat_leiras
                    );
                    array_push($feladatok_arr['data'], $feladat_item);
                }
                echo json_encode($feladatok_arr);
            } else {
                echo json_encode(
                    array('message' => 'Nincsenek feladatok')
                );
            }
        }

    } else if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $data = json_decode(file_get_contents("php://input"));
        $feladat->ugyintezo_azonosito = $data->ugyintezo_azonosito;
        $feladat->feladat_leiras = $data->feladat_leiras;
        if ($feladat->create()) {
            echo json_encode(
                array('message' => 'Feladat lértrehozva', 'status' => 201)
            );
        } else {
            echo json_encode(
                array('message' => 'A feladat nem lett létrehozva', 'status' => 500)
            );
        }

    } else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {

        if (!isset($_GET['id'])) {
            exit(json_encode(array('message' => 'A feladat nem lett módosítva', 'status' => 400)));
        }
        // $data = json_decode(file_get_contents("php://input"));
        $data = json_decode(file_get_contents("php://input"));
        $id = $_GET['id'];
        $feladat->feladat_azonosito = $id;
        $feladat->ugyintezo_azonosito = $data->ugyintezo_azonosito;
        $feladat->feladat_leiras = $data->feladat_leiras;
        if ($feladat->update()) {
            echo json_encode(
                array('message' => 'Feladat módosítva', 'status' => 200)
            );
        } else {
            echo json_encode(
                array('message' => 'A feladat nem lett módosítva', 'status' => 500)
            );
        }

    } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

        if (!isset($_GET['id'])) {
            exit(json_encode(array('message' => 'A feladat nem lett törölve', 'status' => 400)));
        }
        $feladat->feladat_azonosito = $_GET['id'];
        if ($feladat->delete()) {
            echo json_encode(
                array('message' => 'Feladat törölve', 'status' => 200)
            );
        } else {
            echo json_encode(
                array('message' => 'A feladat nem lett törölve', 'status' => 500)
            );
        }

    }
    
?>