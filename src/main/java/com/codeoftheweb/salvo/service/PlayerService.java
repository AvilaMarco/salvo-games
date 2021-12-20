package com.codeoftheweb.salvo.service;

import com.codeoftheweb.salvo.dto.PlayerDTO;
import com.codeoftheweb.salvo.dto.PlayerScoreDTO;
import com.codeoftheweb.salvo.exception.not_found.PlayerNotFoundException;
import com.codeoftheweb.salvo.exception.unauthorized.PlayerNotLoginException;
import com.codeoftheweb.salvo.models.Player;
import com.codeoftheweb.salvo.models.Score;
import com.codeoftheweb.salvo.repository.PlayerRepository;
import com.codeoftheweb.salvo.service.intereface.IPlayerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService implements IPlayerService {

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    ModelMapper mapper;

    @Override
    public PlayerDTO getPlayer(String email) {
        Player player = playerRepository.findByEmail(email).orElseThrow(() -> new PlayerNotFoundException(email));
        return mapper.map(player, PlayerDTO.class);
    }

    @Override
    public PlayerDTO getPlayer(Authentication authentication) {
        if(isGuest(authentication)) return new PlayerDTO("Guess");
        else return getPlayer(authentication.getName());
    }

    @Override
    public List<PlayerDTO> getPlayers() {
        List<Player> players = playerRepository.findAll();
        return players.stream()
                .map( p -> mapper.map(p, PlayerDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerScoreDTO> getPlayersScore(){
        return playerRepository.findAll().stream()
                .map( p ->  new PlayerScoreDTO(
                                mapper.map(p, PlayerDTO.class),
                                p.getScores().stream().map(Score::getScore).collect(Collectors.toList())
                            )
                )
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDTO save(Player player) {
        return mapper.map(playerRepository.save(player), PlayerDTO.class);
    }

    @Override
    public void validated(Player player) {

    }

    // TODO: New service for save this methods
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

    private void isAuthenticated(Authentication authentication){
        if(isGuest(authentication)) throw new PlayerNotLoginException();
    }
}
