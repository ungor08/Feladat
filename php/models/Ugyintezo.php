<?php 
    class Ugyintezo {
        
        private $conn;
        private $table = 'ugyintezo';

        
        public $azonosito;
        public $nev;
        public $email;

        
        public function __construct($db) 
        {
            $this->conn = $db;
        }

        
        public function read() {
            
            $query = 'SELECT * FROM ' . $this->table;

            
            $stmt = $this->conn->prepare($query);

            
            $stmt->execute();

            return $stmt;
        }
    
    }

?>