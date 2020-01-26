-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2020. Jan 26. 21:09
-- Kiszolgáló verziója: 10.4.11-MariaDB
-- PHP verzió: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `feladat`
--
CREATE DATABASE IF NOT EXISTS `feladat` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `feladat`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `feladatok`
--

CREATE TABLE `feladatok` (
  `feladat_azonosito` int(11) NOT NULL,
  `letrehozas_datuma` date NOT NULL,
  `ugyintezo_azonosito` int(11) NOT NULL,
  `feladat_leiras` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ugyintezo`
--

CREATE TABLE `ugyintezo` (
  `ugyintezo_azonosito` int(11) NOT NULL,
  `ugyintezo_nev` varchar(200) NOT NULL,
  `ugyintezo_email` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `ugyintezo`
--

INSERT INTO `ugyintezo` (`ugyintezo_azonosito`, `ugyintezo_nev`, `ugyintezo_email`) VALUES
(1, 'Kovács Zoltán', 'kovacs.zoltan@gmail.com'),
(2, 'Kiss István', 'kiss.istvan@gmail.com'),
(3, 'Nagy Anna', 'nagy.anna@gmail.com'),
(4, 'Horváth Emese', 'horvath.emese@gmail.com'),
(5, 'Balogh Gábor', 'balogh.gabor@gmail.com');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `feladatok`
--
ALTER TABLE `feladatok`
  ADD PRIMARY KEY (`feladat_azonosito`),
  ADD KEY `ugyintezo_azonosito` (`ugyintezo_azonosito`);

--
-- A tábla indexei `ugyintezo`
--
ALTER TABLE `ugyintezo`
  ADD PRIMARY KEY (`ugyintezo_azonosito`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `feladatok`
--
ALTER TABLE `feladatok`
  MODIFY `feladat_azonosito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `ugyintezo`
--
ALTER TABLE `ugyintezo`
  MODIFY `ugyintezo_azonosito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `feladatok`
--
ALTER TABLE `feladatok`
  ADD CONSTRAINT `feladatok_ibfk_1` FOREIGN KEY (`ugyintezo_azonosito`) REFERENCES `ugyintezo` (`ugyintezo_azonosito`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
