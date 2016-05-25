<?php
    include "../../database/mysql.php";

    MySQL_select_db("test");
    
    $json = file_get_contents('php://input');
    $response = json_decode($json);
    
    $whereclause = "";
    if(isset($response->id )){
        $whereclause = " AND id = ".intval($response->id);
    }

    $query = 'SELECT id, name, language, tags, comment, code, created, owner FROM sad25_snippets WHERE deleted = 0'.$whereclause;

    $result = MySQL_query($query);
    $num = mysql_num_rows($result);
    
    class Snippet {
        public  $id;
        public  $name;
        public  $language;
        public  $tags;
        public  $comment;
        public  $code;
        public  $created;
        public  $owner;
    }
    
    $snippets = array(); 
   

    if ($num > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            // You have $row['ID'], $row['Category'], $row['Summary'], $row['Text']
            $tempSnippet = new Snippet();
            $tempSnippet->id        = $row['id'];
            $tempSnippet->name      = $row['name'];
            $tempSnippet->language  = $row['language'];

            //make shure tags is array
            if (is_array(json_decode($row['tags']))){
                $tempSnippet->tags      = json_decode($row['tags']);
            }else{
                $tempSnippet->tags      = [];
            }
            
            $tempSnippet->comment      = $row['comment'];
            $tempSnippet->code      = $row['code'];
            $tempSnippet->created   = $row['created'];
            $tempSnippet->owner     = $row['owner'];
            array_push($snippets, $tempSnippet);
        }
        
    }

    //$fp = fopen('file.txt', 'w');
    //fwrite($fp, print_r($snippets, TRUE));
    //fclose($fp);
    
    header('Content-Type: application/json');
    echo ")]}',\n".json_encode($snippets);
    //echo json_encode($snippets);
?>