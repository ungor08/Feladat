<?php 
    class Feladat {
        
        private $conn;
        private $table = 'feladatok';

        
        public $feladat_azonosito;
        public $letrehozas_datuma;
        public $ugyintezo_azonosito;
        public $ugyintezo_nev;
        public $ugyintezo_email;
        public $feladat_leiras;

        
        public function __construct($db) 
        {
            $this->conn = $db;
        }

        
        public function read() {
            
            $query = 'SELECT u.ugyintezo_nev as ugyintezo_nev,
                    f.feladat_azonosito,
                    f.letrehozas_datuma,
                    f.ugyintezo_azonosito,
                    u.ugyintezo_email as ugyintezo_email,
                    f.feladat_leiras 
                FROM
                    ' . $this->table . ' f
                LEFT JOIN
                    ugyintezo u ON f.ugyintezo_azonosito = u.ugyintezo_azonosito
                ORDER BY
                    f.letrehozas_datuma DESC';

            
            $stmt = $this->conn->prepare($query);

            
            $stmt->execute();

            return $stmt;
        }


        
        public function read_single() {
            
            $query = 'SELECT u.ugyintezo_nev as ugyintezo_nev,
                    f.feladat_azonosito,
                    f.letrehozas_datuma,
                    f.ugyintezo_azonosito,
                    u.ugyintezo_email as ugyintezo_email,
                    f.feladat_leiras 
                    FROM
                        ' . $this->table . ' f
                    LEFT JOIN
                        ugyintezo u ON f.ugyintezo_azonosito = u.ugyintezo_azonosito
                    WHERE
                        f.feladat_azonosito = ?
                    LIMIT 0,1';
                 
            
            $stmt = $this->conn->prepare($query);

            
            $stmt->bindParam(1, $this->azonosito);

            
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            
            $this->feladat_azonosito = $row['feladat_azonosito'];
            $this->letrehozas_datuma = $row['letrehozas_datuma'];
            $this->ugyintezo_azonosito = $row['ugyintezo_azonosito'];
            $this->ugyintezo_nev = $row['ugyintezo_nev'];
            $this->ugyintezo_email = $row['ugyintezo_email'];
            $this->feladat_leiras = $row['feladat_leiras'];

        }


        
        public function create() {
            
            $query = 'INSERT INTO ' . $this->table . '
                SET
                    ugyintezo_azonosito = :ugyintezo_azonosito,
                    feladat_leiras = :feladat_leiras,
                    letrehozas_datuma = NOW()';

            
            $stmt = $this->conn->prepare($query);

            
            $this->ugyintezo_azonosito = htmlspecialchars(strip_tags($this->ugyintezo_azonosito));
            $this->feladat_leiras = htmlspecialchars(strip_tags($this->feladat_leiras));

            
            $stmt->bindParam(':ugyintezo_azonosito', $this->ugyintezo_azonosito);
            $stmt->bindParam(':feladat_leiras', $this->feladat_leiras);

            
            if ($stmt->execute()) {
                return true;
            }

            
            printf("Error %s. \n", $stmt->error);

            return false;

        }


        
        public function update() {
            
            $query = 'UPDATE ' . $this->table . '
                SET
                    ugyintezo_azonosito = :ugyintezo_azonosito,
                    feladat_leiras = :feladat_leiras
                WHERE
                    feladat_azonosito = :feladat_azonosito';

            
            $stmt = $this->conn->prepare($query);

            
            $this->ugyintezo_azonosito = htmlspecialchars(strip_tags($this->ugyintezo_azonosito));
            $this->feladat_leiras = htmlspecialchars(strip_tags($this->feladat_leiras));
            $this->feladat_azonosito = htmlspecialchars(strip_tags($this->feladat_azonosito));

            
            $stmt->bindParam(':ugyintezo_azonosito', $this->ugyintezo_azonosito);
            $stmt->bindParam(':feladat_leiras', $this->feladat_leiras);
            $stmt->bindParam(':feladat_azonosito', $this->feladat_azonosito);

            
            if ($stmt->execute()) {
                return true;
            }

            
            printf("Error %s. \n", $stmt->error);

            return false;

        }


        
        public function delete() {
            
            $query = 'DELETE FROM ' . $this->table . ' WHERE feladat_azonosito = :feladat_azonosito';

            
            $stmt = $this->conn->prepare($query);

            
            $this->azonosito = htmlspecialchars(strip_tags($this->feladat_azonosito));

            
            $stmt->bindParam(':feladat_azonosito', $this->feladat_azonosito);

            
            if ($stmt->execute()) {
                return true;
            }

            
            printf("Error %s. \n", $stmt->error);

            return false;
        }


    }
?>