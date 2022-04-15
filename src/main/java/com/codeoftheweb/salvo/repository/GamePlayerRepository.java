package com.codeoftheweb.salvo.repository;

import com.codeoftheweb.salvo.models.GamePlayer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GamePlayerRepository extends JpaRepository<GamePlayer, Long> {

    Optional<GamePlayer> findByPlayerIdAndGameId ( Long gameId, Long playerId );
}
